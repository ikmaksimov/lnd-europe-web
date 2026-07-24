import next from 'eslint-config-next';

/**
 * Flat config. eslint-config-next@16 ships a native flat-config array
 * (core-web-vitals + typescript rules), so we spread it directly.
 */
const eslintConfig = [
  ...next,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
];

export default eslintConfig;
