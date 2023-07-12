const esbuild = require('esbuild')
const glob = require('tiny-glob')

;(async () => {
  const files = await glob('src/**/*.{js,ts}', {
    filesOnly: true
  })
  const isProduction = process.argv[2] === 'prod'
  /** @type esbuild.BuildOptions */
  const esbuild_options = {
    entryPoints: files,
    platform: 'node',
    target: ['node14'],
    outdir: 'dist',
    format: 'cjs',
    treeShaking: true,
    minify: isProduction,
    allowOverwrite: true
  }
  if (isProduction) {
    return esbuild.buildSync(esbuild_options)
  }

  const ctx = esbuild.context(esbuild_options)
  ;(await ctx).watch()
  console.log('esbuild is watching...')

  const isTest = process.argv[2] === 'test'
  if (isTest) {
    const { spawn } = require('child_process')
    spawn('vitest', ['--reporter=verbose --config ./test/vite.config.ts'], {
      shell: true,
      stdio: 'inherit'
    })
  }
})()
