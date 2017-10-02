var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs'),
  env = require('../config'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');


// load the secrets
var alias = {};

var secretsPath = path.join(__dirname, ('secrets.' + env.NODE_ENV + '.js'));

if (fileSystem.existsSync(secretsPath)) {
  alias['secrets'] = secretsPath;
}

const DIR_SRC = path.join(path.resolve(__dirname, '..'), 'src');

var options = {
  target: 'web',
  entry: {
    options: path.join(DIR_SRC, 'views', 'options', 'options.js'),
    popup: path.join(DIR_SRC, 'views', 'popup', 'popup.js'),
    background: path.join(DIR_SRC, 'scripts', 'background.js')
  },
  output: {
    path: path.join(path.dirname(__dirname), 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          },
          extractCSS: true,
          optimizeSSR: false,
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  resolve: {
    alias: Object.assign({}, alias, {
      cuesrc$: DIR_SRC
    }),
    extensions: ['.js', '.vue']
  },
  externals : {
    vue : {
      commonjs: 'Vue',
      amd: 'Vue',
      root: 'Vue' // indicates global variable
    },
  },
  plugins: [
    // expose and write the allowed env vars on the compiled bundle
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
    }),
    new HtmlWebpackPlugin({
      template: path.join(DIR_SRC, 'views', 'popup', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new HtmlWebpackPlugin({
      template: path.join(DIR_SRC, 'views', 'options', 'options.html'),
      filename: 'options.html',
      chunks: ['options']
    }),
    new WriteFilePlugin(),
    new ExtractTextPlugin('[name].css'),
    new CopyWebpackPlugin([
      { context: 'src', from: 'button/**.*' },
      { context: 'node_modules/vue/dist', from: 'vue.runtime.min.js', to: 'vendor' },
    ]),
  ]
};

if (env.NODE_ENV === 'development') {
  // options.devtool = 'cheap-module-eval-source-map';
}

module.exports = options;
