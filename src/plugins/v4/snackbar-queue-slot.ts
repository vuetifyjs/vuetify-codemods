import type { CodemodPlugin } from 'vue-metamorph'
import { findSlotNodes } from '../../helpers'

export const v4SnackbarQueueSlotPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-snackbar-queue-slot',
  transform ({ sfcAST }) {
    if (!sfcAST) return 0
    let count = 0
    const slotNodes = findSlotNodes(sfcAST, ['VSnackbarQueue'], ['default'])
    for (const node of slotNodes) {
      if (node.key.type === 'VDirectiveKey') {
        if (!node.key.argument) {
          node.key.name.rawName = '#'
          node.key.argument = {
            type: 'VIdentifier',
            rawName: 'item',
          } as any
          count++
        } else if (node.key.argument.type === 'VIdentifier') {
          node.key.argument.rawName = 'item'
          count++
        }
      }
    }
    return count
  },
}
