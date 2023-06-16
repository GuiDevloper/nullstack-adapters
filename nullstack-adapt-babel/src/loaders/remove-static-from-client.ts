import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import path from 'path'
import { newHash, type LoaderModule } from './loaders-utils'

export = function (this: LoaderModule, source: string) {
  const id = this.resourcePath.replace(this.rootContext, '')
  let hashPosition: number
  let klassName: string
  let hashes: Record<string, string> = {}
  let initiateDeps: string[] = []
  let imports: string[] = []
  const injections: Record<number, { end: number; name: string }> = {}
  const positions: number[] = []
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  traverse(ast, {
    ImportDeclaration(path) {
      imports.push(path.node.source.extra.rawValue.toString())
    },
    ClassDeclaration(path) {
      klassName = path.node.id.name
    },
    ClassBody(path) {
      const start = path.node.body[0].start
      hashPosition = start
      positions.push(start)
    },
    ClassMethod(path) {
      if (path.node.static && path.node.async) {
        injections[path.node.start] = {
          end: path.node.end,
          name: path.node.key['name']
        }
        if (!positions.includes(path.node.start)) {
          positions.push(path.node.start)
        }
        if (!path.node.key['name'].startsWith('_')) {
          hashes[path.node.key['name']] = newHash(path.node.key['name'])
        }
      }
      if (path.node.key['name'] === 'initiate') {
        // TODO: get initiate deps on Server Functions
        // removing local functions/variables with same name
        const variables = path.node.body.body.filter(node => {
          return node.type === 'VariableDeclaration'
        })
      }
    }
  })
  positions.reverse()
  positions.push(0)
  const outputs: string[] = []
  let last: number
  for (const position of positions) {
    let code = source.slice(position, last)
    last = position
    const injection = injections[position]
    if (position && injection) {
      const location = injection.end - position
      if (injection.name.startsWith('_')) {
        code = code.substring(location).trimStart()
      } else {
        code = `${code.substring(location)}`
      }
      outputs.push(code)
    } else {
      outputs.push(code)
    }
    if (position === hashPosition) {
      const klassHash = id
        .replace(path.sep, '')
        .split(path.sep)
        .join('__')
        .replace(/\.(njs|nts|jsx|tsx)$/, `___${klassName}`)

      outputs.push(
        `static hash = '${klassHash}';\n${Object.entries(hashes)
          .map(
            fn => `static ${fn[0]} = $runtime.invoke("${fn[0]}", this.hash)\n`
          )
          .join('\n')}\n\n`
      )
    }
  }
  let newSource = outputs.reverse().join('')
  if (!klassName) return newSource

  const runtime_accept = `
  if (module.hot) {
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
    );
  }`

  return `${newSource}\n\n${runtime_accept}`
}