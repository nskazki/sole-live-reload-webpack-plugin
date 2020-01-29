'use strict'

// alternative approaches:
//  - https://stackoverflow.com/a/52906440
//  - https://github.com/lukeed/webpack-plugin-replace
//  - https://github.com/FullHuman/purgecss-webpack-plugin
//  - https://github.com/webpack/webpack/blob/master/lib/FunctionModulePlugin.js

const fs = require('fs')
const path = require('path')
const resolve = require('resolve')
const template = require('lodash.template')
const compiled = template(fs.readFileSync(path.resolve(__dirname, 'module.js.tpl'), 'utf8'))

module.exports = class SoleLiveReloadWebpackPlugin {
  apply(compiler) {
    compiler.options.module.rules.push({
      enforce: 'pre',
      include: resolve.sync('webpack-dev-server/client/index.js'),
      loader: 'text-transform-loader',
      options: {
        transformText(source) {
          return compiled({ source })
        }
      }
    })
  }
}
