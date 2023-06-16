import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import { newHash, type LoaderModule } from './loaders-utils'

export = function (this: LoaderModule, source: string): string {
  let hasClass = false
  const id = this.resourcePath.replace(this.rootContext, '')
  let klassName: string
  const methodNames: string[] = []
  let hashes: Record<string, string> = {}
  let imports: string[] = []
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue.toString())
    },
    ClassDeclaration(path) {
      hasClass = true
      klassName = path.node.id.name
    },
    ClassMethod(path) {
      if (
        path.node.static &&
        path.node.async &&
        !path.node.key['name'].startsWith('_')
      ) {
        methodNames.push(path.node.key['name'])
        hashes[path.node.key['name']] = newHash(path.node.key['name'])
      }
    }
  })
  if (!hasClass) return source
  const klassHash = id
    .replace(path.sep, '')
    .split(path.sep)
    .join('__')
    .replace(/\.(njs|nts|jsx|tsx)$/, `___${klassName}`)

  const runtime_accept = `
$runtime.accept(
  module,
  '${id.split(path.sep).join('/')}',
  ${JSON.stringify(imports)},
  [
    {
      klass: ${klassName},
      initiate: [],
      hashes: ${JSON.stringify(hashes)}
    }
  ]
);`

  let newSource = `${source}
${klassName}.hash = "${klassHash}";
if (module.hot) {
  ${runtime_accept}
}
${methodNames
  .map(
    fn => `
$runtime.register(${klassName}, "${fn}");`
  )
  .join('\n')}
$runtime.register(${klassName});`

  return newSource
}
