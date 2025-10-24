/* eslint-disable no-undef */
const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const path = require('path');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.extends('expo'),
  {
    ignores: ['dist/*', 'archive/*', 'node_modules/*', 'nativewind-env.d.ts', 'rootStore.example.ts'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'import/first': 'off',
    },
  },
];
