import path from 'path'

function atCWD(fullPath: string): string {
  return path.join(process.cwd(), fullPath)
}

function disabledAdapter(): boolean {
  const { DEFAULT_CONFIG } =
    require(atCWD('package.json'))?.stackblitz?.env || {}
  return DEFAULT_CONFIG || process.env.DEFAULT_CONFIG
}

export * from './getOptions'

export { atCWD, disabledAdapter }
