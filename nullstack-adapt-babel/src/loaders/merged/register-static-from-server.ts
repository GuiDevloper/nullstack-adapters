import type { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import { newHash, type LoaderModule } from '../loaders-utils'
import * as t from '@babel/types'
import {
  createRuntimeAccept,
  createStaticClassProperty,
  getKlassHash
} from './merged-utils'

export = function (this: LoaderModule, ast: ParseResult<t.File>): string {
  const id = this.resourcePath.replace(this.rootContext, '')
  let klassName: string
  const methodNames: string[] = []
  let hashes: Record<string, string> = {}
  let imports: string[] = []
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue.toString())
    },
    ClassDeclaration(path) {
      klassName = path.node.id.name
      path.node.body.body.forEach(node => {
        if (node.type !== 'ClassMethod') return
        if (node.static && node.async && !node.key['name'].startsWith('_')) {
          methodNames.push(node.key['name'])
          hashes[node.key['name']] = newHash(node.key['name'])
        }
      })
      const klassHash = getKlassHash(id, klassName)
      path.node.body.body.unshift(
        createStaticClassProperty('hash', `'${klassHash}'`)
      )
    }
  })
  if (!klassName) return ''

  const runtime_accept = createRuntimeAccept({
    id,
    klassName,
    imports,
    hashes
  })

  return `
${runtime_accept}
${methodNames.map(fn => `$runtime.register(${klassName}, "${fn}");`).join('\n')}
$runtime.register(${klassName});`
}
