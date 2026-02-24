import type { CodemodPlugin } from 'vue-metamorph'
import { camelize, classify, findClassNodes } from '../../helpers'

const elevationComponents = new Set([
  'VAlert',
  'VAppBar',
  'VAppBarNavIcon',
  'VBanner',
  'VBottomNavigation',
  'VBtn',
  'VBtnGroup',
  'VBtnToggle',
  'VCard',
  'VChip',
  'VColorInput',
  'VColorPicker',
  'VDateInput',
  'VDatePicker',
  'VExpansionPanel',
  'VExpansionPanels',
  'VFab',
  'VFileUpload',
  'VFileUploadItem',
  'VFooter',
  'VHotkey',
  'VIconBtn',
  'VKbd',
  'VList',
  'VListItem',
  'VNavigationDrawer',
  'VPagination',
  'VPicker',
  'VRangeSlider',
  'VSheet',
  'VSkeletonLoader',
  'VSlider',
  'VStepper',
  'VStepperVertical',
  'VStepperVerticalItem',
  'VSystemBar',
  'VTab',
  'VTimePicker',
  'VTimelineItem',
  'VToolbar',
  'VTreeview',
  'VTreeviewItem',
  'VVideo',
  'VVideoControls',
])

const mapping = [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5]

const elevationMatch = String.raw`elevation-(\d{1,2})`
const elevationRegexp = new RegExp(String.raw`(^|\s)${elevationMatch}(?=$|\s)`, 'g')

export const v4ElevationPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-elevation',
  transform ({ sfcAST, utils }) {
    if (!sfcAST) return 0
    let count = 0

    // Match classes
    const found = findClassNodes(sfcAST, utils, [elevationMatch])
    for (const node of found) {
      if (node.type === 'Identifier') {
        node.name = node.name.replaceAll(elevationRegexp, (_, s, n) => `${s}elevation-${mapping[Number(n)]}`)
        count++
      } else if (typeof node.value === 'string') {
        node.value = node.value.replaceAll(elevationRegexp, (_, s, n) => `${s}elevation-${mapping[Number(n)]}`)
        count++
      }
    }

    // Match elevation props
    utils.traverseTemplateAST(sfcAST, {
      enterNode (node) {
        if (node.type === 'VElement') {
          const elementName = classify(node.rawName)
          for (const attribute of node.startTag.attributes) {
            if (attribute.key.type !== 'VIdentifier') continue
            const attributeName = camelize(attribute.key.name)
            if (
              elevationComponents.has(elementName)
              && attributeName === 'elevation'
              && attribute.value?.type === 'VLiteral'
            ) {
              attribute.value.value = String(mapping[Number(attribute.value.value)])
              count++
            }
          }
        }
      },
    })
    return count
  },
}
