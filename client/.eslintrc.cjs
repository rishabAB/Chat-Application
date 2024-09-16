module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "airbnb", 
    "airbnb/hooks",
    "plugin:prettier/recommended"
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],

}
