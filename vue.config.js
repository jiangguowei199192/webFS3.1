// 让打包的时候输出可配置的文件
const webpack = require('webpack')
const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
const GenerateAssetPlugin = require('generate-asset-webpack-plugin')
const createServerConfig = function (compilation) {
  // const cfgJson = { baseUrl: 'http://172.16.63.148:8850', mqttServer: '172.16.63.148', mqttPort: 2883, headImg: 'http://172.16.63.148', projectTitle: '武汉市公安局安保防控系统' }
  const cfgJson = {
    projectTitle: '天地一体化预警侦查系统',
    baseUrlList: [
      {
        // 消防外网
        // baseUrl: 'http://58.49.169.235:50020',
        // mqttServer: '58.49.169.235',
        // mqttPort: 50022,
        // headImg: 'http://58.49.169.235:50026'

        // 消防v2.0开发环境
        baseUrl: 'http://111.47.13.103:40025',
        // baseUrl: 'http://172.16.63.49:8850', // 良良本机地址，联调用
        mqttServer: '111.47.13.103',
        mqttPort: 40027,
        headImg: 'http://111.47.13.103:40031'
        // headImg: 'http://122.112.203.178' // 图标请求头临时

        // v3.0开发环境
        // baseUrl: 'http://112.74.104.62:8850',
        // mqttServer: '112.74.104.62',
        // mqttPort: 2883,
        // headImg: 'http://112.74.104.62:81'
      }
      // 消防内网
      // {
      //   baseUrl: 'http://172.1.53.131:50020',
      //   mqttServer: '172.1.53.131',
      //   mqttPort: 50022,
      //   headImg: 'http://172.1.53.131:80'
      // }
    ]
  }
  return JSON.stringify(cfgJson)
}
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 这里只列一部分，具体配置惨考文档啊
module.exports = {
  publicPath: '/webFs/',
  outputDir: 'webFs', // 在npm run build时 生成文件的目录 type:string, default:'dist'
  /*
    构建多页面模式的应用程序.每个“页面”都应该有一个相应的JavaScript条目文件。该值应该是一
    个对象，其中键是条目的名称，而该值要么是指定其条目、模板和文件名的对象，要么是指定其条目
    的字符串，
    注意：请保证pages里配置的路径和文件名 在你的文档目录都存在 否则启动服务会报错的
  */
  // pages: {
  // index: {
  // entry for the page
  // entry: 'src/index/main.js',
  // the source template
  // template: 'public/index.html',
  // output as dist/index.html
  // filename: 'index.html'
  // },
  // when using the entry-only string format,
  // template is inferred to be `public/subpage.html`
  // and falls back to `public/index.html` if not found.
  // Output filename is inferred to be `subpage.html`.
  // subpage: 'src/subpage/main.js'
  // },

  //   lintOnSave：{ type:Boolean default:true } 问你是否使用eslint
  lintOnSave: true,
  // productionSourceMap：{ type:Bollean,default:true } 生产源映射
  // 如果您不需要生产时的源映射，那么将此设置为false可以加速生产构建
  productionSourceMap: false,
  // devServer:{type:Object} 3个属性host,port,https
  // 它支持webPack-dev-server的所有选项

  devServer: {
    port: 8080, // 端口号
    host: 'localhost', // localhost
    https: false, // https:{type:Boolean}
    open: true, // 配置自动启动浏览器
    proxy: {
      '/index': {
        target: 'http://172.16.63.158:22222',
        ws: true,
        changeOrigin: true
      }
    } // 配置多个代理
  },
  configureWebpack: {
    plugins: [
      // 让打包的时候输入可配置的文件
      new GenerateAssetPlugin({
        filename: 'serverconfig.json',
        fn: (compilation, cb) => {
          cb(null, createServerConfig(compilation))
        },
        extraFiles: []
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'windows.jQuery': 'jquery'
      }),
      new CopyWebpackPlugin(
        {
          patterns: [
            {
              from: path.resolve(__dirname, './WEB-INF'),
              to: 'WEB-INF'
            }
          ]
        }
      )
    ]
  }
}
