const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    signin: './src/signin/signin.js',
    login: './src/login/login.js',
    app: './src/app/app.js'
  },
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(__dirname, 'public/'),
  },
};
