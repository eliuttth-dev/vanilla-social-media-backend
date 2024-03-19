module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  rules: {
    // Indentation
    indent: ["error", 2],
    "no-mixed-spaces-and-tabs": "error",

    // Variables
    "no-unused-vars": "warn",
    "no-shadow": "error",

    // Functions
    "no-use-before-define": "error",
    "arrow-spacing": ["error", { before: true, after: true }],

    // String
    quotes: ["warn", "double"],

    // Control Flow
    curly: "error",
    "no-else-return": "error",

    // ES6 Features
    "prefer-const": "error",
    "prefer-template": "warn",

    // Errors and Code Quality
    "no-console": "error",
    "no-alert": "error",
    "no-debugger": "error",

    // Spacing and Formating
    semi: ["warn", "always"],
    "comma-spacing": "error",
    "brace-style": ["error", "1tbs"],

    // Imports and Modules
    "import/order": "error",
    "import/no-duplicates": "error",

    // Typescript
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "error",
  },
};
