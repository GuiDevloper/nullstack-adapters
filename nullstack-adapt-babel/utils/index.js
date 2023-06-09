const path = require('path')

function atCWD(fullPath) {
  return path.join(process.cwd(), fullPath)
}

function disabledAdapter() {
  const { DEFAULT_CONFIG } =
    require(atCWD('package.json'))?.stackblitz?.env || {}
  return DEFAULT_CONFIG || process.env.DEFAULT_CONFIG
}

module.exports = {
  atCWD,
  disabledAdapter,
  getOptions: require('./getOptions')
}
