# sole-live-reload-webpack-plugin

Webpack plugin that useful to restrict the number of [`live-reload`](https://github.com/webpack/webpack-dev-server/blob/9f899ff99ad73a1e712aff2ef84104304986c955/client-src/default/index.js) scripts to one when multiple bundles are used on a page which helps to fix infinite page reload in some causes.

```
yarn -D sole-live-reload-webpack-plugin
```

```js
const SoleLiveReload = require('sole-live-reload-webpack-plugin')

module.exports = {
  plugins: [new SoleLiveReload()]
}
```
