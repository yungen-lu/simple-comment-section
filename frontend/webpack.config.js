const path = require('path');
const { DefinePlugin } = require('webpack');
DOMAIN = process.env.APP_DOMAIN || 'localhost'
PORT = process.env.APP_PORT || '4000'
URL = process.env.APP_URL || 'graphql'

let WS_URI
let HTTP_URI
if (process.env.NODE_ENV === 'production') {
  WS_URI = "wss://" + DOMAIN + "/" + URL;
  HTTP_URI = "https://" + DOMAIN + "/" + URL;
}else {
  WS_URI = "ws://" + DOMAIN + ":" + PORT + "/" + URL;
  HTTP_URI = "http://" + DOMAIN + ":" + PORT + "/" + URL;
}
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
      APP_WS_URI: JSON.stringify(WS_URI),
      APP_HTTP_URI: JSON.stringify(HTTP_URI)
    }),
  ],
};
