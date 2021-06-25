module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    // indent: ["error", 2],
    // semi: ["error", "always"],
    // quotes: ["error", "single", { avoidEscape: true, allowTemplateLiterals: true }],
    "react/prop-types": "off",
    "max-len": [
      "error",
      {
        code: 120,
        ignoreComments: true,
        ignoreUrls: true,
        //"ignore-pattern": "^import [^,]+ from |^export | implements"
      },
    ],
    "no-console": 1,
    "react/jsx-closing-bracket-location": [2, "tag-aligned"],
    eqeqeq: ["error", "always"],
    "keyword-spacing": ["error", { before: true, after: true }],
    "brace-style": ["error", "1tbs"],
  },
};
