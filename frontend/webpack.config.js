const path = require('path');
const { DefinePlugin } = require('webpack');

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
  plugins: [
    new DefinePlugin({
      DOMAIN: JSON.stringify(process.env.APP_DOMAIN) || JSON.stringify('localhost'),
      PORT: JSON.stringify(process.env.APP_PORT) || JSON.stringify('4000'),
      URL: JSON.stringify(process.env.APP_URL) || JSON.stringify('graphql'),
    }),
  ],
};
