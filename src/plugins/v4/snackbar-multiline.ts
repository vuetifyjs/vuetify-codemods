import type { CodemodPlugin } from 'vue-metamorph'
import { camelize, classify } from '../../helpers'

export const v4SnackbarMultilinePlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-snackbar-multiline',
  transform ({ sfcAST, utils: { builders, traverseTemplateAST } }) {
    if (!sfcAST) return 0
    let count = 0
    traverseTemplateAST(sfcAST, {
      enterNode (node) {
        if (
          node.type !== 'VElement'
          || classify(node.rawName) !== 'VSnackbar'
        ) return
        for (const attribute of node.startTag.attributes) {
          if (attribute.key.type !== 'VIdentifier') continue
          if (camelize(attribute.key.name) === 'multiLine') {
            node.startTag.attributes = node.startTag.attributes.filter(attr => attr !== attribute)

            const hasMinHeight = node.startTag.attributes.some(attr =>
              attr.key.type === 'VIdentifier'
              && camelize(attr.key.name) === 'minHeight',
            )

            if (!hasMinHeight) {
              node.startTag.attributes.push(
                builders.vAttribute(builders.vIdentifier('min-height'), builders.vLiteral('68')),
              )
              builders.setParents(node.startTag)
            }

            count++
            break
          }
        }
      },
    })
    return count
  },
}
