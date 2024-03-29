const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isDevelopment = process.env.NODE_ENV === 'development' // 判断是否是生产环境

module.exports = {
  outputDir: '../dist',
  publicPath: isDevelopment ? '/' : '/qiankun-vue3-tabsPage-demo',
  productionSourceMap: isDevelopment,
  lintOnSave: isDevelopment,
  devServer: {
    open: true,
    port: 7000,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  css: {

  },
  configureWebpack: {
    name: 'main',

    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': resolve('src') // 本项目
      }
    },
    plugins: []
  },
  chainWebpack: () => {}

}
