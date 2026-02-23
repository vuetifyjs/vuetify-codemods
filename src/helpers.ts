const camelizeRE = /-(\w)/g
export function camelize (str: string): string {
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

const classifyRE = /(?:^|[-_])(\w)/g
export function classify (str: string): string {
  return str
    .replace(classifyRE, c => c.toUpperCase())
    .replace(/[-_]/g, '')
}
