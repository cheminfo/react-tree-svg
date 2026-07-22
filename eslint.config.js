import { defineConfig, globalIgnores } from 'eslint/config';
import react from 'eslint-config-cheminfo-react';
import typescript from 'eslint-config-cheminfo-typescript';

export default defineConfig(
  globalIgnores(['coverage', 'lib', 'dist']),
  typescript,
  react,
  {
    rules: {
      '@typescript-eslint/restrict-plus-operands': 'off',
    },
  },
);
