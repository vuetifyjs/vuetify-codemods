import type { CodemodPlugin } from 'vue-metamorph'

export const helloWorldCodemod: CodemodPlugin = {
  type: 'codemod',
  name: 'hello-world',
  transform ({ scriptASTs, utils: { traverseScriptAST, astHelpers } }) {
    let transformCount = 0

    for (const scriptAST of scriptASTs) {
      traverseScriptAST(scriptAST, {
        visitLiteral (path) {
          if (typeof path.node.value === 'string') {
            path.node.value = 'Hello, world!'
            transformCount++
          }

          this.traverse(path)
        },
      })

      // or, using the findAll helper
      for (const literal of astHelpers
        .findAll(scriptAST, { type: 'Literal' })) {
        if (typeof literal.value === 'string') {
          literal.value = 'Hello, world!'
          transformCount++
        }
      }
    }

    return transformCount
  },
}
