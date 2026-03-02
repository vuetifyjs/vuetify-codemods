import { execSync } from 'node:child_process'
import process from 'node:process'
import { checkbox, confirm } from '@inquirer/prompts'
import { createVueMetamorphCli } from 'vue-metamorph'
import { vuetify4 } from './plugins/v4'

try {
  try {
    execSync('git diff --quiet', { stdio: 'ignore' })
  } catch {
    const cont = await confirm({
      message: 'Unstaged changes detected, do you want to continue?',
    })
    if (!cont) process.exit()
  }

  const choices = await checkbox({
    message: 'Select codemods to apply',
    required: true,
    choices: [
      {
        value: 'vuetify-4-combobox-item-slot',
        name: 'Combobox item slot',
        description: 'https://vuetifyjs.com/en/getting-started/upgrade-guide/#vselect-vcombobox-vautocomplete',
        checked: true,
      },
      {
        value: 'vuetify-4-elevation',
        name: 'Elevation',
        description: 'https://vuetifyjs.com/en/getting-started/upgrade-guide/#elevation',
        checked: true,
      },
      {
        value: 'vuetify-4-form-slot-refs',
        name: 'Form slot refs',
        description: 'https://vuetifyjs.com/en/getting-started/upgrade-guide/#vform',
        checked: true,
      },
      {
        value: 'vuetify-4-snackbar-multiline',
        name: 'Snackbar multi-line',
        description: 'https://vuetifyjs.com/en/getting-started/upgrade-guide/#vsnackbar',
        checked: true,
      },
      {
        value: 'vuetify-4-snackbar-queue-slot',
        name: 'SnackbarQueue default slot',
        description: 'https://vuetifyjs.com/en/getting-started/upgrade-guide/#vsnackbarqueue',
        checked: true,
      },
      {
        value: 'vuetify-4-typography',
        name: 'Typography',
        description: 'https://vuetifyjs.com/en/getting-started/upgrade-guide/#typography',
        checked: true,
      },
    ],
  })

  const cli = createVueMetamorphCli({
    plugins: [
      vuetify4(),
    ].flat().filter(plugin => {
      return choices.includes(plugin.name)
    }),
  })

  process.on('SIGQUIT', cli.abort)
  process.on('SIGTERM', cli.abort)
  process.on('SIGINT', cli.abort)

  await cli.run()
} catch (error) {
  if (!(error instanceof Error && error.name === 'ExitPromptError')) {
    throw error
  }
}
