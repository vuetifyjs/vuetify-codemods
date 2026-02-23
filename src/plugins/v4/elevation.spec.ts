import { expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4ElevationPlugin } from './elevation'

it('updates elevation values', () => {
  const input = `
<template>
  <VAlert elevation="5" />
  <div class="elevation-23" />
  <VMenu content-class="bg-surface elevation-16" />
</template>
`

  expect(transform(input, 'file.vue', [v4ElevationPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <VAlert elevation="2" />
      <div class="elevation-5" />
      <VMenu content-class="bg-surface elevation-4" />
    </template>
    "
  `)
})
