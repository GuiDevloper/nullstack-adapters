import { parse } from '@babel/parser'
import traverse from '@babel/traverse'

export = function (source: string): string {
  const injections: Record<number, string[]> = []
  const positions: number[] = []
  const ast = parse(source, {
    sourceType: 'module',
    plugins: ['classProperties', 'jsx', 'typescript']
  })
  traverse(ast, {
    ClassMethod(path) {
      function identify(subpath) {
        if (/^[A-Z]/.test(subpath.node.name)) {
          const hasBinding = path.scope.hasBinding(subpath.node.name)
          const bindingIsType = !!path.scope.getBindingIdentifier(
            subpath.node.name
          )?.typeAnnotation
          const isInnerComponent = !hasBinding || bindingIsType
          if (isInnerComponent) {
            const start = path.node.body.body[0].start
            if (!positions.includes(start)) {
              positions.push(start)
            }
            if (!injections[start]) {
              injections[start] = []
            }
            if (!injections[start].includes(subpath.node.name)) {
              injections[start].push(subpath.node.name)
            }
          }
        }
      }
      if (path.node.key['name'].startsWith('render')) {
        traverse(
          path.node,
          {
            JSXIdentifier: identify,
            Identifier: identify
          },
          path.scope,
          path
        )
      }
    }
  })
  positions.reverse()
  positions.push(0)
  const outputs: string[] = []
  let last: number
  for (const position of positions) {
    const code = source.slice(position, last)
    last = position
    outputs.push(code)
    if (position) {
      for (const injection of injections[position]) {
        if (injection) {
          outputs.push(`const ${injection} = this.render${injection};\n    `)
        }
      }
    }
  }
  return outputs.reverse().join('')
}
