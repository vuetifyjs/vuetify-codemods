import type { AST } from 'vue-metamorph'
import { astHelpers } from 'vue-metamorph'

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

export function findSlotNodes (
  ast: AST.VDocumentFragment,
  components: string[] | null,
  slots: string[] | null,
) {
  return astHelpers.findAll(ast, {
    type: 'VAttribute',
    directive: true,
    key: {
      type: 'VDirectiveKey',
      name: {
        type: 'VIdentifier',
        name: 'slot',
      },
    },
  }).filter(node => {
    if (components && !(
      node.parent.type === 'VStartTag'
      && (
        (
          node.parent.parent.name === 'template'
          && node.parent.parent.parent.type === 'VElement'
          && components.includes(camelize(node.parent.parent.parent.rawName))
        )
        || components.includes(camelize(node.parent.parent.rawName))
      )
    )) return false
    if (slots && !(
      node.key.type === 'VDirectiveKey'
      && (
        (!node.key.argument && slots.includes('default'))
        || (
          node.key.argument?.type === 'VIdentifier'
          && slots.includes(node.key.argument.name)
        )
      )
    )) return false
    return true
  })
}
