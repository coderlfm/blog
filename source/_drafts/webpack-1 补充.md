---
title: webpack-1 补充
date: 2021-3-24 10:31:10
toc: true
---
webpack-1 补充

<!-- more -->

content 为 静态目录提供地址，并且会先读取 output 中的 path，再读取 dev 中的 contentPath
ouput.publicPath 可能会指向 cdn，比如七牛

writeToDisk 为写入硬盘
file-laoder 的配置选项 esModule: false 就可以不用使用 .default 来获取图片
url-loader 小于的话就转成 base64，大于的话交给 filte-loader
laoder：loader.raw = true ，得到的是 buffer，否则是一个 urf-8 字符串

html-loader 解决在 html 的 image 标签引入的地址

babel-laoder：提供一个过程管理过程 -> 调用 babel-core
babel-core：把源码转换成 抽象语法树，进行遍历生成
babel-preset-env：把 es6 语法树转成 es5 语法树

再把 es5 语法树转换成 es5 代码 -> 再次使用 babel-core 转换

配置装饰器插件

babel 预设 是多个 插件的集合，
polyfill，使用 第三方

它会根据浏览器的 请求头来动态下发不同的 polyfill，

`polyfill.io/v3` 网站有自己搭建私服的教程

polyfill.io/v3/polyfill.min.js

loader 属性

es-lint-loader 配置

enforce：'pre' 最先执行
options：fix：true，
exclude：/node_modules/
include：

.eslintrc
需要一个 解析器转换成抽象语法树

babel-eslint 来解析

配置不使用 console 等 relus

有时候配置 loader 报错时，把 use 换成 loader
项目根据 新建 .vscode 然后配置项目自动修复

## mode env NODE_ENV
mode 不传时 `production`
--mode='development' 设置 mode
--env='development' 只会影响函数的形参(env)
如果要通过 --env 来同时影响 js 中 process.env.NODE_ENV 的值，可以通过覆盖 mode 的值，或者 通过 DefinePlugin
"process.env.NODE_ENV":json.stringifr('develop')

webpack.config.js 中 获取的 process.env.NODE_ENV 为 node 中的进程对象，可以 通过 set NODE_ENV="develop",通过
cross-env NODE_ENV='development' 修改 node 的进程对象

js 文件中拿的 process.env.NODE_ENV 拿的是 mode 的值

runtime 是为了解决全局对象污染的问题
如果我们在开发一个库，我们使用了 array.prototype.title
如果我们的使用者也使用了同名 title 的话，name 就会污染全局变量

helper=true 提取类的继承 的一些方法单独提取出来

babel-runtime 适合库里面使用，不污染全局变量，但是打包体积比较大，相当于把房子重新拆了，重建
babel-polyfill 适合在项目中使用，相当于在房子是加一层

### eval 第一次会慢一点，但是后续会快一点，可以缓存

### sourceMapDevToolPlugin 可以替代 devtool

```js
new SourceMapDevToolPlugin({
  filename: "[file].map",
  append: "",
});
```

### filemanagerplugin

```js
new Filemanagerplugin({
  events: {
    onEnd: {
      copy: [
        {
          source: "./build/**/*.map",
          // 这样子自己访问线上的地址的时候，就可以先本地起一个服务，就可以映射到sourcemap了，或者单独配置一个 source的服务器 
          destination: "localhost:8081:/sourcemap/sdd.js.map",
        },
      ],
      delete: ["./dist/*.map"],
    },
  },
});
```

生成环境 设置hide-soucre 
然后调试的时候，右键 add source-map，本地起一个服务，然后填入本地 的地址，开始调试

cra 支持把代理 写在 package.json 中
before (app){
  app.get('/api/',(req, res, next)=>{

    // 配置路由
    res.json([]);
  })
}

如果已经有一个 express 服务器，想添加打包功能，可以使用 `webpack-dev-middleware`
