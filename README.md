<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://cdn.vuetifyjs.com/docs/images/one/logos/vuetify-logo-dark.png">
    <img alt="Vuetify Logo" src="https://cdn.vuetifyjs.com/docs/images/one/logos/vuetify-logo-light.png" height="100">
  </picture>
</div>

<p align="center">
  <a href="https://www.npmjs.com/package/vuetify-codemods"><img src="https://img.shields.io/npm/v/vuetify-codemods.svg" alt="npm version"></a>
  <a href="https://npm.chart.dev/vuetify-codemods"><img src="https://img.shields.io/npm/dm/vuetify-codemods?color=blue" alt="npm downloads"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT"></a>
  <a href="https://discord.gg/vuetify"><img src="https://img.shields.io/discord/1513968811047522396?logo=discord&logoColor=white&label=Discord&color=5865F2" alt="Discord"></a>
</p>

# Vuetify Codemods

A [vue-metamorph](https://github.com/UnrefinedBrain/vue-metamorph)-based tool to assist with Vuetify migrations.

## Usage

```shell
pnpx vuetify-codemods
yarn dlx vuetify-codemods
npx vuetify-codemods@latest
```

### Arguments

#### `--files <glob>`

Default: `**/src/**/*`

## Included rules

- [Combobox item slot](https://vuetifyjs.com/en/getting-started/upgrade-guide/#vselect-vcombobox-vautocomplete)
- [Elevation](https://vuetifyjs.com/en/getting-started/upgrade-guide/#elevation)
- [Form slot refs](https://vuetifyjs.com/en/getting-started/upgrade-guide/#vform)
- [Grid](https://vuetifyjs.com/en/getting-started/upgrade-guide/#grid-system-vrow-and-vcol)
- [Snackbar multi-line](https://vuetifyjs.com/en/getting-started/upgrade-guide/#vsnackbar)
- [SnackbarQueue default slot](https://vuetifyjs.com/en/getting-started/upgrade-guide/#vsnackbarqueue)
- [Typography](https://vuetifyjs.com/en/getting-started/upgrade-guide/#typography)
