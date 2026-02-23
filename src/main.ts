import process from 'node:process'
import { createVueMetamorphCli } from 'vue-metamorph'

import { vuetify4 } from './plugins/v4'

const cli = createVueMetamorphCli({
  plugins: [
    vuetify4(),
  ],
})

process.on('SIGQUIT', cli.abort)
process.on('SIGTERM', cli.abort)
process.on('SIGINT', cli.abort)

cli.run()
