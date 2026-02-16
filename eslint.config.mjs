import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import next from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': next,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...next.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off',
      'no-undef': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        FormData: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
      },
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/jest.setup.ts', '**/jest.polyfill.tsx', '**/jest.config.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-constant-binary-expression': 'off',
    },
  },
  {
    files: ['public/sw.js'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
    languageOptions: {
      globals: {
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        clients: 'readonly',
        ExtendableEvent: 'readonly',
        FetchEvent: 'readonly',
        InstallEvent: 'readonly',
        ActivateEvent: 'readonly',
      },
    },
  },
  {
    files: ['.agents/**/*.js', '.agents/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'coverage/**',
    ],
  },
];
