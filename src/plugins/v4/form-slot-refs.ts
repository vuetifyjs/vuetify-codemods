import type { CodemodPlugin } from 'vue-metamorph'
import { findSlotNodes, findSlotPropReferences, removeDotMember } from '../../helpers'

export const v4FormSlotRefsPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-form-slot-refs',
  transform ({ sfcAST }) {
    if (!sfcAST) return 0
    let count = 0
    const slotNodes = findSlotNodes(sfcAST, ['VForm'], ['default'])
    for (const node of slotNodes) {
      const refs = findSlotPropReferences(
        node,
        ['errors', 'isDisabled', 'isReadonly', 'isValidating', 'isValid', 'items'],
      )
      for (const ref of refs) {
        count += removeDotMember(ref.reference, 'value')
      }
    }
    return count
  },
}
