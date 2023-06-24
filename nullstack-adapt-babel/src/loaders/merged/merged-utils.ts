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

type RuntimeAccept = {
  id: string
  imports: string[]
  klassName: string
  hashes: Record<string, string>
  initiateDeps?: string[]
}

export function createRuntimeAccept({
  id,
  imports,
  klassName,
  hashes
}: RuntimeAccept): string {
  return `
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
}
