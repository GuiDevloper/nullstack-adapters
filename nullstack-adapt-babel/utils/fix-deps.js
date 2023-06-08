const fs = require('fs')
const path = require('path')
const atCWD = fullPath => path.join(process.cwd(), fullPath)

/**
 * Try to fix dependencies issues at virtual NPM environments (e.g: ajv)
 * @see https://github.com/ajv-validator/ajv-keywords/issues/385
 **/
function fixDeps() {
  try {
    const isVirtualNPM =
      process.env.PKG_MANAGER === 'npm' && !process.env.npm_config_registry
    if (isVirtualNPM && !process.env.DISABLE_AJV_FIX) {
      const ajvJSON = require(atCWD('node_modules/ajv/package.json'))
      if (ajvJSON.version !== '7.2.4') {
        console.log('Fixing npm deps...')
        const cprocess = require('child_process')
        const npmCLI = process.platform === 'win32' ? 'npm.cmd' : 'npm'
        cprocess.spawnSync(npmCLI, 'install ajv@7.2.4'.split(' '))
        const pkgJSON = fs.readFileSync(atCWD('package.json'), 'utf8')
        fs.writeFileSync(
          atCWD('package.json'),
          pkgJSON.replace(/[ ]+"ajv": "(\^|)7.2.4"(,|)\n/, '')
        )
      }
    }
  } catch {}
}

module.exports = fixDeps
