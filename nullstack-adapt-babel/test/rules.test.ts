// run tests once to setup test-deps.ts
import('./test-deps')
import { test, expect } from 'vitest'
import useBabel from '../dist'
import type { Options } from '../dist/utils/getOptions'
import type { Loader } from '../dist/loaders'

function getConfigs(options: Partial<Options>): Loader[][] {
  const Babel = useBabel(require('nullstack/webpack.config'))
  return Babel.map(B => B({}, options).module.rules)
}

function expectSearchList(
  rules: Loader[],
  listToSearch: Loader[],
  exist = true
) {
  listToSearch.forEach((rule: Loader) => {
    const [name, value] = Object.entries(rule)[0]
    const existent = rules.find(line => {
      return line[name]?.includes(value)
    })
    const loaderFilename = (existent || {})[name]?.split('/')?.reverse()[0]
    if (exist) {
      return expect(rule[name]).toContain(loaderFilename)
    }
    expect(rule[name]).not.toContain(loaderFilename)
  })
}

test('server rules with trace actived', async () => {
  const server = getConfigs({ trace: true })[0]
  const shouldExist = [
    { loader: 'loaders/trace.js' },
    { loader: 'loaders/skip-loader.js' },
    { loader: 'loaders/shut-up-loader.js' },
    { type: 'asset/source' }
  ]
  expectSearchList(server, shouldExist)
})

test('client rules with trace actived', async () => {
  const client = getConfigs({ trace: true })[1]
  const shouldExist = [
    { loader: 'loaders/trace.js' },
    { loader: 'loaders/shut-up-loader.js' },
    { type: 'asset/source' }
  ]
  expectSearchList(client, shouldExist)

  const shouldNotExist = [{ loader: 'loaders/skip-loader.js' }]
  expectSearchList(client, shouldNotExist, false)
})

test('client rules with trace disabled', async () => {
  const client = getConfigs({ trace: false })[1]
  const shouldExist = [
    { loader: 'loaders/shut-up-loader.js' },
    { type: 'asset/source' }
  ]
  expectSearchList(client, shouldExist)

  const shouldNotExist = [
    { loader: 'loaders/trace.js' },
    { loader: 'loaders/skip-loader.js' }
  ]
  expectSearchList(client, shouldNotExist, false)
})
