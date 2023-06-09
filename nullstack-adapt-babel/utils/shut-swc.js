// @ts-check
const fs = require('fs')
const { disabledAdapter, atCWD } = require('.')

function shutSWC() {
  try {
    const shutRule = !disabledAdapter()
    const getReturnStr = shut => (shut ? 'return {};' : '')
    const getSWCRule = shut =>
      `function swc(options, other) {${getReturnStr(shut)}\n`

    const modulePath = atCWD('node_modules/nullstack/webpack/module.js')
    const moduleFile = fs.readFileSync(modulePath, 'utf8')
    if (moduleFile.includes(getSWCRule(shutRule))) return

    fs.writeFileSync(
      modulePath,
      moduleFile.replace(getSWCRule(!shutRule), getSWCRule(shutRule))
    )
  } catch {}
}

module.exports = shutSWC
