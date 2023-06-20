import path from 'path'
import fs from 'fs'
import glob from 'tiny-glob'

const FILENAME = path.join(__dirname, 'test-deps.ts')

export async function setup() {
  const DIST = await glob('./dist/**/*.js')
  const newFile = [
    '// DYNAMICALLY GENERATED AT EVERY TEST RUN',
    ...DIST.map(D => {
      return `export * from '${path
        .relative(__dirname, D)
        .split(path.sep)
        .join('/')}'`
    })
  ].join('\n')
  fs.writeFileSync(FILENAME, newFile)
}
