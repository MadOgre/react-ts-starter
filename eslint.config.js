import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,mjs,cjs,ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "@stylistic": stylistic },
    rules: {
      "@stylistic/quotes": ["error", "double", { avoidEscape: true }],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/semi": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "prefer-destructuring": ["error", { object: true, array: false }],
      // Arrow functions wherever possible.
      "func-style": ["error", "expression"],
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      // Named exports only, so barrels have a single name for each export.
      "no-restricted-syntax": [
        "error",
        { selector: "ExportDefaultDeclaration", message: "Use a named export." },
        { selector: "ExportSpecifier[exported.name='default']", message: "Use a named export." },
      ],
    },
  },
  {
    // Plain JS files (this config) aren't in any tsconfig, so skip type-aware rules for them.
    files: ["**/*.{js,mjs,cjs}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // Tool config files run in Node and may use default exports.
    files: ["**/*.config.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
    rules: { "no-restricted-syntax": "off" },
  },
]);
