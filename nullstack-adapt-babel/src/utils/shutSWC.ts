import fs from 'fs'
import { disabledAdapter, atCWD } from '.'

function shutSWC() {
  try {
    const shutRule = !disabledAdapter()
    const getReturnStr = (shut: boolean) => (shut ? 'return {};' : '')
    const getSWCRule = (shut: boolean) =>
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

export default shutSWC
