const path = require('path');
const pathToPhaser = path.join(__dirname, '/../node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.js');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../hbt-server/public/client'),
    filename: 'main.js',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' },
      { test: [ /\.vert$/, /\.frag$/ ], use: 'raw-loader' }
    ]
  },
  devServer: {
    contentBase: [path.join(__dirname, 'dist'), path.join(__dirname, 'static')],
    publicPath: '/dist/',
    host: '127.0.0.1',
    port: 8080,
    open: true
  },
  watchOptions: {
    ignored: /hbt-dmscreen/
  },
  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
    alias: {
      phaser: phaser,
    }
  }
};
