export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: { ecmaVersion: "latest", sourceType: "module", parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { semi: ["error", "always"], quotes: ["error", "single"], "no-unused-vars": "off" }
  }
];
