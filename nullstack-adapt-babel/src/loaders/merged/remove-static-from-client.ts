import type { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'
import { newHash, type LoaderModule } from '../loaders-utils'
import {
  getKlassHash,
  createStaticClassProperty,
  createRuntimeAccept,
  type KlassAcceptable,
  getInitiateDeps
} from './merged-utils'
import removeImportFromClient from './remove-import-from-client'

export = function (this: LoaderModule, ast: ParseResult<t.File>): string {
  const id = this.resourcePath.replace(this.rootContext, '')
  let imports: string[] = []
  let klasses: KlassAcceptable[] = []
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
      const serverFunctions: string[] = []
      let initiateNode: t.ClassMethod
      path.node.body.body = path.node.body.body.map(node => {
        if (node.type !== 'ClassMethod') return node
        const methodName = node.key['name']
        if (node.static && node.async) {
          if (!methodName.startsWith('_')) {
            serverFunctions.push(methodName)
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
        if (methodName === 'initiate') {
          initiateNode = node
        }
        return node
      })
      klasses[klassIndex].initiateDeps = getInitiateDeps({
        initiateNode,
        serverFunctions,
        path
      })
      path.get('body').unshiftContainer('body', invokations)
    }
  })
  removeImportFromClient(ast)
  if (klasses.length === 0) return ''

  return createRuntimeAccept({
    id,
    imports,
    klasses
  })
}
