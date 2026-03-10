import type { AST, CodemodPlugin, CodemodPluginContext } from 'vue-metamorph'
import { astHelpers } from 'vue-metamorph'
import { classify, setParents } from '../../helpers'

type Builders = CodemodPluginContext['utils']['builders']

const breakpoints = ['sm', 'md', 'lg', 'xl', 'xxl'] as const

export const v4GridPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-grid',
  transform ({ sfcAST, utils }) {
    if (!sfcAST) return 0
    let count = 0
    const { builders } = utils

    const elements = astHelpers.findAll(sfcAST, { type: 'VElement' })

    for (const el of elements) {
      const tag = el.rawName

      // VRow
      if (classify(tag) === 'VRow') {
        // dense -> density="compact"
        const denseAttr = getStaticAttr(el, 'dense')
        if (denseAttr) {
          const idx = el.startTag.attributes.indexOf(denseAttr)
          el.startTag.attributes.splice(idx, 1,
            builders.vAttribute(
              builders.vIdentifier('density'),
              builders.vLiteral('compact'),
            ))
          setParents(el.startTag, builders)
          count++
        }

        // align, justify, align-content (+ breakpoint variants) -> utility classes
        for (const prop of ['align', 'justify', 'align-content'] as const) {
          if (propToClass(el, prop, prop, builders)) count++
          for (const bp of breakpoints) {
            if (propToClass(el, `${prop}-${bp}`, `${prop}-${bp}`, builders)) count++
          }
        }
      }

      // VCol
      if (classify(tag) === 'VCol') {
        // order (+ breakpoint variants) -> utility classes
        if (propToClass(el, 'order', 'order', builders)) count++
        for (const bp of breakpoints) {
          if (propToClass(el, `order-${bp}`, `order-${bp}`, builders)) count++
        }

        // align-self -> utility class
        if (propToClass(el, 'align-self', 'align-self', builders)) count++
      }
    }

    return count
  },
}

function getStaticAttr (el: AST.VElement, name: string) {
  return el.startTag.attributes.find(
    a => !a.directive && a.key.name === name,
  )
}

function removeAttr (el: AST.VElement, name: string) {
  const idx = el.startTag.attributes.findIndex(
    a => !a.directive && a.key.name === name,
  )
  if (~idx) el.startTag.attributes.splice(idx, 1)
}

function appendStaticClass (el: AST.VElement, cls: string, builders: Builders) {
  const attr = getStaticAttr(el, 'class')
  if (attr?.value) {
    if (attr.value.type === 'VLiteral') {
      attr.value.value = attr.value.value ? `${attr.value.value} ${cls}` : cls
    }
  } else {
    el.startTag.attributes.unshift(
      builders.vAttribute(
        builders.vIdentifier('class'),
        builders.vLiteral(cls),
      ),
    )
    setParents(el.startTag, builders)
  }
}

function propToClass (
  el: AST.VElement,
  propName: string,
  classPrefix: string,
  builders: Builders,
): boolean {
  const attr = getStaticAttr(el, propName)
  if (attr?.value?.type !== 'VLiteral' || !attr.value.value) return false

  appendStaticClass(el, `${classPrefix}-${attr.value.value}`, builders)
  removeAttr(el, propName)
  return true
}
