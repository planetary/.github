module.exports = {
  ignorePatterns: ['**/*/*.hbs', 'node_modules', '.next', 'out', 'build'],
  extends: ['next', 'prettier', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint', 'unused-imports', 'tailwindcss'],
      extends: [
        'plugin:tailwindcss/recommended',
        'plugin:prettier/recommended',
        'next/core-web-vitals'
      ],
      rules: {
        'no-warning-comments': 'off',
        'prettier/prettier': [
          'error',
          {
            singleQuote: true,
            endOfLine: 'auto'
          }
        ],
        'eol-last': 'off',
        'react/destructuring-assignment': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'react/require-default-props': 'off',
        'react/jsx-props-no-spreading': 'off',
        'react-hooks/exhaustive-deps': 'error',
        '@next/next/no-img-element': 'off',
        '@typescript-eslint/comma-dangle': 'off',
        '@typescript-eslint/consistent-type-imports': 'error',
        'import/prefer-default-export': 'off',
        'tailwindcss/classnames-order': [
          'error',
          {
            officialSorting: true
          }
        ],
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
          }
        ],
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_'
          }
        ],
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: [
              '**/*.stories.*',
              '**/.storybook/**/*.*',
              '**/*.test.ts',
              '**/*.test.tsx',
              '**/tests/**/*.*',
              '**/*.spec.ts',
              '**/*.spec.tsx'
            ],
            peerDependencies: true
          }
        ],
        semi: [
          'error',
          'never',
          {
            omitLastInOneLineBlock: true
          }
        ],
        quotes: [
          'error',
          'single',
          {
            avoidEscape: true
          }
        ],
        'react/jsx-curly-brace-presence': [
          'error',
          {
            props: 'never',
            children: 'never'
          }
        ],
        'import/order': [
          'error',
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'object',
              'type'
            ],
            'newlines-between': 'always'
          }
        ],
        'tailwindcss/no-custom-classname': 0,
        'react/no-unescaped-entities': 'warn'
      }
    }
  ]
}
