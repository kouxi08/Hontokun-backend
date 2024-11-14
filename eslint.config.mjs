import baseConfig from '@hono/eslint-config';

export default [
  ...baseConfig,
  {
    rules: {
      semi: ['error', 'always'],
    },
  },
];
