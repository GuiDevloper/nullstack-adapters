function js(options) {
  const TerserPlugin = require('terser-webpack-plugin')
  return new TerserPlugin({
    minify: TerserPlugin.esbuildMinify,
    terserOptions: {
      minify: true,
      treeShaking: true,
      keepNames: true,
      sourcemap: true,
      target:
        options.target === 'server'
          ? ['node14']
          : ['es6', 'chrome58', 'edge18', 'firefox57', 'safari11']
    }
  })
}

function css(options) {
  if (options.target !== 'client') return false
  const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
  return new CssMinimizerPlugin({
    minify: CssMinimizerPlugin.esbuildMinify
  })
}

function optimization(options) {
  return {
    minimize: options.environment === 'production',
    minimizer: [js(options), css(options)].filter(Boolean)
  }
}

module.exports = optimization
