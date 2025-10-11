module.exports = {
  extends: ["expo", "prettier"],
  plugins: ["prettier"],
  ignorePatterns: ["/dist/*", "rootStore.example.ts", "nativewind-env.d.ts"],
  rules: {
    "prettier/prettier": "error",
    "import/first": "off",
  },
};
