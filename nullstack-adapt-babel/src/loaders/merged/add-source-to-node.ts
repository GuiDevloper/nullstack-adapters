import { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

export = function (ast: ParseResult<t.File>): void {
  traverse(ast, {
    JSXAttribute(path) {
      if (path.node.name.name.toString().startsWith('on')) {
        const hasSource = path.parent['attributes'].find(
          a => a?.name?.name === 'source'
        )
        if (!hasSource) {
          path.insertBefore(
            t.jsxAttribute(
              t.jsxIdentifier('source'),
              t.jsxExpressionContainer(t.identifier('this'))
            )
          )
        }
      }
    }
  })
}
