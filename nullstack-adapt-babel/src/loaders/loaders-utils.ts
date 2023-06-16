import crypto from 'crypto'

export function newHash(name: string) {
  return crypto.createHash('md5').update(name).digest('hex')
}

export type LoaderModule = {
  resourcePath: string
  rootContext: string
  getOptions: () => Record<string, any>
  callback: (err: any, source: string, sourceMap: string) => void
}
