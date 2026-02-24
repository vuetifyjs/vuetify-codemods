import type { Plugin } from 'vue-metamorph'
import { v4ComboboxItemSlotPlugin } from './combobox-item-slot'
import { v4ElevationPlugin } from './elevation'
import { v4SnackbarMultilinePlugin } from './snackbar-multiline'
import { v4SnackbarQueueSlotPlugin } from './snackbar-queue-slot'

export function vuetify4 (): Plugin[] {
  return [
    v4ComboboxItemSlotPlugin,
    v4ElevationPlugin,
    v4SnackbarMultilinePlugin,
    v4SnackbarQueueSlotPlugin,
  ]
}
