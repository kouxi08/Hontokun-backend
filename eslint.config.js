import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { ignores: ['node_modules', 'dist/**'] },
  { languageOptions: { globals: globals.browser } },
  {
    plugins: {
      import: importPlugin,
      prettier: eslintPluginPrettier,
    },
  },
  {
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      'import/extensions': [
        'error',
        'ignorePackages',
        { js: 'always', ts: 'always' },
      ],
      'prettier/prettier': 'error', // Prettierのルールを適用
    },
  },
  {
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // 解決可能な拡張子
        },
      },
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
