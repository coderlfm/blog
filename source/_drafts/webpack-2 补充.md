---
title: webpack-2 补充
date: 2021-3-24 10:31:10
toc: true
---
webpack-2 补充

<!-- more -->

webpack 没有 bundle 这个概念
只有 assets 概念，静态资源，可以把它俩理解为相同的

## devServe
proxy 代理，

devServer 中
不会启动新的 服务器，而是给原来的 8080 端口新建了一个路由
before(app){
  app.get('/')

}


在 package.json 配置 proxy，这种写法是 cra 的写法，会读取 package.json，但是这种不是哦通用的写法，cre 会读取 package.json 中的 `proxy`


### webpack-dev-middleware

webpack 
+ webpack-dev-server 从零开始搭建
+ webpack-dev-middleware 如果有有 exporess，就可以使用这个 middleware 


const compiler = webpack(webpackOptions)

返回一个中间件
app.use(WebpackDevMiddleware(compiler, {}))
app.lister(9000)

### mini-css-extract-plugin 单独提取 css 文件

mini-css-extract-plugin.loader

用它替换掉 style-loader ，生成环境动态判断

new mini-css-extract-plugin({
  filename: '[name].css'
})

webpack 在打包后所有的产出的资源 放在一个 assets 对象上，然后加载里面的资源

一个入口可能会对应多个代码块
一个代码块可能对应多个文件 chunk

## output 中的 name 的区别

+ filename ：入口代码块中的名称配置项,
配置成对象就是 ` ` 的key，
配置成字符串就是 `mian`
+ chunkFilename：非入口代码块名称
 + 代码分割
 + 懒加载 import()


## 配置 单独生成图片

url-loader 
{
  esModule: false,
  // 方式一
  // name:'iamges/[hash:10].[ext]',
  outputPath : 'iamges',

  // 方式二，推荐
  // 需要加上该配置项，可以让 css 文件中引入的图片前缀为该前缀，需要写绝对路径
  publickPath : '/iamges',
}

## 配置单独生成 css 

minnicss 的插件 file 'css/'

## 配置css 和 js 压缩
caniuse 

postcss
优先级
package.json
postcssrc
postcss.json .yaml .yal .js .cjs

opt 根据 production 来动态 true，false


### sideEffects 的 tree shaking 很强大，
没有使用的值直接被删除, 但是需要配置 css 文件有副作用

## purgecss-webpack-plugin
移出无用的css

## html 压缩
Htmlwebpackplugin 
{
  minify: {
    collapaseWhitespace: true,

  }
}

## rem

index.html 动态计算 屏幕宽度 750 /10 ,
document.documentElement
addlister resize 重新调用 计算 根元素的字体大小

px2rem 把px 转成 rem
lib-flexible 动态计算根元素 fontSize 值

path 模块的 path.basename('./src/main.js ','.js') // 不获取 .js 后缀

## 多入口文件 同时多html 文件
 
 <!-- { 静态图片 -->
使用时 ` ...htmlwebpackplugins`

chunkHash 只会读模块id 引入 page1.js + page2.js 

+ hash 单入口
+ chunkhash 多入口 
+ contenthash 需要长期缓存，并且确定变化较小的

### merge 
比我们 简单的 {...common, ...devCfig} 的合并的更细一些

例如 module.rules 会被合并掉


## 环境变量
新建 .env 文件
``` .env
NODE_ENV=product
```

安装 `dotenv` 插件
安装文档获取.env 的值
