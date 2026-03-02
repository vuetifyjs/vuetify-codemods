import type { CodemodPlugin } from 'vue-metamorph'
import type { Ref } from '../../helpers'
import { findSlotNodes, findSlotPropReferences, removeDotMember } from '../../helpers'

export const v4ComboboxItemSlotPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-combobox-item-slot',
  transform ({ sfcAST }) {
    if (!sfcAST) return 0
    let count = 0

    const slotNodes = findSlotNodes(
      sfcAST,
      ['VSelect', 'VAutocomplete', 'VCombobox'],
      ['item', 'chip', 'selection'],
    )

    for (const node of slotNodes) {
      const refs = findSlotPropReferences(node, ['item'])

      const destructuredRefs = new Map<string, Ref[]>()
      const variableRefs: Ref[] = []

      for (const ref of refs) {
        if (ref.prop) {
          if (ref.prop.key.type !== 'Identifier') continue
          const arr = destructuredRefs.get(ref.prop.key.name) ?? []
          arr.push(ref)
          destructuredRefs.set(ref.prop.key.name, arr)
        } else {
          variableRefs.push(ref)
        }
      }

      // Process destructured refs (e.g. v-slot="{ item }")
      const destructuredItemRefs = destructuredRefs.get('item') ?? []
      if (destructuredItemRefs.length > 0) {
        let hasRaw = false
        let hasNonRaw = false
        for (const ref of destructuredItemRefs) {
          const parent = ref.reference.parent
          if (parent?.type === 'MemberExpression' && parent.property.type === 'Identifier') {
            if (parent.property.name === 'raw') hasRaw = true
            else hasNonRaw = true
          }
        }

        if (hasNonRaw) {
          // Alias item -> internalItem in the object pattern
          if (
            node.value?.type === 'VExpressionContainer'
            && node.value.expression?.type === 'VSlotScopeExpression'
          ) {
            const obj = node.value.expression.params?.[0]
            if (obj?.type === 'ObjectPattern') {
              for (const prop of obj.properties) {
                if (
                  prop.type === 'Property'
                  && prop.key.type === 'Identifier'
                  && prop.key.name === 'item'
                ) {
                  prop.key.name = 'internalItem'
                  prop.shorthand = false
                  count++
                  break
                }
              }
            }
          }
        } else if (hasRaw) {
          // Remove .raw: item.raw.x -> item.x
          for (const ref of destructuredItemRefs) {
            count += removeDotMember(ref.reference, 'raw')
          }
        }
      }

      // Process variable refs (e.g. v-slot="data")
      for (const ref of variableRefs) {
        // ref.reference.parent is the `data.item` MemberExpression
        const itemMember = ref.reference.parent
        if (
          itemMember?.type === 'MemberExpression'
          && itemMember.parent?.type === 'MemberExpression'
          && itemMember.parent.property.type === 'Identifier'
          && itemMember.parent.property.name === 'raw'
        ) {
          // Remove .raw: data.item.raw.x -> data.item.x
          count += removeDotMember(ref.reference, 'raw')
        } else {
          // Rename data.item -> data.internalItem
          ref.reference.name = 'internalItem'
          count++
        }
      }
    }

    return count
  },
}
