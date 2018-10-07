module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  rules: {
    'linebreak style': 0,
    'react/destructuring-assignment': 'never',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/prefer-stateless-function': 0,
    'react/prop-types': 0,
  },
  globals: {
    fetch: true,
  },
};
