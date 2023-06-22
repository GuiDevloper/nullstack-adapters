import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import transformNodeRef from './transform-node-ref'
import addSourceToNode from './add-source-to-node'
import registerInnerComponents from './register-inner-components'

export = function (source: string): string {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  transformNodeRef(ast, source)
  addSourceToNode(ast)
  registerInnerComponents(ast)

  let newSource = ''
  traverse(ast, {
    Program(path) {
      newSource = path.toString()
    }
  })
  return newSource
}
