# nullstack-adapt-babel

Fully replace [Nullstack](https://nullstack.app/) compiler (currently [SWC](https://swc.rs/) + [swc-plugin-nullstack](https://github.com/nullstack/swc-plugin-nullstack)) with [Babel](https://babeljs.io/) and it's (g)old plugins/presets system

## How to use

This script can be used in two ways:

- In the "auto" mode you just need to use with [`npx`](https://docs.npmjs.com/cli/v9/commands/npx) before your Nullstack scripts, like:

```json
"scripts": {
  "start": "npx nullstack-adapt-babel && nullstack start",
  "build": "npx nullstack-adapt-babel && nullstack build"
}
```

> It straight away does [these things](#what-it-does-in-detail) that can be fully disabled in [those ways](#how-to-disable-the-whole-magic)

- In the "manual" mode you use it as a function that [changes the Webpack Config](https://nullstack.app/how-to-customize-webpack):

```js
// webpack.config.js
const useBabel = require('nullstack-adapt-babel')
const configs = require('nullstack/webpack.config')

module.exports = useBabel(configs)
```

> In the manual mode you can [configure Babel with plugins/presets](#how-to-use-pluginspresets)

## What it does in detail

#### When used in auto-mode with `npx` it does:

- Searches for the original **nullstack/webpack.config.js** and replaces the `module.exports` there as follows:

```diff
- module.exports = [server, client]
+ module.exports = require('/full/path/to/nullstack-adapt-babel')([server, client])
```

Making this package to be directly called at every Nullstack run, updating the Webpack config in it's source, then it does everything exactly as manual-mode.

#### When used in manual-mode with custom **webpack.config.js** it does:

- Searches for the original compiler loader and make it never be run:

```diff
- function swc(options, other) {
+ function swc(options, other) {return {};
```

> This is mandatory for a environment like [StackBlitz](https://stackblitz.com/) that doesn't support neither the mention of SWC

- Checks whether it [should stay disabled](#how-to-disable-the-whole-magic) returning the original config if true

- Replaces the original `optimization` key to use [esbuild](https://esbuild.github.io/) at production (see it's config [here](./src/utils/optimization.js))

- Recreates the `module.rules` array keeping the needed and adding Babel-related loaders

> 💡 Wanna dive in the code? It all starts [here](./src/index.ts)

## How to disable the whole magic

At every run it searches for a key `NULLSTACK_DEFAULT_CONFIG` in your **.env**, like:

```properties
NULLSTACK_DEFAULT_CONFIG=true
```

Using if it exists, otherwise searches for the same on a key `nullstack-adapt-babel` in your **package.json**:

```json
"nullstack-adapt-babel": {
  "NULLSTACK_DEFAULT_CONFIG": true
}
```

Using that value will undo everything and let Nullstack work with it's default compiler.

## How to use plugins/presets

Custom options can be passed in the 2nd argument of the function, allowing to configure your own plugins/presets:

```js
// webpack.config.js
const useBabel = require('nullstack-adapt-babel')
const configs = require('nullstack/webpack.config')

module.exports = useBabel(configs, {
  babel: {
    plugins: [
      ['babel-plugin-transform-remove-console', { exclude: ['info'] }],
      '@babel/plugin-proposal-throw-expressions'
    ],
    presets: [['@babel/preset-flow', { allowDeclareFields: true }]]
  }
})
```

> Currently custom plugins/presets are only appended to the original

> Currently it have no option to customize our `@babel/parser` (e.g. with `throwExpressions` plugin)

## Purpose

Someone may ask _"Nullstack having a fast SWC compiler, why would one go back to the ~~future~~ past?"_, and understandable, like, I'm asking that myself even now finally documenting this all 😅

> Not just fast, the beauty of that even got me seduced to learn some [Rust](https://rust-lang.org/) and contribute at our [own SWC plugin](https://github.com/nullstack/swc-plugin-nullstack) ⚡

Then yeah, there's some reasoning on bringing back the Babel days, aside from giving that plugins/presets freedom to the user and liking experiments, we wanted to use a platform like [StackBlitz](https://stackblitz.com/) that currently doesn't support SWC binaries
