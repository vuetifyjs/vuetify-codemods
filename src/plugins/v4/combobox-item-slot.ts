import type { AST } from 'vue-eslint-parser'
import type { CodemodPlugin } from 'vue-metamorph'
import { findSlotNodes } from '../../helpers'

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
      if (
        !node.value
        || node.value.type !== 'VExpressionContainer'
        || node.value.expression?.type !== 'VSlotScopeExpression'
      ) continue
      const slotExpression = node.value.expression
      // vue-metamorph has its own incomplete AST types for some
      // reason instead of re-exporting them from vue-eslint-parser
      const templateElement = node.parent.parent as unknown as AST.VElement

      if (slotExpression.params.length === 1 && slotExpression.params[0]!.type === 'ObjectPattern') {
        // Destructured case: need to check if all usages are .raw or mixed
        const objectPattern = slotExpression.params[0]
        let itemPropertyFound = false

        for (const prop of objectPattern.properties) {
          if (prop.type === 'Property' && prop.key.type === 'Identifier' && prop.key.name === 'item') {
            itemPropertyFound = true
            break
          }
        }

        if (itemPropertyFound) {
          // Use templateElement.variables to analyze 'item' usages
          let hasRawUsage = false
          let hasNonRawUsage = false

          // Check if the property is already aliased (not shorthand)
          for (const prop of objectPattern.properties) {
            if (
              prop.type === 'Property'
              && prop.key.type === 'Identifier'
              && prop.key.name === 'item'
              && !prop.shorthand
            ) hasNonRawUsage = true
          }

          // Find the 'item' variable and analyze its references
          const itemVariable = templateElement.variables.find(v => v.id.name === 'item')
          if (itemVariable) {
            for (const reference of itemVariable.references) {
              const memberExpr = reference.id.parent
              if (
                memberExpr?.type === 'MemberExpression'
                && memberExpr.property.type === 'Identifier'
              ) {
                // Check for item.raw.X pattern
                if (memberExpr.property.name === 'raw') {
                  hasRawUsage = true
                } else if (memberExpr.property.name !== 'raw') {
                  // Direct item.X usage (non-raw)
                  hasNonRawUsage = true
                }
              }
            }
          }

          // Second pass: apply transformations based on analysis
          const shouldAlias = hasNonRawUsage
          const shouldRemoveRaw = hasRawUsage && !hasNonRawUsage

          if (shouldAlias) {
            // Alias item to internalItem in the destructuring
            for (const prop of objectPattern.properties) {
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
          } else if (shouldRemoveRaw) {
            // Only remove .raw, don't alias
            const itemVariable = templateElement.variables.find(v => v.id.name === 'item')
            if (itemVariable) {
              for (const reference of itemVariable.references) {
                const memberExpr = reference.id.parent
                // Check for item.raw.X pattern and replace with item.X
                if (
                  memberExpr?.type === 'MemberExpression'
                  && memberExpr.parent?.type === 'MemberExpression'
                  && memberExpr.property.type === 'Identifier'
                  && memberExpr.property.name === 'raw'
                ) {
                  memberExpr.parent.object = memberExpr.object
                  count++
                }
              }
            }
          }
        }
      } else if (slotExpression.params.length === 1 && slotExpression.params[0]!.type === 'Identifier') {
        // Non-destructured case
        // replace data.item -> data.internalItem
        // data.item.raw -> data.item
        const seen = new WeakSet()
        const paramName = slotExpression.params[0].name
        const paramVariable = templateElement.variables.find(v => v.id.name === paramName)
        if (paramVariable) {
          for (const reference of paramVariable.references) {
            const memberExpr = reference.id.parent
            if (
              memberExpr?.type === 'MemberExpression'
              && memberExpr.parent?.type === 'MemberExpression'
              && memberExpr.property.type === 'Identifier'
            ) {
              if (
                memberExpr.parent.property.type === 'Identifier'
                && memberExpr.parent.property.name === 'raw'
                && memberExpr.parent.parent?.type === 'MemberExpression'
              ) {
                memberExpr.parent.parent.object = memberExpr
                seen.add(memberExpr)
                count++
              } else if (
                memberExpr.property.name === 'item'
                && !seen.has(memberExpr)
              ) {
                // Only rename data.item to data.internalItem if it wasn't part of a .raw removal
                memberExpr.property.name = 'internalItem'
                count++
              }
            }
          }
        }
      }
    }
    return count
  },
}
