## v-timers
Simple mixin to manage timers or intervals for Vue.js

## Installation

#### 1.1 Use CDN
```
<script src="https://cdn.jsdelivr.net/npm/v-timers/dist/v-timers.umd.js"></script>
```

#### 1.2 Install from package manager
```
npm install v-timers
yarn add v-timers
```

#### 2.1. Global import
```javascript
import Vue from 'vue'
import VueTimers from 'v-timers'

Vue.use(VueTimers)
```

#### 2.2. Or use mixin for the specific component
```javascript
import {mixin as VueTimers} from 'v-timers'

export default {
  mixins: [VueTimers]
}
```

#### 2.3. Nuxt Module
`nuxt.config.js`:
```js
export default {
  modules: [
    'v-timers/nuxt'
  ]
}
```

## What it does?
It creates timer instances in components and slightly reduces boilerplate code with their handling.  
See the following code
```javascript
export default {
  methods: {
    log () {
      console.log('Hello world')
    }
  },
  created () {
    // It looks OK for the first look
    // But imagine that you have more than one timer
    this.$options.interval = setInterval(this.log, 1000)
    // Ok? What about check if timer works?
    // And it's not reactive so you should create data option
    console.log(this.$options.interval !== null)  
    // Still ok? So what about reusable timers?
    // New method for that? Rly?  
  },
  // Did you forget that it should be destroyed?
  beforeDestroy () {
    clearInterval(this.$options.interval)
  }
}
```
It's ugly, isn't it? So let's try to fix this :)

Same code with `v-timers`:
```javascript
export default {
  timers: {
    log: { time: 1000, autoStart: true }
  },
  methods: {
    log () {
      console.log('Hello world')
    }
  }
}
```

## Configuration

### Timer object
```js
{
  // Name of timer
  // Default: timer key (with object notation)
  name: String,

  // Tick callback or method name from component
  // Note: callback is binded to component instance
  // Default: name
  callback: Function/String,

  // Autostart timer from created hook
  // Default: false
  autoStart: Boolean,

  // Set true to repeat (with setInterval) or false (setTimeout)
  // Default: false
  repeat: Boolean,

  // Set true to call first tick immediate 
  // Note: repeat must be true too
  // Default: false
  immediate: Boolean,

  // Time between ticks
  // Default: 1000
  time: Number
  
  // Switch timer`s status between activated and deactivated
  // Default: false
  isSwitchTab: Boolean
}
```

### Changing timer duration
```javascript
this.timers.log.time = 2000
```
> **NOTE:** you should restart timer to apply changes

### Component methods
```javascript
// Starts `log` timer
this.$timer.start('log')
// Stops `log` timer
this.$timer.stop('log')
```

### isRunning property
```javascript
this.timers.log.isRunning
```

### Events

#### TimerComponent.vue
```javascript

import { timer } from 'v-timers'

export default {
  timers: [
    timer('log', 1000)
  ],
  methods: {
    log () {
      console.log('It works!')
    }
  }
}
```

#### App.vue
```vue
<template>
  <timer-component
    @timers:start:log="timerStarted"
    @timers:stop:log="timerStopped"
    @timers:tick:log="timerTicked"
  />
</template>
```

### 3 ways of timers declaration

#### Object notation
```javascript
export default {
  timers: {
    log: { time: 1000, ...options }
  }
}
```

#### Array notation
```javascript
export default {
  timers: [
    { name: 'log', time: 1000, ...options }
  ]
}
```

#### Helper function
```javascript
import { timer } from 'v-timers'

export default {
  timers: [
    timer('log', 1000, { ...options })
  ]
}
```

## Author
[Chantouch Sek](https://github.com/Chantouch)

## License
MIT
