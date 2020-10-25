const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PrettierPlugin = require('prettier-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { DefinePlugin } = require('webpack');

module.exports = {
  mode: 'production', // helps make output files readable for devs
  entry: {
    app: './src/index.js',
    modules: './src/modules.js',
  },
  devtool: 'inline-source-map', // makes it easier to track down errors and warnings
  devServer: {
    contentBase: './dist', // live reload
  },
  plugins: [
    new DefinePlugin({
      'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
    }),
    new PrettierPlugin(), // run first
    new ESLintPlugin(), // run second
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }), // we don't want to remove the index.html file after the incremental build triggered by watch
    new HtmlWebpackPlugin({
      title: 'Weather App',
      favicon: './src/images/icon.svg',
      template: './assets/index.html',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: [
          'file-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
};
