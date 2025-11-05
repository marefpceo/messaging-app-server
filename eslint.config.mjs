import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  defineConfig([
    {
      files: ['**/*.{js,mjs,cjs}'],
      plugins: { js, eslintConfigPrettier },
      extends: ['js/recommended', 'prettier'],
      overrides: [
        {
          files: ['tests/**/*'],
          env: {
            jest: true,
          },
        },
      ],
    },
    { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
    {
      files: ['**/*.{js,mjs,cjs}'],
      languageOptions: { globals: globals.node },
    },
  ]),
  eslintConfigPrettier,
];
