var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    // 'eventsource-polyfill',
    'webpack-hot-middleware/client',
    './demo/container',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
      test: /\.js$/,
      loaders: ['babel'],
      },
      {
        test: /\.css/,
        loader: 'style!css',
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url',
      },
    ],

  },
};
