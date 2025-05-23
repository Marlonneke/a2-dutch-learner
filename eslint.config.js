const pluginJs = require("@eslint/js");
const pluginReactConfig = require("eslint-plugin-react/configs/recommended");
const globals = require("globals"); // For Jest globals

module.exports = [
  // Main configuration for src files (excluding tests)
  {
    files: ["src/**/*.{js,jsx}"], // More specific to JS/JSX files
    ignores: ["src/**/*.css"],    // Explicitly ignore CSS files
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        Audio: "readonly",
        process: "readonly", 
        es2021: true,
      }
    },
    plugins: {
      react: require("eslint-plugin-react")
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off"
    }
  },
  // Configuration for test files
  {
    files: ["src/**/*.test.{js,jsx}", "src/setupTests.{js,jsx}"], // More specific
    ignores: ["src/**/*.css"], // Explicitly ignore CSS files in case tests are co-located
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.jest,
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        fetch: "readonly",
        Audio: "readonly",
        es2021: true,
      }
    },
    plugins: {
      react: require("eslint-plugin-react")
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReactConfig.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off"
    }
  }
];
