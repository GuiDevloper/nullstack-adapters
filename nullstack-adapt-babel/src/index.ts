#! /usr/bin/env node
import { getOptions, disabledAdapter } from './utils'
import shutSWC from './utils/shutSWC'
import runAsCLI from './utils/runAsCLI'
import { newConfig } from './loaders'
import type { RawOptions, Options } from './utils/getOptions'

if (require.main === module) {
  runAsCLI(__dirname)
}

type Config = {
  optimization: Array<{}>
  module: { rules: Array<{}> }
}

type ConfigFunction = (env: object, argv: object) => Config

function useBabel(configs: ConfigFunction[]): ConfigFunction[] {
  shutSWC()
  if (disabledAdapter()) return configs

  const targets: Options['target'][] = ['server', 'client']
  return configs.map((config, configId) => {
    return (_env: object, argv: RawOptions) => {
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

export = useBabel
