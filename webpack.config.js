const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js',
  },
  /**
   * 1040+ 快应用sdk支持es6, npm包不做转换, 快应用层默认会做转换。
   * babel处理之后, 引入库的项目将变大7kb左右
   * module: {
      rules: [
        { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
      ]
    },
   */
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'fetch.js',
    libraryTarget: 'commonjs2',
  },
  externals: ['@system.fetch'],
  plugins: [
    new CleanWebpackPlugin(),
  ],
}
