import type { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import { newHash, type LoaderModule } from '../loaders-utils'
import * as t from '@babel/types'
import {
  createRuntimeAccept,
  createStaticClassProperty,
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
      const methodNames: string[] = []
      const klassName = path.node.id.name
      const klassIndex = klasses.push({ name: klassName, hashes: {} }) - 1
      path.node.body.body.forEach(node => {
        if (node.type !== 'ClassMethod') return
        if (node.static && node.async && !node.key['name'].startsWith('_')) {
          methodNames.push(node.key['name'])
          klasses[klassIndex].hashes[node.key['name']] = newHash(
            node.key['name']
          )
        }
      })
      const klassHash = getKlassHash(id, klassName)
      path.node.body.body.unshift(
        createStaticClassProperty('hash', `'${klassHash}'`)
      )
      path.insertAfter(
        t.identifier(
          `${methodNames
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
