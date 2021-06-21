import { set, isArray } from './utils'

function generateData(timers) {
  return Object.keys(timers).reduce(function(acc, cur) {
    return set(
      cur,
      {
        isRunning: false,
        time: timers[cur].time || 0,
        instance: null
      },
      acc
    )
  }, {})
}
function setTimer(repeat) {
  return repeat ? setInterval : setTimeout
}
function clearTimer(repeat) {
  return repeat ? clearInterval : clearTimeout
}
function generateTimer(options, vm) {
  return setTimer(options.repeat)(function() {
    vm.$emit('timers:tick:' + options.name)
    options.callback()
  }, options.time)
}
function normalizeConfig(config, vm) {
  if (process.env.NODE_ENV !== 'production') {
    if (!config.name) {
      throw new Error('[vue-timers.create] name is required')
    }
    if (!config.callback && typeof vm[config.name] !== 'function') {
      throw new ReferenceError(
        '[vue-timers.create] Cannot find method ' + config.name
      )
    }
    if (config.callback && typeof config.callback !== 'function') {
      throw new TypeError(
        '[vue-timers.create] Timer callback should be a function, ' +
          typeof config.callback +
          ' given'
      )
    }
  }
  return {
    name: config.name,
    time: config.time || 0,
    repeat: 'repeat' in config ? config.repeat : false,
    immediate: 'immediate' in config ? config.immediate : false,
    autoStart: 'autoStart' in config ? config.autoStart : false,
    isSwitchTab: 'isSwitchTab' in config ? config.isSwitchTab : false,
    callback: (config.callback && config.callback.bind(vm)) || vm[config.name]
  }
}
function normalizeOptions(options, vm) {
  return isArray(options)
    ? options.reduce(function(res, config) {
      return set(config.name, normalizeConfig(config, vm), res)
    }, {})
    : Object.keys(options).reduce(function(res, key) {
      return set(
        key,
        normalizeConfig(set('name', key, options[key]), vm),
        res
      )
    }, {})
}

export default {
  data() {
    if (!this.$options.timers) return {}
    this.$options.timers = normalizeOptions(this.$options.timers, this)
    return {
      timers: generateData(this.$options.timers)
    }
  },
  created() {
    if (!this.$options.timers) return
    const vm = this
    const data = vm.timers
    const options = vm.$options.timers
    vm.$timer = {
      /**
       * Start timer
       * @param {string} name
       */
      start(name) {
        if (process.env.NODE_ENV !== 'production' && !(name in options)) {
          throw new ReferenceError(
            '[vue-timers.start] Cannot find timer ' + name
          )
        }
        if (!data || !data[name]) return
        if (data[name].isRunning) return
        data[name].isRunning = true
        data[name].instance = generateTimer(
          set('time', data[name].time, options[name]),
          vm
        )
        if (options[name].immediate) {
          vm.$emit(`timers:tick:${name}`)
          options[name].callback()
        }
        vm.$emit(`timers:start:${name}`)
      },
      /**
       * Stop timer
       * @param {string} name
       */
      stop(name) {
        if (process.env.NODE_ENV !== 'production' && !(name in options)) {
          throw new ReferenceError(
            '[vue-timers.stop] Cannot find timer ' + name
          )
        }
        if (!data || !data[name]) return
        if (!data[name].isRunning) return
        clearTimer(options[name].repeat)(data[name].instance)
        data[name].isRunning = false
        vm.$emit(`timers:stop:${name}`)
      },
      /**
       * Restart timer
       * @param {string} name
       */
      restart(name) {
        if (process.env.NODE_ENV !== 'production' && !(name in options)) {
          throw new ReferenceError(
            '[vue-timers.restart] Cannot find timer ' + name
          )
        }
        this.stop(name)
        this.start(name)
        vm.$emit(`timers:restart:${name}`)
      }
    }
  },
  mounted() {
    if (!this.$options.timers) return
    const vm = this
    const options = vm.$options.timers
    Object.keys(options).forEach(function(key) {
      if (options[key].autoStart) {
        vm.$timer.start(key)
      }
    })
  },
  activated() {
    if (!this.$options.timers) return
    const vm = this
    const data = vm.timers
    const options = vm.$options.timers
    Object.keys(options).forEach(function(key) {
      if (options[key] && options[key].isSwitchTab && data[key].instance) {
        vm.$timer.start(key)
      }
    })
  },
  deactivated() {
    if (!this.$options.timers) return
    const vm = this
    const data = vm.timers
    const options = vm.$options.timers
    const keys = Object.keys(options)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      if (!key) {
        continue
      }

      if (options[key].isSwitchTab && data[key].instance) {
        vm.$timer.stop(key)
      }
    }
  },
  beforeDestroy() {
    if (!this.$options.timers) return
    const vm = this
    Object.keys(vm.$options.timers).forEach(function(key) {
      vm.$timer.stop(key)
    })
  }
}
