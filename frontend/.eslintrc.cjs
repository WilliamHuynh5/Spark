module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-hooks', 'react-refresh'],
  rules: {
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { ignoreRestSiblings: true, argsIgnorePattern: '_' },
    ],
    '@typescript-eslint/no-implicit-any-catch': [
      'error',
      { allowExplicitAny: true },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    'react-refresh/only-export-components': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
