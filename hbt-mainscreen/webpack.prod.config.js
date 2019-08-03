const path = require('path');
const pathToPhaser = path.join(__dirname, '/../node_modules/phaser/');
const phaser = path.join(pathToPhaser, 'dist/phaser.js');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, '../hbt-server/public/client'),
    filename: 'main.dist.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' },
      { test: [ /\.vert$/, /\.frag$/ ], use: 'raw-loader' }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'CANVAS_RENDERER': JSON.stringify(true),
      'WEBGL_RENDERER': JSON.stringify(true)
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser
    }
  }
};
