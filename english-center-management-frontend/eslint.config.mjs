import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Apply Next.js recommended rules first
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Override or add custom rules here
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Turn off explicit 'any' rule if needed
      '@typescript-eslint/no-explicit-any': 'off',

      // Hoặc chuyển nó thành warning
      // "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
