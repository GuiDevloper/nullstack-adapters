import path from 'path'
import { existsSync } from 'fs'

export type Options = {
  target: 'client' | 'server'
  disk: boolean
  buildFolder: string
  entry: string
  environment: 'production' | 'development'
  cache: boolean
  name: string
  trace: boolean
  projectFolder: string
  configFolder: string
}

export type RawOptions = Partial<Options> & {
  skipCache?: boolean
}

function oldGetOptions(
  target: Options['target'],
  options: RawOptions
): Options {
  const disk = !!options.disk
  const environment = options.environment
  const entry = existsSync(path.posix.join(process.cwd(), `${target}.ts`))
    ? `./${target}.ts`
    : `./${target}.js`
  const projectFolder = process.cwd()
  const configFolder = __dirname
  const buildFolder = '.' + environment
  const cache = !options.skipCache
  const name = options.name || ''
  const trace = !!options.trace
  return {
    target,
    disk,
    buildFolder,
    entry,
    environment,
    cache,
    name,
    trace,
    projectFolder,
    configFolder
  }
}

export function getOptions(...args: [Options['target'], RawOptions]) {
  const options = oldGetOptions(...args)
  options.configFolder = path.dirname('nullstack/webpack.config.js')
  return options
}
