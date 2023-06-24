import path from 'path'
import * as t from '@babel/types'

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
          initiate: [],
          hashes: ${JSON.stringify(klass.hashes)}
        }`
      )}]
    );
  }`
}
