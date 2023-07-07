import { parse } from '@babel/parser'
import generate from '@babel/generator'
import type { LoaderModule } from '../loaders-utils'
import type { Options } from '../../utils'

import transformNodeRef from './transform-node-ref'
import addSourceToNode from './add-source-to-node'
import registerInnerComponents from './register-inner-components'
import registerStaticFromServer from './register-static-from-server'
import removeStaticFromClient from './remove-static-from-client'

export = function (this: LoaderModule, source: string): string {
  const options = this.getOptions() as Options
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  transformNodeRef(ast, source)
  addSourceToNode(ast)
  registerInnerComponents(ast)

  let appendSource = ''
  if (options.target === 'server') {
    appendSource = registerStaticFromServer.bind(this)(ast)
  }
  if (options.target === 'client') {
    appendSource = removeStaticFromClient.bind(this)(ast)
  }

  const newSource = generate(ast, { retainLines: true }).code
  return newSource + appendSource
}
