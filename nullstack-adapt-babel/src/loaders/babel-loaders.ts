import type { UserSettings } from './index'
import type { Options } from '../utils/getOptions'

export type BabelLoaderOptions = {
  test: RegExp
  options: {
    presets?: (string | [string, object])[]
    plugins?: (string | [string, object])[]
  }
}

export type BabelOptions = Options & {
  userSettings: UserSettings
}

function resolveBabelPlugins(
  plugins: BabelLoaderOptions['options']['plugins']
) {
  return plugins.map(plugin =>
    Array.isArray(plugin)
      ? [require.resolve(plugin[0]), plugin[1]]
      : require.resolve(plugin)
  )
}

function getBabelPresets(
  options: BabelOptions
): BabelLoaderOptions['options']['presets'] {
  return [
    [
      '@babel/preset-env',
      {
        targets: options.target === 'server' ? { node: 'current' } : 'defaults'
      }
    ],
    [
      '@babel/preset-react',
      {
        development: options.environment === 'development',
        pragma: '$runtime.element',
        pragmaFrag: '$runtime.fragment',
        throwIfNamespace: false
      }
    ],
    ...(options.userSettings?.babel?.presets || [])
  ]
}

function getBabelPlugins(
  options: BabelOptions,
  plugins: BabelLoaderOptions['options']['plugins']
): BabelLoaderOptions['options']['plugins'] {
  return [...plugins, ...(options.userSettings?.babel?.plugins || [])]
}

function babel(options: BabelOptions, other: BabelLoaderOptions) {
  return {
    test: other.test,
    resolve: {
      extensions: ['.njs', '.js', '.nts', '.ts', '.jsx', '.tsx']
    },
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        ...other.options,
        sourceType: 'unambiguous',
        presets: resolveBabelPlugins(getBabelPresets(options)),
        plugins: resolveBabelPlugins(
          getBabelPlugins(options, other.options.plugins)
        )
      }
    }
  }
}

function js(options: BabelOptions) {
  return babel(options, {
    test: /\.js$/,
    options: {
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties'
      ]
    }
  })
}

function ts(options: BabelOptions) {
  return babel(options, {
    test: /\.ts$/,
    options: {
      plugins: ['@babel/plugin-transform-typescript']
    }
  })
}

function njs(options: BabelOptions) {
  return babel(options, {
    test: /\.(njs|jsx)$/,
    options: {
      plugins: [
        '@babel/plugin-proposal-export-default-from',
        '@babel/plugin-proposal-class-properties'
      ]
    }
  })
}

function nts(options: BabelOptions) {
  return babel(options, {
    test: /\.(nts|tsx)$/,
    options: {
      plugins: [
        [
          '@babel/plugin-transform-typescript',
          {
            isTSX: true,
            allExtensions: true,
            tsxPragma: '$runtime.element',
            tsxPragmaFrag: '$runtime.fragment'
          }
        ]
      ]
    }
  })
}

export function getBabelLoaders(options: Options, userSettings: UserSettings) {
  return [js, ts, njs, nts].map(loader => loader({ ...options, userSettings }))
}
