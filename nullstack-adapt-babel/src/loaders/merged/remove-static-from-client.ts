import type { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { newHash, type LoaderModule } from '../loaders-utils'
import {
  getKlassHash,
  createStaticClassProperty,
  createRuntimeAccept
} from './merged-utils'

export = function (this: LoaderModule, ast: ParseResult<t.File>): string {
  const id = this.resourcePath.replace(this.rootContext, '')
  let klassName: string
  let invokations: t.ClassProperty[] = []
  let hashes: Record<string, string> = {}
  let initiateDeps: string[] = []
  let imports: string[] = []
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue.toString())
    },
    ClassDeclaration(path) {
      klassName = path.node.id.name
      const klassHash = getKlassHash(id, klassName)
      invokations = [createStaticClassProperty('hash', `'${klassHash}'`)]
      path.node.body.body = path.node.body.body.map(node => {
        if (node.type !== 'ClassMethod') return node
        const methodName = node.key['name']
        if (methodName === 'initiate') {
          // TODO: get initiate deps on Server Functions
          // removing local functions/variables with same name
          /*
          const variables = path.node.body.body.filter(node => {
            return node.type === 'VariableDeclaration'
          })
          */
        }
        if (node.static && node.async) {
          if (!methodName.startsWith('_')) {
            hashes[methodName] = newHash(methodName)
            invokations.push(
              createStaticClassProperty(
                methodName,
                `$runtime.invoke("${methodName}", this.hash)`
              )
            )
          }
          return t.classProperty(t.identifier(''))
        }
        return node
      })
      path.get('body').unshiftContainer('body', invokations)
    }
  })
  if (!klassName) return ''

  const runtime_accept = createRuntimeAccept({
    id,
    imports,
    klassName,
    hashes
  })

  return runtime_accept
}
