#! /usr/bin/env node
// @ts-check
const { getOptions, disabledAdapter } = require('./utils')
const shutSWC = require('./utils/shut-swc')
const runAsCLI = require('./utils/runAsCLI')
const { newConfig } = require('./loaders')

if (require.main === module) {
  runAsCLI(__dirname)
}

/**
 *
 * @param {Array<(...[]) => {module: {rules: Array<{}>}}>} configs
 */
function useBabel(configs) {
  shutSWC()
  if (disabledAdapter()) return configs

  const targets = ['server', 'client']
  return configs.map((config, configId) => {
    return (_env, argv) => {
      const oldConfig = config(_env, argv)
      const oldRules = oldConfig.module.rules
      // removes old runtime
      oldRules.pop()
      const options = getOptions(targets[configId], argv)
      return {
        ...oldConfig,
        optimization: require('./utils/optimization')(options),
        module: {
          rules: [
            ...oldRules.slice(0, 3),
            ...newConfig(options),
            ...oldRules.slice(-2)
          ].filter(Boolean)
        }
      }
    }
  })
}

module.exports = useBabel
