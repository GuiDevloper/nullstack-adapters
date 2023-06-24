import type { ParseResult } from '@babel/parser'
import traverse, { NodePath } from '@babel/traverse'
import * as t from '@babel/types'

type ImportNodePath = NodePath<
  t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier
>

const parentTypes = [
  'ImportDefaultSpecifier',
  'ImportSpecifier',
  'ImportNamespaceSpecifier'
]

export = function (ast: ParseResult<t.File>): void {
  const imports: Record<string, { key: string; parent: NodePath<t.Node> }> = {}

  function findImports(path: ImportNodePath) {
    if (path.node.local.name === 'Nullstack') return

    const parent = path.findParent(p => p.isImportDeclaration())
    const { start, end } = parent.node.loc
    const lines = new Array(end.line - start.line + 1)
      .fill(null)
      .map((_d, i) => i + start.line)
    const key = lines.join('.')
    imports[path.node.local.name] = { key, parent }
  }

  function findIdentifiers(path: NodePath<t.Identifier | t.JSXIdentifier>) {
    if (!parentTypes.includes(path.parent.type)) {
      const target = imports[path.node.name]
      if (target) {
        for (const name in imports) {
          if (imports[name].key === target.key) {
            if (
              path.parent.type !== 'MemberExpression' ||
              path.parent.object?.type !== 'ThisExpression'
            ) {
              delete imports[name]
            }
          }
        }
      }
    }
  }

  traverse(ast, {
    ImportDeclaration: {
      exit(path) {
        path.get('specifiers').forEach(spec => findImports(spec))
      }
    },
    Identifier: findIdentifiers,
    JSXIdentifier: findIdentifiers
  })

  Object.values(imports).forEach(({ parent }) => parent.remove())
}
