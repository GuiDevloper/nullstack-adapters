import type { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import { newHash, type LoaderModule } from '../loaders-utils'
import * as t from '@babel/types'
import {
  createRuntimeAccept,
  createStaticClassProperty,
  getInitiateDeps,
  getKlassHash,
  type KlassAcceptable
} from './merged-utils'

export = function (this: LoaderModule, ast: ParseResult<t.File>): string {
  const id = this.resourcePath.replace(this.rootContext, '')
  let imports: string[] = []
  let klasses: KlassAcceptable[] = []
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue.toString())
    },
    ClassDeclaration(path) {
      const serverFunctions: string[] = []
      const klassName = path.node.id.name
      const klassIndex = klasses.push({ name: klassName, hashes: {} }) - 1
      let initiateNode: t.ClassMethod
      path.node.body.body.forEach(node => {
        if (node.type !== 'ClassMethod') return
        const methodName = node.key['name']
        if (node.static && node.async && !methodName.startsWith('_')) {
          serverFunctions.push(methodName)
          klasses[klassIndex].hashes[methodName] = newHash(methodName)
        }
        if (methodName === 'initiate') {
          initiateNode = node
        }
      })
      klasses[klassIndex].initiateDeps = getInitiateDeps({
        initiateNode,
        serverFunctions,
        path
      })
      const klassHash = getKlassHash(id, klassName)
      path.node.body.body.unshift(
        createStaticClassProperty('hash', `'${klassHash}'`)
      )
      path.insertAfter(
        t.identifier(
          `${serverFunctions
            .map(fn => `$runtime.register(${klassName}, "${fn}");`)
            .join('\n')}$runtime.register(${klassName});`
        )
      )
    }
  })
  if (klasses.length === 0) return ''

  return createRuntimeAccept({
    id,
    imports,
    klasses
  })
}
