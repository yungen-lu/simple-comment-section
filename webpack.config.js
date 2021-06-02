const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    home: './src/home/home.js',
    app: './src/app/app.js'
  },
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(__dirname, 'public/'),
  },
};
