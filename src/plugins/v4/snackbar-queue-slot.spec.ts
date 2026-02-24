import { expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4SnackbarQueueSlotPlugin } from './snackbar-queue-slot'

it('renames default slot to item', () => {
  const input = `
<template>
  <VSnackbarQueue>
    <template #default="{ item }">
      <v-snackbar v-bind="item" />
    </template>
  </VSnackbarQueue>
</template>
`

  expect(transform(input, 'file.vue', [v4SnackbarQueueSlotPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <VSnackbarQueue>
        <template #item="{ item }">
          <v-snackbar v-bind="item" />
        </template>
      </VSnackbarQueue>
    </template>
    "
  `)
})

it('works without template', () => {
  const input = `
<template>
  <VSnackbarQueue v-slot="{ item }">
    <v-snackbar v-bind="item" />
  </VSnackbarQueue>
  <VSnackbarQueue #default="{ item }">
    <v-snackbar v-bind="item" />
  </VSnackbarQueue>
</template>
`

  expect(transform(input, 'file.vue', [v4SnackbarQueueSlotPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <VSnackbarQueue #item="{ item }">
        <v-snackbar v-bind="item" />
      </VSnackbarQueue>
      <VSnackbarQueue #item="{ item }">
        <v-snackbar v-bind="item" />
      </VSnackbarQueue>
    </template>
    "
  `)
})
