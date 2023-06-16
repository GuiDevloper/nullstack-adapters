import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

const parentTypes = [
  'ImportDefaultSpecifier',
  'ImportSpecifier',
  'ImportNamespaceSpecifier'
]

export = function (source: string): string {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  const imports: Record<string, { lines: number[]; key: string }> = {}
  function findImports(path) {
    if (path.node.local.name !== 'Nullstack') {
      const parent = path.findParent(p => p.isImportDeclaration())
      const start: number = parent.node.loc.start.line
      const end: number = parent.node.loc.end.line
      const lines: number[] = new Array(end - start + 1)
        .fill(null)
        .map((d, i) => i + start)
      const key = lines.join('.')
      imports[path.node.local.name] = { lines, key }
    }
  }
  function findIdentifiers(path) {
    if (parentTypes.indexOf(path.parent.type) === -1) {
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
    ImportSpecifier: findImports,
    ImportDefaultSpecifier: findImports,
    ImportNamespaceSpecifier: findImports
  })
  traverse(ast, {
    Identifier: findIdentifiers,
    JSXIdentifier: findIdentifiers
  })
  const lines = Object.keys(imports)
    .map(name => imports[name].lines)
    .flat()
  return source
    .split(`\n`)
    .filter((line, index) => !lines.includes(index + 1))
    .join(`\n`)
}
