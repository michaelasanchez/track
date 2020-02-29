const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');


var ENV = process.env.npm_lifecycle_event;
// var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {

  var config = {
    mode: isProd ? 'production' : 'development',
  };

  config.resolve = {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.tsx', '.ts', '.js']
  };

  // Enable sourcemaps for debugging webpack's output.
  if (!isProd)
    config.devtool = 'source-map';

  config.output = {
    //   // Absolute output directory
    //   path: __dirname + '/dist',

    //   // Output path from the view of the page
    //   // Uses webpack-dev-server in development
    //   publicPath: isProd ? '/neck/' : '/',

    //   // Filename for entry points
    //   // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    //   // Filename for non-entry points
    //   // Only adds hash in build mode
    //   chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  config.module = {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }, {
        test: /\.(scss|css)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('autoprefixer'),
                ]
              }
            }
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  };
  config.plugins = [
    new HtmlWebpackPlugin({
      template: './src/public/index.html',
      inject: 'body'
    }),
    new MiniCssExtractPlugin(),
    new webpack.LoaderOptionsPlugin({
      test: /\.scss$/i,
      options: {
        postcss: {
          plugins: [autoprefixer]
        }
      }
    }),
  ]

  config.devServer = {
    contentBase: path.join(__dirname, './dist/'),
    // // Serve index.html as the base
    // contentBase: resolveAppPath('public'),
    // // Enable compression
    // compress: true,
    // // Enable hot reloading
    // hot: true,
    // // Public path is root of content base
    publicPath: '/',
    port: 9000
  };

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // config.externals = {
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // };

  return config;
}();