import path from 'path'
import { readdirSync } from 'fs'
import { type Options } from '../utils/getOptions'
import { type BabelLoaderOptions, getBabelLoaders } from './babel-loaders'

function runtime(options: Options) {
  return {
    // TODO: think about module components and create better rule
    exclude: /node_modules/,
    test: /(\.(nts|tsx|njs|jsx)|client\.(js|ts))$/,
    loader: path.posix.join(options.configFolder, 'loaders/inject-runtime.js')
  }
}

function getLoader(loader: string) {
  return path.join(__dirname, loader)
}

function oldLoader(options: Options) {
  if (options.target === 'server') {
    return [
      {
        test: /\.(njs|nts|jsx|tsx)$/,
        loader: getLoader('register-static-from-server.js')
      }
    ]
  }

  return [
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('remove-import-from-client.js')
    },
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('remove-static-from-client.js')
    }
  ]
}

function environment(_options: Options) {
  const crypto = require('crypto')
  const key = crypto.randomBytes(20).toString('hex')
  return { KEY: `"${key}"` }
}

function replaceEnvironment(options: Options) {
  return {
    test: /environment.js$/,
    loader: getLoader('string-replace.js'),
    options: {
      multiple: [
        {
          search: `import { KEY } from 'nullstack/environment'`,
          replace: `const KEY = ${environment(options).KEY}`
        }
      ]
    }
  }
}

type Icons = { [K: string]: string }

function icons(options: Options) {
  const icons: Icons = {}
  const publicFiles = readdirSync(
    path.posix.join(options.projectFolder, 'public')
  )
  const iconFileRegex = /icon-(\d+)x\1\.[a-zA-Z]+/
  for (const file of publicFiles) {
    if (iconFileRegex.test(file)) {
      const size: string = file.split('x')[1].split('.')[0]
      icons[size] = `/${file}`
    }
  }
  return { ICONS: JSON.stringify(icons) }
}

function replaceProject(options: Options) {
  return {
    test: /project.js$/,
    loader: getLoader('string-replace.js'),
    options: {
      multiple: [
        {
          search: `import { ICONS } from 'nullstack/project'`,
          replace: `const ICONS = ${icons(options).ICONS}`
        }
      ]
    }
  }
}

function injectHmr(options: Options) {
  if (options.target !== 'client' || options.environment !== 'development') {
    return {}
  }

  return {
    test: /client\.(js|ts)$/,
    loader: getLoader('inject-hmr.js')
  }
}

export type UserSettings = {
  babel?: {
    presets?: BabelLoaderOptions['options']['presets']
    plugins?: BabelLoaderOptions['options']['plugins']
  }
}

export type Loader = {
  test?: RegExp
  loader?: string
  options?: {}
  use?: {
    loader: string
    options: {}
  }
}

function newConfig(options: Options, userSettings?: UserSettings): Loader[] {
  return [
    runtime(options),
    ...getBabelLoaders(options, userSettings),
    replaceEnvironment(options),
    replaceProject(options),
    injectHmr(options),
    ...oldLoader(options),
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('register-inner-components.js')
    },
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('add-source-to-node.js')
    },
    {
      test: /\.(njs|nts|jsx|tsx)$/,
      loader: getLoader('transform-node-ref.js')
    }
  ].filter(rule => !!rule.test)
}

export { newConfig }
