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

  // loaders
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
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.(png|jpe?g|svg|ttf|eot|gif|woff)$/,
        loader: 'file-loader',
        options: {
          name: 'assets/[name].[ext]',
        }
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      }
    ]
  };

  // create a nice object from the env variable
  // const envKeys = Object.keys(process.env).reduce((prev, next) => {
  //   prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
  //   return prev;
  // }, {});

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

  config.optimization = {
    splitChunks: {
      chunks: 'all'
    }
  };

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