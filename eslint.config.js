import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'harness/dist/**'] },
  ...tsPlugin.configs['flat/recommended'],
  {
    files: ['src/**/*.ts', 'tests/**/*.ts', 'harness/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
];
