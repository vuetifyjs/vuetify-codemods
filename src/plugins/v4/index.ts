import type { Plugin } from 'vue-metamorph'
import { v4ComboboxItemSlotPlugin } from './combobox-item-slot'
import { v4ElevationPlugin } from './elevation'
import { v4FormSlotRefsPlugin } from './form-slot-refs'
import { v4GridPlugin } from './grid'
import { v4SnackbarMultilinePlugin } from './snackbar-multiline'
import { v4SnackbarQueueSlotPlugin } from './snackbar-queue-slot'
import { v4TypographyPlugin } from './typography'

export function vuetify4 (): Plugin[] {
  return [
    v4ComboboxItemSlotPlugin,
    v4ElevationPlugin,
    v4FormSlotRefsPlugin,
    v4GridPlugin,
    v4SnackbarMultilinePlugin,
    v4SnackbarQueueSlotPlugin,
    v4TypographyPlugin,
  ]
}
