module.exports = {
  root: true,
  extends: ['react-app'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn', // Downgrade to warning from error
    'no-unused-vars': 'warn'              // Downgrade to warning from error
  },
  env: {
    browser: true,
    node: true,
    es6: true
  }
};
