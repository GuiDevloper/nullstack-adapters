import { ParseResult } from '@babel/parser'
import traverse, { type NodePath } from '@babel/traverse'
import * as t from '@babel/types'

export = function (ast: ParseResult<t.File>): void {
  traverse(ast, {
    ClassMethod(path) {
      let innerComponents: string[] = []
      function identify(subpath: NodePath<t.JSXOpeningElement>) {
        const nodeName: string = subpath.node.name['name']
        const pathAndSubpath = `${path.node.key}/${nodeName}`
        const isComponent =
          /^[A-Z]/.test(nodeName) &&
          !innerComponents.includes(`${pathAndSubpath}`)
        if (!isComponent) return

        const hasBinding = path.scope.hasBinding(nodeName)
        const bindingIsType =
          !!path.scope.getBindingIdentifier(nodeName)?.typeAnnotation
        const isInnerComponent = !hasBinding || bindingIsType
        if (isInnerComponent) {
          innerComponents.push(pathAndSubpath)
          const declaration = t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(nodeName),
              t.identifier(`this.render${nodeName}`)
            )
          ])
          path.get('body').unshiftContainer('body', declaration)
        }
      }
      if (path.node.key['name'].startsWith('render')) {
        traverse(
          path.node,
          {
            JSXOpeningElement: identify
          },
          path.scope,
          path
        )
      }
    }
  })
}
