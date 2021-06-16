const path = require('path');

module.exports = {
  // mode: 'development',
  entry: {
    app: './src/app/app.js',
    loginsignup: './src/loginsignup/loginsignup.js',
  },
  output: {
    filename: '[name]/[name].js',
    path: path.resolve(__dirname, 'public/'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
};
