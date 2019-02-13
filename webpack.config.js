const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: ['babel-polyfill'].concat(['./src/index.js']),
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react'],
          plugins: [
            'transform-class-properties',
            'react-hot-loader/babel',
            'transform-object-rest-spread',
          ],
        },
      },
      {
        test: /\.font\.(js|json)$/,
        loader: "style!css!fontgen"
      },
      {
        test: /\.(glsl|vs|fs)$/,
        loader: 'shader-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.sass$/i,
        exclude: /node_modules/,
        use: ['css-hot-loader'].concat([MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ]),
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        use: [
          {
            // loader: 'url-loader'
            loader: 'file-loader',
            options: {
              name: './images/[name].[ext]',
              publicPath: '../',
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader',
        options: {
          outputPath: 'fonts/',
          name: '[name].[ext]',
          publicPath: '../fonts',
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/main.css',
      publicPath: '/',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 3001,
    hot: true,
    contentBase: './src/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.png', 'json'],
  },
};
