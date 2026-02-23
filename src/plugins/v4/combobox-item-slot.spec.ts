import { expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4ComboboxItemSlotPlugin } from './combobox-item-slot'

it('removes .raw if all usages are raw', () => {
  const input = `
  <template>
    <VSelect item-title="name">
      <template #item="{ item, props }">
        <VListItem v-bind="props" :title="item.raw.name" />
      </template>
    </VSelect>
  </template>
`

  expect(transform(input, 'file.vue', [v4ComboboxItemSlotPlugin]).code).toMatchInlineSnapshot(`
    "
      <template>
        <VSelect item-title="name">
          <template #item="{ item, props }">
            <VListItem v-bind="props" :title="item.name" />
          </template>
        </VSelect>
      </template>
    "
  `)
})

it('aliases item to internalItem', () => {
  const input = `
  <template>
    <VSelect item-title="name">
      <template #item="{ item, props }">
        <VListItem v-bind="props" :title="item.title" />
        <VListItem v-bind="props" :title="item.raw.name" />
      </template>
    </VSelect>
  </template>
`

  expect(transform(input, 'file.vue', [v4ComboboxItemSlotPlugin]).code).toMatchInlineSnapshot(`
    "
      <template>
        <VSelect item-title="name">
          <template #item="{ internalItem: item, props }">
            <VListItem v-bind="props" :title="item.title" />
            <VListItem v-bind="props" :title="item.raw.name" />
          </template>
        </VSelect>
      </template>
    "
  `)
})

it('handles already aliased values', () => {
  const input = `
  <template>
    <VSelect item-title="name">
      <template #item="{ item: selectItem, props }">
        <VListItem v-bind="props" :title="selectItem.title" />
      </template>
    </VSelect>
  </template>
`

  expect(transform(input, 'file.vue', [v4ComboboxItemSlotPlugin]).code).toMatchInlineSnapshot(`
    "
      <template>
        <VSelect item-title="name">
          <template #item="{ internalItem: selectItem, props }">
            <VListItem v-bind="props" :title="selectItem.title" />
          </template>
        </VSelect>
      </template>
    "
  `)
})

it('handles non-destructured values', () => {
  const input = `
  <template>
    <VSelect item-title="name">
      <template #item="data">
        <VListItem v-bind="data.props" :title="data.item.title" />
        <VListItem v-bind="data.props" :title="data.item.raw.name" />
      </template>
    </VSelect>
  </template>
`

  expect(transform(input, 'file.vue', [v4ComboboxItemSlotPlugin]).code).toMatchInlineSnapshot(`
    "
      <template>
        <VSelect item-title="name">
          <template #item="data">
            <VListItem v-bind="data.props" :title="data.internalItem.title" />
            <VListItem v-bind="data.props" :title="data.item.name" />
          </template>
        </VSelect>
      </template>
    "
  `)
})
