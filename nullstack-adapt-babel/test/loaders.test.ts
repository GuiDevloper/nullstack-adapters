// run tests once to setup test-deps.ts
import('./test-deps')
import { test, expect } from 'vitest'
import path from 'path'
import fs from 'fs'

import { type Loader, newConfig } from '../dist/loaders'
import { type Options, getOptions } from '../dist/utils/getOptions'
import { type LoaderModule } from '../dist/loaders/loaders-utils'

const TEST_CASES: [string, [Options['target'], Options['environment']]][] = [
  ['ClientDevelopment.tsx', ['client', 'development']],
  ['ServerDevelopment.tsx', ['server', 'development']],
  ['ClientProduction.tsx', ['client', 'production']],
  ['ServerProduction.tsx', ['server', 'production']],
  ['project.js', ['server', 'development']],
  ['client.ts', ['client', 'development']]
]

test.each(TEST_CASES)('%s', async (FILENAME, RAW_OPTIONS) => {
  function OptionsFactory(
    target: Options['target'],
    environment: Options['environment']
  ) {
    return {
      ...getOptions(target, { environment }),
      projectFolder: path.join(process.cwd(), 'test')
    }
  }
  const OPTIONS = OptionsFactory(...RAW_OPTIONS)

  function loaderContext(resolve: () => void, loader: Loader) {
    const rootContext = path.join(OPTIONS.projectFolder, 'original')
    const ctx: LoaderModule = {
      rootContext,
      getOptions: () => loader.options || loader.use?.options || {},
      resourcePath: path.join(rootContext, FILENAME),
      callback: (_n, source, _map) => {
        testRESULT = source
        resolve()
      },
      async: () => ctx.callback
    }
    return ctx
  }

  function getFile(filename: string) {
    return fs.readFileSync(path.join(OPTIONS.projectFolder, filename), 'utf8')
  }

  const Loaders: Loader[] = newConfig(OPTIONS)
    .filter(L => L.test?.test(FILENAME))
    .reverse()
  let testRESULT = getFile(`original/${FILENAME}`)
  for (let Loader of Loaders) {
    await new Promise<void>(resolve => {
      const loaderPath = Loader.loader || Loader.use?.loader || ''
      const importedLoader = require(loaderPath)
      const source = importedLoader.apply(loaderContext(resolve, Loader), [
        testRESULT
      ])
      if (source) {
        testRESULT = source
        resolve()
      }
    })
  }
  const testEXPECTED = getFile(`expected/${FILENAME}`)
  expect(testRESULT).toStrictEqual(testEXPECTED)
})
