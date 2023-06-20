import path from 'path'
import { Loader } from '../loaders'

function atCWD(fullPath: string): string {
  return path.join(process.cwd(), fullPath)
}

function disabledAdapter(): boolean {
  const { DEFAULT_CONFIG } =
    require(atCWD('package.json'))?.stackblitz?.env || {}
  return DEFAULT_CONFIG || process.env.DEFAULT_CONFIG
}

export function removeRule(rules: Loader[], rule: Partial<Loader>) {
  const [name, value] = Object.entries(rule)[0]
  return rules.filter(R => !R[name]?.includes(value))
}

export function getRules(
  rules: Loader[],
  ruleList: (Partial<Loader> & Record<string, any>)[]
) {
  return ruleList
    .map(rule => {
      const [name, value] = Object.entries(rule)[0]
      return rules.filter(R =>
        encodeURI(R[name])?.includes(encodeURI(value.toString()))
      )
    })
    .flat()
}

export * from './getOptions'

export { atCWD, disabledAdapter }
