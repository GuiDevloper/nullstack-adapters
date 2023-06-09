// @ts-check
const path = require('path')
const fs = require('fs')
const { atCWD, disabledAdapter } = require('.')

function runAsCLI(indexDir) {
  const configPath = atCWD('node_modules/nullstack/webpack.config.js')
  const configFile = fs.readFileSync(configPath, 'utf8')
  const isDisabled = disabledAdapter()
  const lines = {
    default: `module.exports = [server, client]`,
    babel: `module.exports = require('${indexDir.replaceAll(
      path.sep,
      '/'
    )}')([server, client])`
  }
  const alreadyDone = !isDisabled && configFile.includes(lines.babel)
  if (alreadyDone) return

  fs.writeFileSync(configPath, configFile.replace(lines.default, lines.babel))
}

module.exports = runAsCLI
