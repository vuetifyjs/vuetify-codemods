import type { namedTypes } from 'ast-types-x'
import type { AST as VueAST } from 'vue-eslint-parser'
import type { AST, CodemodPluginContext } from 'vue-metamorph'
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
          && components.includes(classify(node.parent.parent.parent.rawName))
        )
        || components.includes(classify(node.parent.parent.rawName))
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

export type Ref = { prop: namedTypes.Property | null, reference: VueAST.ESLintIdentifier }
export function findSlotPropReferences (
  slot: AST.VAttribute | AST.VDirective,
  props: string[] | null,
) {
  const results: Ref[] = []
  if (
    !slot.value
    || slot.value.type !== 'VExpressionContainer'
    || slot.value.expression?.type !== 'VSlotScopeExpression'
  ) return results
  const slotExpression = slot.value.expression
  // vue-metamorph has its own incomplete AST types for some
  // reason instead of re-exporting them from vue-eslint-parser
  const templateElement = slot.parent.parent as unknown as VueAST.VElement

  const searchProps = new Set(props)

  if (slotExpression.params.length === 1 && slotExpression.params[0]!.type === 'ObjectPattern') {
    // Destructured props (v-slot="{ prop }")
    for (const prop of slotExpression.params[0].properties) {
      if (
        prop.type === 'Property'
        && prop.key.type === 'Identifier'
        && searchProps.has(prop.key.name)
      ) {
        const variable = templateElement.variables.find(v =>
          prop.value.type === 'Identifier'
          && v.id.name === prop.value.name,
        )
        if (!variable) continue
        for (const reference of variable.references) {
          results.push({
            prop,
            reference: reference.id,
          })
        }
      }
    }
  } else if (slotExpression.params.length === 1 && slotExpression.params[0]!.type === 'Identifier') {
    // Non-destructured (v-slot="data")
    const paramName = slotExpression.params[0].name
    const paramVariable = templateElement.variables.find(v => v.id.name === paramName)
    if (paramVariable) {
      for (const reference of paramVariable.references) {
        const memberExpr = reference.id.parent
        if (
          memberExpr?.type === 'MemberExpression'
          && memberExpr.property.type === 'Identifier'
          && searchProps.has(memberExpr.property.name)
        ) {
          results.push({
            prop: null,
            reference: memberExpr.property,
          })
        }
      }
    }
  }
  return results
}

// A map of components and props that should be treated the same as class
const classProps = new Map<string, string | string[]>([
  ['VAppBarNavIcon', 'selectedClass'],
  ['VBottomNavigation', 'selectedClass'],
  ['VBottomSheet', 'contentClass'],
  ['VBreadcrumbs', 'activeClass'],
  ['VBreadcrumbsItem', 'activeClass'],
  ['VBtn', 'selectedClass'],
  ['VBtnToggle', 'selectedClass'],
  ['VCarousel', 'selectedClass'],
  ['VCarouselItem', ['selectedClass', 'contentClass']],
  ['VChip', ['activeClass', 'selectedClass']],
  ['VChipGroup', ['contentClass', 'selectedClass']],
  ['VDialog', 'contentClass'],
  ['VExpansionPanel', 'selectedClass'],
  ['VExpansionPanels', 'selectedClass'],
  ['VFab', 'selectedClass'],
  ['VFileUploadItem', 'activeClass'],
  ['VImg', 'contentClass'],
  ['VItem', 'selectedClass'],
  ['VItemGroup', 'selectedClass'],
  ['VList', 'activeClass'],
  ['VListItem', 'activeClass'],
  ['VMenu', 'contentClass'],
  ['VOverlay', 'contentClass'],
  ['VResponsive', 'contentClass'],
  ['VSlideGroup', ['contentClass', 'selectedClass']],
  ['VSlideGroupItem', 'selectedClass'],
  ['VSnackbar', 'contentClass'],
  ['VSnackbarQueue', 'contentClass'],
  ['VSpeedDial', 'contentClass'],
  ['VStepper', 'selectedClass'],
  ['VStepperItem', 'selectedClass'],
  ['VStepperVertical', 'selectedClass'],
  ['VStepperVerticalItem', 'selectedClass'],
  ['VStepperWindow', 'selectedClass'],
  ['VStepperWindowItem', 'selectedClass'],
  ['VTab', 'selectedClass'],
  ['VTabs', ['selectedClass', 'contentClass']],
  ['VTabsWindow', 'selectedClass'],
  ['VTabsWindowItem', 'selectedClass'],
  ['VTooltip', 'contentClass'],
  ['VTreeview', 'activeClass'],
  ['VTreeviewItem', 'activeClass'],
  ['VWindow', 'selectedClass'],
  ['VWindowItem', 'selectedClass'],
])

export function findClassNodes (ast: AST.VDocumentFragment, utils: CodemodPluginContext['utils'], match: string[]) {
  const matchingRegexp = new RegExp(String.raw`(^|\s)(?:${match.join('|')})(?=$|\s)`)

  const results: (AST.VLiteral | namedTypes.Literal | namedTypes.Identifier)[] = []

  const attrs = astHelpers.findAll(ast, { type: 'VAttribute' })
  for (const node of attrs) {
    let attributeName: string
    if (node.key.type === 'VIdentifier') {
      attributeName = camelize(node.key.name)
    } else if (
      node.key.type === 'VDirectiveKey'
      && node.key.name.name === 'bind'
      && node.key.argument?.type === 'VIdentifier'
    ) {
      attributeName = camelize(node.key.argument.name)
    } else {
      continue
    }

    const elementName = classify(node.parent.parent.rawName)

    const allowed = new Set<string>(['class'])
    if (elementName && classProps.has(elementName)) {
      const prop = classProps.get(elementName)
      if (Array.isArray(prop)) for (const p of prop) allowed.add(camelize(p))
      else if (prop) allowed.add(camelize(prop))
    }

    if (!allowed.has(attributeName)) continue

    if (!node.value) continue

    utils.traverseTemplateAST(node.value, {
      enterNode (node) {
        if (
          (node.type === 'VLiteral' || node.type === 'Literal')
          && typeof node.value === 'string'
          && matchingRegexp.test(node.value)
        ) {
          results.push(node)
        } else if (
          node.type === 'Property'
          && (node.key.type === 'Literal'
            || (node.key.type === 'Identifier' && !node.computed)
          )
        ) {
          results.push(node.key)
        }
      },
    })
  }

  return results
}

export function removeDotMember (ref: VueAST.ESLintIdentifier, name: string) {
  let current: VueAST.Node = ref
  let count = 0

  while (current?.parent) {
    const parent: VueAST.Node = current.parent
    if (parent.type !== 'MemberExpression') break

    if (
      parent.property.type === 'Identifier'
      && parent.property.name === name
      && !parent.computed
      && parent.parent
    ) {
      if (replaceChildNode(parent.parent, parent, current)) {
        count++
      }
      break
    }

    current = parent
  }

  return count
}

function replaceChildNode (parent: VueAST.Node, oldChild: VueAST.Node, newChild: VueAST.Node) {
  for (const key of Object.keys(parent)) {
    if ((parent as any)[key] === oldChild) {
      (parent as any)[key] = newChild
      return true
    }
  }
  return false
}
