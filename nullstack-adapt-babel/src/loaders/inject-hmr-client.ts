import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

export = function (source: string): string {
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  let klassName: string
  let klassPath: string
  traverse(ast, {
    MemberExpression(path) {
      if (
        path.node.object &&
        path.node.object['name'] === 'Nullstack' &&
        path.node.property['name'] === 'start'
      ) {
        klassName = path.parent['arguments'][0].name
      }
    }
  })
  if (!klassName) return source
  traverse(ast, {
    ImportDeclaration(path) {
      if (path.node.specifiers[0].local.name === klassName) {
        klassPath = path.node.source.extra.rawValue as string
      }
    }
  })

  return `${source}
  if (module.hot) {
    $runtime.restart(module, '${klassPath}', ${klassName});
  }`
}
