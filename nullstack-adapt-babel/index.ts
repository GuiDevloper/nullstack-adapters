#! /usr/bin/env node
import { getOptions, disabledAdapter } from './utils'
import shutSWC from './utils/shutSWC'
import runAsCLI from './utils/runAsCLI'
import { newConfig } from './loaders'
import { type Options } from './utils/getOptions'

const req = require
console.log(req, req.main)
if (require.main === module) {
  console.log('CLIII')
  runAsCLI(__dirname)
}

type Config = {
  optimization: Array<{}>
  module: { rules: Array<{}> }
}

type ConfigFunction = (env: object, argv: object) => Config

export default function useBabel(configs: ConfigFunction[]): ConfigFunction[] {
  shutSWC()
  if (disabledAdapter()) return configs

  const targets: Options['target'][] = ['server', 'client']
  return configs.map((config, configId) => {
    return (_env: object, argv: object) => {
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
          ]
        }
      }
    }
  })
}
