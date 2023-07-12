import { ParseResult } from '@babel/parser'
import traverse from '@babel/traverse'
import * as t from '@babel/types'

const attributes = ['ref', 'bind']

export = function (ast: ParseResult<t.File>, source: string): void {
  traverse(ast, {
    JSXAttribute(path) {
      const attribute = path.node.name.name.toString()
      if (attributes.includes(attribute)) {
        const expression = path.node.value['expression']
        if (expression.type !== 'Identifier') {
          const { object, property } = expression
          const refObject = source.slice(object.start, object.end)
          let refProperty = source.slice(property.start, property.end)
          if (property.type === 'Identifier' && !expression.computed) {
            refProperty = `'${refProperty}'`
          }
          path.replaceWith(
            t.jsxAttribute(
              t.jsxIdentifier(attribute),
              t.jsxExpressionContainer(
                t.objectExpression([
                  t.objectProperty(
                    t.identifier('object'),
                    t.identifier(refObject)
                  ),
                  t.objectProperty(
                    t.identifier('property'),
                    t.identifier(refProperty)
                  )
                ])
              )
            )
          )
          path.skip()
        }
      }
    }
  })
}
