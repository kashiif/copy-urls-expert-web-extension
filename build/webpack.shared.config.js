var webpack = require('webpack'),
  path = require('path'),
  fileSystem = require('fs'),
  env = require('../config'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  WriteFilePlugin = require('write-file-webpack-plugin'),
  CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const DIR_SRC = path.join(path.resolve(__dirname, '..'), 'src');

function createConfig() {
// load the secrets
  const alias = {};

  const secretsPath = path.join(__dirname, ('secrets.' + env.NODE_ENV + '.js'));

  if (fileSystem.existsSync(secretsPath)) {
    alias['secrets'] = secretsPath;
  }


  const options = {
    target: 'web',
    entry: {
      'views/options/options': path.join(DIR_SRC, 'views', 'options', 'options.js'),
      'views/popup/popup': path.join(DIR_SRC, 'views', 'popup', 'popup.js'),
      background: path.join(DIR_SRC, 'scripts', 'background.js')
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
            extractCSS: true
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
      vue: 'Vue',
    },
    plugins: [
      // expose and write the allowed env vars on the compiled bundle
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV)
      }),
      new HtmlWebpackPlugin({
        template: path.join(DIR_SRC, 'views', 'popup', 'popup.html'),
        filename: 'views/popup/popup.html',
        chunks: ['views/popup/popup'],
      }),
      new HtmlWebpackPlugin({
        template: path.join(DIR_SRC, 'views', 'options', 'options.html'),
        filename: 'views/options/options.html',
        chunks: ['views/options/options'],
      }),
      new WriteFilePlugin(),
      new ExtractTextPlugin('[name].css'),
      new CopyWebpackPlugin([
        {
          context: 'src',
          from: 'button/**.*'
        }, {
          context: 'src',
          from: 'manifest.json',
          transform: function (content, path) {
            // TODO: This should be customized for firefox and chrome
            return content;
          }
        }, {
          context: 'node_modules/vue/dist',
          from: 'vue.runtime.min.js',
          to: 'vendor'
        },
      ])
    ]
  };

  if (env.NODE_ENV === 'development') {
    // options.devtool = 'cheap-module-eval-source-map';
  }

  return options;
}

module.exports = {
  createConfig,
};
