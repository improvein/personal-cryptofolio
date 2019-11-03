module.exports = {
  parser: 'babel-eslint',
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    fetch: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}],
    'react/forbid-prop-types': [
      1,
      {
        forbid: ['any', 'array'],
        checkContextTypes: false,
        checkChildContextTypes: false,
      },
    ],
  },
};
