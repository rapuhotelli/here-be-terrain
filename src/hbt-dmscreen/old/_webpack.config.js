const path = require('path');

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, '../hbt-server/public/client'),
    filename: 'dm.js',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader', exclude: '/node_modules/' },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  }
};
