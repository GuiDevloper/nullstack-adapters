import path from 'path'
import * as t from '@babel/types'
import traverse, { type NodePath } from '@babel/traverse'
import type { ParserPlugin } from '@babel/parser'
import type { UserSettings } from '../index'

export function getKlassHash(id: string, klassName: string): string {
  return id
    .replace(path.sep, '')
    .split(path.sep)
    .join('__')
    .replace(/\.(njs|nts|jsx|tsx)$/, `___${klassName}`)
}

export function createStaticClassProperty(
  name: string,
  value: string
): t.ClassProperty {
  return t.classProperty(
    t.identifier(name),
    t.identifier(value),
    null,
    [],
    false,
    true
  )
}

export type KlassAcceptable = {
  name: string
  hashes?: Record<string, string>
  initiateDeps?: string[]
}

type RuntimeAccept = {
  id: string
  imports: string[]
  klasses: KlassAcceptable[]
}

export function createRuntimeAccept({
  id,
  imports,
  klasses
}: RuntimeAccept): string {
  return `
  if (module.hot) {
    $runtime.accept(
      module,
      '${id.split(path.sep).join('/')}',
      ${JSON.stringify(imports)},
      [${klasses.map(
        klass => `{
          klass: ${klass.name},
          initiate: ${JSON.stringify(klass.initiateDeps)},
          hashes: ${JSON.stringify(klass.hashes)}
        }`
      )}]
    );
  }`
}

type GetInitiateDepsParams = {
  initiateNode: t.ClassMethod
  serverFunctions: string[]
  path: NodePath<t.ClassDeclaration>
}

export function getInitiateDeps(args: GetInitiateDepsParams) {
  const initiateDeps: string[] = []
  if (args.initiateNode) {
    let passedItself = false
    traverse(
      args.initiateNode,
      {
        Identifier(identifierPath) {
          const identifierName = identifierPath.node.name
          if (identifierName === 'initiate' && !passedItself) {
            passedItself = true
            return
          }
          if (args.serverFunctions.includes(identifierName)) {
            initiateDeps.push(identifierName)
          }
        }
      },
      args.path.scope,
      args.path
    )
  }
  return initiateDeps
}

const babelParserProposals: Record<string, ParserPlugin> = {
  '@babel/plugin-proposal-do-expressions': 'doExpressions',
  '@babel/plugin-proposal-throw-expressions': 'throwExpressions'
}

export function getUserParserPlugins(
  userSettings: UserSettings
): ParserPlugin[] {
  let userPlugins = userSettings?.babel?.plugins || []
  return userPlugins
    .map(plugin => babelParserProposals[plugin.toString()])
    .filter(Boolean)
}
