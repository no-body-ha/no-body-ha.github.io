const { util } = require("webpack");

const cdn = {
  // 通过cdn方式使用
  // js: [
  //   'https://cdn.jsdelivr.net/combine/npm/vue@2.6.11,npm/vuex@3.6.2,npm/axios@0.21.1,npm/vue-router@3.5.1'
  // ],
};

const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  devServer: {
    port: 8080,
    open: true,
    hot: true,//自动保存
    disableHostCheck: true,
    // history模式下的url会请求到服务器端，但是服务器端并没有这一个资源文件，就会返回404，所以需要配置这一项
    historyApiFallback: {
      index: '/index.html' //与output的publicPath
    },
    publicPath: '/',
    proxy: {
      '/v1': {
        target: "http://localhost:3000/v1",
        changeOrigin: true,
        pathRewrite: {
          '^/v1': ''
        }
      },
    },
  },
  configureWebpack: (config) => {
    // config.externals = {
    //   vue: 'Vue',
    //   vuex: 'Vuex',
    //   'vue-router': 'VueRouter',
    //   axios: 'axios',
    //   moment: 'moment',
    //   'ant-design-vue': 'antd'
    // }
  },
  chainWebpack: config => {
    // 移除prefetch插件，避免加载多余的资源
    config.plugins.delete('prefetch')
    // 移除 preload 插件，避免加载多余的资源
    config.plugins.delete('preload');
    // // 配置cdn引入
    // config.plugin('html').tap((args) => {
    //   args[0].cdn = cdn;
    //   return args;
    // });
    // svg配置
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/images/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/images/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  publicPath: process.env.VUE_APP_BASE_URL, //测试、线上域名信息配置
  assetsDir: "./assets",
  outputDir: './dist',//打包输出路径
  indexPath: 'index.html',//打包输出首页文件名字
  css: {
  },
}
