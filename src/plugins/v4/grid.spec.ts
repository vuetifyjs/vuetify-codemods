import { describe, expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4GridPlugin } from './grid'

describe('VRow', () => {
  describe('dense', () => {
    it('converts dense to density="compact"', () => {
      const input = `
<template>
  <v-row dense />
  <v-row dense><v-col /></v-row>
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row density="compact" />
        <v-row density="compact"><v-col /></v-row>
      </template>
      "
    `)
    })

    it('leaves :dense binding untouched', () => {
      const input = `
<template>
  <v-row :dense="condition" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row :dense="condition" />
      </template>
      "
    `)
    })
  })

  describe('alignment props', () => {
    it('converts align, justify, align-content to utility classes', () => {
      const input = `
<template>
  <v-row align="center" justify="space-between" />
  <v-row align-content="start" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row class="align-center justify-space-between" />
        <v-row class="align-content-start" />
      </template>
      "
    `)
    })

    it('converts responsive breakpoint variants', () => {
      const input = `
<template>
  <v-row align-sm="start" align-md="center" justify-lg="end" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row class="align-sm-start align-md-center justify-lg-end" />
      </template>
      "
    `)
    })

    it('appends to an existing class attribute', () => {
      const input = `
<template>
  <v-row class="ma-4" align="center" justify="end" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row class="ma-4 align-center justify-end" />
      </template>
      "
    `)
    })

    it('leaves dynamic align/justify bindings untouched', () => {
      const input = `
<template>
  <v-row :align="direction" :justify="condition ? 'start' : 'end'" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row :align="direction" :justify="condition ? 'start' : 'end'" />
      </template>
      "
    `)
    })

    it('does not transform align/justify on non-VRow elements', () => {
      const input = `
<template>
  <v-container align="center" />
  <div justify="end" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-container align="center" />
        <div justify="end" />
      </template>
      "
    `)
    })
  })

  describe('combined', () => {
    it('handles dense + alignment props together', () => {
      const input = `
<template>
  <v-row dense align="center" justify-md="end" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row class="align-center justify-md-end" density="compact" />
      </template>
      "
    `)
    })

    it('leaves unrelated props untouched', () => {
      const input = `
<template>
  <v-row no-gutters tag="section" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-row no-gutters tag="section" />
      </template>
      "
    `)
    })
  })
})

describe('VCol', () => {
  describe('order', () => {
    it('converts order prop to utility class', () => {
      const input = `
<template>
  <v-col order="2" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col class="order-2" />
      </template>
      "
    `)
    })

    it('converts responsive order props', () => {
      const input = `
<template>
  <v-col order="2" order-md="1" order-lg="3" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col class="order-2 order-md-1 order-lg-3" />
      </template>
      "
    `)
    })

    it('leaves dynamic order binding untouched', () => {
      const input = `
<template>
  <v-col :order="condition ? 1 : 2" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col :order="condition ? 1 : 2" />
      </template>
      "
    `)
    })
  })

  describe('align-self', () => {
    it('converts align-self prop to utility class', () => {
      const input = `
<template>
  <v-col align-self="center" />
  <v-col align-self="start" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col class="align-self-center" />
        <v-col class="align-self-start" />
      </template>
      "
    `)
    })

    it('leaves dynamic align-self binding untouched', () => {
      const input = `
<template>
  <v-col :align-self="alignment" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col :align-self="alignment" />
      </template>
      "
    `)
    })
  })

  describe('combined', () => {
    it('combines order and align-self into a single class attribute', () => {
      const input = `
<template>
  <v-col order="3" align-self="end" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col class="order-3 align-self-end" />
      </template>
      "
    `)
    })

    it('appends to an existing class attribute', () => {
      const input = `
<template>
  <v-col class="pa-2" order="1" align-self="center" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col class="pa-2 order-1 align-self-center" />
      </template>
      "
    `)
    })

    it('leaves span/offset props untouched', () => {
      const input = `
<template>
  <v-col cols="6" sm="4" offset="2" offset-md="1" />
</template>
`
      expect(transform(input, 'file.vue', [v4GridPlugin]).code).toMatchInlineSnapshot(`
      "
      <template>
        <v-col cols="6" sm="4" offset="2" offset-md="1" />
      </template>
      "
    `)
    })
  })
})
