import type { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { newHash, type LoaderModule } from '../loaders-utils'
import {
  getKlassHash,
  createStaticClassProperty,
  createRuntimeAccept,
  type KlassAcceptable
} from './merged-utils'

export = function (this: LoaderModule, ast: ParseResult<t.File>): string {
  const id = this.resourcePath.replace(this.rootContext, '')
  let imports: string[] = []
  let klasses: KlassAcceptable[] = []
  let initiateDeps: string[] = []
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue.toString())
    },
    ClassDeclaration(path) {
      const klassName = path.node.id.name
      const klassIndex = klasses.push({ name: klassName, hashes: {} }) - 1
      const klassHash = getKlassHash(id, klassName)
      const invokations: t.ClassProperty[] = [
        createStaticClassProperty('hash', `'${klassHash}'`)
      ]
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
            klasses[klassIndex].hashes[methodName] = newHash(methodName)
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
  if (klasses.length === 0) return ''

  return createRuntimeAccept({
    id,
    imports,
    klasses
  })
}
