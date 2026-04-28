import type { CodemodPlugin } from 'vue-metamorph'
import { findClassNodes } from '../../helpers'

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const
const replacements: Record<string, string> = {
  'h1': '-display-large',
  'h2': '-display-large',
  'h3': '-display-medium',
  'h4': '-headline-large',
  'h5': '-headline-small',
  'h6': '-title-large',
  'subtitle-1': '-body-large',
  'subtitle-2': '-title-small',
  'body-1': '-body-large',
  'body-2': '-body-medium',
  'caption': '-body-small',
  'button': '-label-large',
  'overline': '-label-medium',
}

const matcher = String.raw`text(-(?:${breakpoints.join('|')}))?-(${Object.keys(replacements).join('|')})`

export const v4TypographyPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-typography',
  transform ({ sfcAST, utils }) {
    if (!sfcAST) return 0
    let count = 0
    const { results, matchingRegexp } = findClassNodes(sfcAST, utils, [matcher])
    for (const node of results) {
      if (node.type === 'Identifier') {
        node.name = node.name.replaceAll(matchingRegexp, (_, s, b, m) => `${s}text${b || ''}${replacements[m]}`)
        count++
      } else if (typeof node.value === 'string') {
        node.value = node.value.replaceAll(matchingRegexp, (_, s, b, m) => `${s}text${b || ''}${replacements[m]}`)
        count++
      }
    }
    return count
  },
}
