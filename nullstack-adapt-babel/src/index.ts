#! /usr/bin/env node
import { getOptions, disabledAdapter, removeRule, getRules } from './utils'
import shutSWC from './utils/shutSWC'
import runAsCLI from './utils/runAsCLI'
import { type UserSettings, newConfig, type Loader } from './loaders'
import type { RawOptions, Options } from './utils/getOptions'

if (require.main === module) {
  runAsCLI(__dirname)
}

type Config = {
  optimization: Array<{}>
  module: { rules: Loader[] }
}

type ConfigFunction = (env: object, argv: RawOptions) => Config

function useBabel(
  configs: ConfigFunction[],
  userSettings?: UserSettings
): ConfigFunction[] {
  shutSWC()
  if (disabledAdapter()) return configs

  const targets: Options['target'][] = ['server', 'client']
  return configs.map((config, configId) => {
    return (_env: object, argv: RawOptions) => {
      const oldConfig = config(_env, argv)
      const oldRules = removeRule(oldConfig.module.rules, {
        loader: 'loaders/inject-runtime.js'
      })
      const options = getOptions(targets[configId], argv)
      return {
        ...oldConfig,
        optimization: require('./utils/optimization')(options),
        module: {
          rules: [
            ...getRules(oldRules, [
              { loader: 'loaders/trace.js' },
              { test: /\.s?[ac]ss$/ }
            ]),
            ...newConfig(options, userSettings),
            ...getRules(oldRules, [
              { loader: 'loaders/shut-up-loader.js' },
              { type: 'asset/source' }
            ])
          ]
        }
      }
    }
  })
}

export = useBabel
