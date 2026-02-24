import { expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4TypographyPlugin } from './typography'

it('', () => {
  const input = `
<template>
  <div class="text-h1" />
  <div :class="'text-h1'" />
  <div :class="a ? 'text-h1' : 'bar'" />
  <div :class="a && 'text-h1'" />
  <div :class="['text-h1']" />
  <div :class="{ ['text-h1']: true }" />
  <div :class="{ 'text-h1': true }" />
</template>
`

  expect(transform(input, 'file.vue', [v4TypographyPlugin]).code).toMatchInlineSnapshot(`
    "
    <template>
      <div class="text-display-large" />
      <div :class="'text-display-large'" />
      <div :class="a ? 'text-display-large' : 'bar'" />
      <div :class="a && 'text-display-large'" />
      <div :class="['text-display-large']" />
      <div :class="{ ['text-display-large']: true }" />
      <div :class="{ 'text-display-large': true }" />
    </template>
    "
  `)
})
