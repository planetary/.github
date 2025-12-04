module.exports = {
  ignorePatterns: ['node_modules', 'dist', 'build', 'out', '.next'],
  extends: ['next', 'prettier'],
  rules: {
    semi: ['error', 'never'],
    quotes: ['error', 'single', { avoidEscape: true }],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'react/no-unescaped-entities': 'off',
    '@next/next/no-html-link-for-pages': 'off'
  }
}
