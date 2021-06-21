/*
Nuxt.js module for v-timers

Usage:
    - Install v-timers package
    - Add this into your nuxt.config.js file:
    {
        modules: [
            // Optionally passing options in module configuration
            ['v-timers/nuxt', {/.* options *./}]
        ],
        // Optionally passing options in module top level configuration
        timer: {/.* options *./}
    }
*/

const { resolve } = require('path')

module.exports = function nuxtVTimersModule () {
  const { timer = {} } = this.options

  this.addPlugin({
    src: resolve(__dirname, 'v-timers-plugin.template.js'),
    fileName: 'v-timers.js',
    options: timer
  })
}

// required by nuxt
module.exports.meta = require('../package.json')
