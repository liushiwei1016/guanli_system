module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        'css': '@/assets/css',
        'img': '@/assets/img',
        'js': '@/assets/js',
        'content': '@/components/content',
        'common': '@/components/common',
        'views': '@/views',
        'network': '@/network'
      }
    }
  },
  //通过 chainWebpack 自定义打包人口
  chainWebpack: config => {
    //发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')
      /** 通过 externals 加载外部 CDN 资源(1、在main-prod.js中删除对象插件的css。2、在 public/index.html中 CDN 引入对应的css和js文件)**/
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        'vue-quill-editor': 'VueQuillEditor'
      })
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    //开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
  }
};
