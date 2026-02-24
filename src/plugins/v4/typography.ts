import type { CodemodPlugin } from 'vue-metamorph'
import { findClassNodes } from '../../helpers'
// import { camelize, classify } from '../../helpers'

const replacements: Record<string, string> = {
  'text-h1': 'text-display-large',
  'text-h2': 'text-display-medium',
  'text-h3': 'text-display-small',
  'text-h4': 'text-headline-large',
  'text-h5': 'text-headline-medium',
  'text-h6': 'text-headline-small',
  'text-subtitle-1': 'text-body-large',
  'text-subtitle-2': 'text-label-large',
  'text-body-1': 'text-body-large',
  'text-body-2': 'text-body-medium',
  'text-caption': 'text-body-small',
  'text-button': 'text-label-large',
  'text-overline': 'text-label-small',
}

const matchingRegexp = new RegExp(String.raw`(^|\s)(${Object.keys(replacements).join('|')})(?=$|\s)`, 'g')

export const v4TypographyPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-typography',
  transform ({ sfcAST, utils }) {
    if (!sfcAST) return 0
    let count = 0
    const found = findClassNodes(sfcAST, utils, Object.keys(replacements))
    for (const node of found) {
      if (node.type === 'Identifier') {
        node.name = node.name.replaceAll(matchingRegexp, (_, s, m) => `${s}${replacements[m]}`)
        count++
      } else if (typeof node.value === 'string') {
        node.value = node.value.replaceAll(matchingRegexp, (_, s, m) => `${s}${replacements[m]}`)
        count++
      }
    }
    return count
  },
}
