const vitest = require("eslint-plugin-vitest");

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:react-hooks/recommended",
    "plugin:testing-library/react",
    "plugin:vitest/recommended",
    'plugin:testing-library/dom',
    "plugin:jest-dom/recommended",
    'plugin:@typescript-eslint/recommended'
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  settings: { react: { version: "18.2" } },
  plugins: ["react-refresh" , "testing-library" , "vitest", "jest-dom"],
  rules: {
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "no-unused-vars": "warn", // warning, not error
    "vitest/expect-expect": "off", // distracting red squiggles while writing tests
    "react/prop-types": "off", // turn off props validation
    'testing-library/await-async-queries': 'error',
		'testing-library/no-await-sync-queries': 'error',
		'testing-library/no-debugging-utils': 'warn',
    'testing-library/no-dom-import': 'off',
    
  },
  globals: {
    ...vitest.environments.env.globals,
  },
};
