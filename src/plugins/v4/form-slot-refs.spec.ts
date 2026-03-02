import { expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4FormSlotRefsPlugin } from './form-slot-refs'

it('destructured', () => {
  const input = `
<template>
  <VForm>
    <template #default="{ isValid }">
      {{ isValid.value }}
    </template>
  </VForm>
</template>
`

  expect(transform(input, 'file.vue', [v4FormSlotRefsPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <VForm>
        <template #default="{
      isValid,
    }">
          {{ isValid }}
        </template>
      </VForm>
    </template>
    "
  `)
})

it('variable', () => {
  const input = `
<template>
  <VForm>
    <template #default="data">
      {{ data.isValid.value }}
    </template>
  </VForm>
</template>
`

  expect(transform(input, 'file.vue', [v4FormSlotRefsPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <VForm>
        <template #default="data">
          {{ data.isValid }}
        </template>
      </VForm>
    </template>
    "
  `)
})
