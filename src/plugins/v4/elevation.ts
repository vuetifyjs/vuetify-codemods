import type { CodemodPlugin } from 'vue-metamorph'
import { camelize, classify } from '../../helpers'

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
const classComponents = new Map<string, string | string[]>([
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

const mapping = [0, 1, 1, 1, 2, 2, 2, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5]

const elevationRegexp = /(^|\s)elevation-(\d{1,2})(?=$|\s)/g

export const v4ElevationPlugin: CodemodPlugin = {
  type: 'codemod',
  name: 'vuetify-4-elevation',
  transform ({ sfcAST, utils: { traverseTemplateAST } }) {
    if (!sfcAST) return 0
    let count = 0
    traverseTemplateAST(sfcAST, {
      enterNode (node) {
        if (node.type === 'VElement') {
          const elementName = classify(node.rawName)
          for (const attribute of node.startTag.attributes) {
            if (attribute.key.type !== 'VIdentifier') continue
            const attributeName = camelize(attribute.key.name)
            if (
              (attributeName === 'class' || (
                classComponents.has(elementName)
                && classComponents.get(elementName) === attributeName)
              )
              && attribute.value?.type === 'VLiteral' // TODO: handle class object/array
              && elevationRegexp.test(attribute.value.value)
            ) {
              attribute.value.value = attribute.value.value
                .replaceAll(elevationRegexp, (_, s, n) => `${s}elevation-${mapping[Number(n)]}`)
              count++
            } else if (
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
