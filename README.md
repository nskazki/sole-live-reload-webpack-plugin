# sole-live-reload-webpack-plugin

A Webpack plugin restricting the number of the [`live-reload`](https://github.com/webpack/webpack-dev-server/blob/9f899ff99ad73a1e712aff2ef84104304986c955/client-src/default/index.js) scripts running on the same page to one.
You don't need it until after you added several bundles build with `webpack-dev-server` to one page.

```
yarn -D sole-live-reload-webpack-plugin
```

```js
const SoleLiveReload = require('sole-live-reload-webpack-plugin')

module.exports = {
  plugins: [new SoleLiveReload()]
}
```
