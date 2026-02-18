import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import prettierConfig from "eslint-config-prettier";

export default [
  {
    ignores: ["dist", "node_modules"]
  },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "react-refresh": reactRefreshPlugin
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-no-target-blank": ["error", { enforceDynamicLinks: "always" }],
      "react-refresh/only-export-components": "warn",
      camelcase: ["error", { properties: "never", ignoreDestructuring: false }],
      "id-match": [
        "error",
        "^[a-z][a-zA-Z0-9]*$|^[A-Z][a-zA-Z0-9]*$|^[A-Z][A-Z0-9_]*$|^_[a-zA-Z0-9]+$|^_$",
        {
          onlyDeclarations: false,
          properties: false
        }
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }]
    }
  },
  prettierConfig
];
