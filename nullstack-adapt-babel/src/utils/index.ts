import dotenv from 'dotenv'
dotenv.config({ path: atCWD('.env') })

import path from 'path'
import { Loader } from '../loaders'

export function atCWD(fullPath: string): string {
  return path.join(process.cwd(), fullPath)
}

export function disabledAdapter(): boolean {
  const keyName = 'NULLSTACK_DEFAULT_CONFIG'
  const config = { [keyName]: null }
  config[keyName] =
    process.env[keyName] ||
    require(atCWD('package.json'))?.['nullstack-adapt-babel']?.[keyName]

  return config[keyName]?.toString() === 'true'
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
