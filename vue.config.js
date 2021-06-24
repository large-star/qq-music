const px2rem = require('postcss-px2rem')

const postcss = px2rem({
  remUnit: 37.5  //基准大小 baseSize，需要和rem.js中相同
})

module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          postcss
        ]
      }
    }
  },
  // devServer: {
  //   // proxy 设置代理的配置项
  //   proxy: {
  //     '/api': {
  //       // 目标服务器地址，也就是接口服务器的真实地址
  //       // target: 'http://localhost:3000',
  //       // target: 'https://autumnfish.cn/',
  //       target: 'https://netease-cloud-music-api-ten-mauve.vercel.app/',
  //       // 跨域时一般都设置该值 为 true
  //       changeOrigin: true, // 开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
  //       ws: true,
  //       // 重写接口路由
  //       pathRewrite: {
  //         '^/api': '' // 这样处理后，最终得到的接口路径为： http://localhost:3000/xxx
  //       }
  //     }
  //   }
  // }
}