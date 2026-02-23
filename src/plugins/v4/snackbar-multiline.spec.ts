import { expect, it } from 'vitest'
import { transform } from 'vue-metamorph'
import { v4SnackbarMultilinePlugin } from './snackbar-multiline'

it('replaces multi-line with min-height', () => {
  const input = `
  <template>
    <VSnackbar multi-line />
  </template>
`

  expect(transform(input, 'file.vue', [v4SnackbarMultilinePlugin]).code).toMatchInlineSnapshot(`
    "
      <template>
        <VSnackbar min-height="68" />
      </template>
    "
  `)
})
