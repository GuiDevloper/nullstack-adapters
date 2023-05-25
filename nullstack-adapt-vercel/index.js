#! /usr/bin/env node

if (process.env.VERCEL) {
  const { cpSync, mkdirSync, rmSync, writeFileSync } = require('node:fs')

  const VERCEL_DIR = '.vercel/output'
  rmSync(VERCEL_DIR, { recursive: true, force: true })

  try {
    mkdirSync(`${VERCEL_DIR}/functions/index.func`, { recursive: true })
  } catch {}

  writeFileSync(
    `${VERCEL_DIR}/functions/index.func/index.js`,
    `module.exports = require('.production/server').default.server`,
  )

  writeFileSync(
    `${VERCEL_DIR}/functions/index.func/.vc-config.json`,
    JSON.stringify(
      {
        handler: 'index.js',
        runtime: 'nodejs18.x',
        launcherType: 'Nodejs',
        shouldAddHelpers: true,
        shouldAddSourcemapSupport: true,
      },
      null,
      '\t',
    ),
  )

  writeFileSync(
    `${VERCEL_DIR}/config.json`,
    JSON.stringify(
      {
        version: 3,
        routes: [
          {
            handle: 'filesystem',
          },
          {
            src: '(.*)',
            dest: 'index',
          },
        ],
      },
      null,
      '\t',
    ),
  )

  cpSync('.production', `${VERCEL_DIR}/functions/index.func/.production`, {
    recursive: true,
  })
  cpSync('public', `${VERCEL_DIR}/static`, { recursive: true })
}
