'use strict'

// alternative approaches:
//  - https://stackoverflow.com/a/52906440
//  - https://github.com/lukeed/webpack-plugin-replace
//  - https://github.com/FullHuman/purgecss-webpack-plugin
//  - https://github.com/webpack/webpack/blob/master/lib/FunctionModulePlugin.js

const deline = require('deline')
const resolve = require('resolve')

const prependText = deline`
  /* SoleLiveReloadWebpackPlugin * prependText * begin */

  var parentTimeoutId = null;
  var parentRequestLimit = 3*countParents(window);
  var parentRequestAttempts = 0;

  trySLR();

  function trySLR() {
    if (window.__slr__ && window.__slr__[__resourceQuery]) {
      debug('sole-live-reload: script has been ALREADY registered!', __resourceQuery);
    } else if (window.parent === window) {
      markSLR();
      initSLR();
      debug('sole-live-reload: root script has been registered!', __resourceQuery);
    } else if (parentRequestAttempts < parentRequestLimit) {
      initParentRequest();
    } else {
      markSLR();
      initSLR();
      debug('sole-live-reload: timeout script has been registered!', __resourceQuery);
    }
  }

  function markSLR() {
    if (!window.__slr__) window.__slr__ = {};
    window.__slr__[__resourceQuery] = true;
    window.addEventListener('message', childRequestHandler);
  }

  function initParentRequest() {
    parentTimeoutId = setTimeout(parentTimeoutCallback, 100);
    var request = __resourceQuery + ':slr-request';
    window.addEventListener('message', parentResponseCallback);
    window.parent.postMessage(request, '*');
  }

  function cancelParentRequest() {
    clearTimeout(parentTimeoutId);
    window.removeEventListener('message', parentResponseCallback);
  }

  function parentTimeoutCallback() {
    parentRequestAttempts++;
    cancelParentRequest();
    trySLR();
  }

  function parentResponseCallback(event) {
    if ((event.data || '').indexOf(__resourceQuery + ':slr-response') === 0) {
      cancelParentRequest();
      var parentHasSLR = /:slr-response:true$/.test(event.data);
      if (parentHasSLR) {
        markSLR();
        debug('sole-live-reload: parent script has been ALREADY registered!', __resourceQuery);
      } else {
        markSLR();
        initSLR();
        debug('sole-live-reload: child script has been registered!', __resourceQuery);
      }
    }
  }

  function childRequestHandler(event) {
    if (/:slr-request$/.test(event.data)) {
      var request = /^(.*):slr-request$/.exec(event.data)[1];
      var response = request + ':slr-response:' + (window.__slr__[request] || false);
      event.source.postMessage(response, '*');
    }
  }

  function countParents(child, counter) {
    if (!counter) counter = 0;

    if (child.parent === child) {
      return counter;
    } else {
      return countParents(child.parent, counter + 1);
    }
  }

  function debug() {
    if (window.localStorage && window.localStorage.debugSLR) {
      if (console && console.debug) {
        console.debug.apply(console, arguments)
      } else if (console && console.log) {
        console.log.apply(console, arguments)
      }
    }
  }

  function initSLR() {
  /* SoleLiveReloadWebpackPlugin * prependText * end */`

const appendText = deline`
  /* SoleLiveReloadWebpackPlugin * appendText * begin */
  }
  /* SoleLiveReloadWebpackPlugin * appendText * end */`

module.exports = class SoleLiveReloadWebpackPlugin {
  apply(compiler) {
    compiler.options.module.rules.push({
      enforce: 'pre',
      include: resolve.sync('webpack-dev-server/client/index.js'),
      loader: 'text-transform-loader',
      options: { prependText, appendText }
    })
  }
}
