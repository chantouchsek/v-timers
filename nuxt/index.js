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
        timers: {/.* options *./}
    }
*/

const { resolve } = require('path')

module.exports = function nuxtVSanitizeModule () {
  const { timers = {} } = this.options

  this.addPlugin({
    src: resolve(__dirname, 'v-timers-plugin.template.js'),
    fileName: 'v-timers.js',
    options: timers
  })
}

// required by nuxt
module.exports.meta = require('../package.json')
