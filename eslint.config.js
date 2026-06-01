import js from '@eslint/js'
import json from '@eslint/json'
import css from '@eslint/css'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier/flat'

export default defineConfig([
  globalIgnores([
    "dist",
    "node_modules",
    "package-lock.json",
    "dev-dist",
    "eslint.config.js",
    "vite.config.js",
    "stylelintrc.json",
  ]),
  {
    files: ['**/*.{js,jsx}'],
    plugins: { "js": js },
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      eslintConfigPrettier
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'no-use-before-define': ['warn'],
      'no-console': ["error", { allow: ["warn", "error"] }], // Allow for warnings and errors in console as part of debugging
    },
  },
  {
    files: ["**/*.json"],
    plugins: { "json": json},
    language: "json/json",
    extends: [json.configs.recommended, eslintConfigPrettier],
  },
  {
    files: ["**/*.css"],
    plugins: { "css": css },
    language: "css/css",
    extends: [css.configs.recommended, eslintConfigPrettier],
    rules: {
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
      "css/use-baseline": ["warn", { available: "newly" }],
    },
  },
])
