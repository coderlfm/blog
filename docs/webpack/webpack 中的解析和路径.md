---
title: webpack 中的解析和路径
date: 2021-03-01 14:14:54
toc: true
tags:
- Webpack

categories:
- Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 中对于引入文件的解析顺序及路径的处理

<!-- more -->

## 配置别名
有时候我们项目目录比较深的时候，会出现很多 `../../` 这种路径，可读性比较差，这个时候我们就可以通过配置路径别名的方式来简化我们的操作
alias 可以配置 路径别名，当我们配置以下 `@` 后，我们就可以通过 `@` 

``` js webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve("./build"),

    // 当我们项目部署在非根目录时， 可以配置成 / 目录名 /  或者  ./
    // 表示从当前目录加载文件
    // publicPath: '/lfm/'
  },
  mode: "development",

  // 开发服务配置
  devServer: {

    // 配置路径
    // publicPath: '/lfm/',

  },

  // 解析
  resolve: {
    // 尝试按照以下文件扩展名来解析文件，导入文件时可以不加文件扩展名
    // 配置后将会覆盖 webpack 默认的配置数组
    extensions: [".wasm", ".mjs", ".js", ".json", ".vue", ".jsx", ".tsx"],

    // 配置路径别名
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: "vue-loader",
      },
      {
        test: /\.jsx?$/i,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new VueLoaderPlugin(),
    new ReactRefreshPlugin(),
  ],
};

```

## 配置 extensions
尝试按照以下文件扩展名来解析文件，导入文件时可以不加文件扩展名
配置后将会覆盖 webpack 默认的配置数组

``` js webpack.config.js
  resolve: {
    extensions: [".wasm", ".mjs", ".js", ".json", ".vue", ".jsx", ".tsx"],
  },
```
<br/>
<br/>

## 路径相关
有时候我们会把项目部署在非服务器根目录，默认我们在没有做一些配置的时候，打开我们的页面会请求不到资源的因为默认我们打包后引入的方式如下

默认会到项目根目录下请求，所以我们是请求不到资源的


``` html index.html 
<script defer src="bundle.js"></script>
```

解决方式有以下两种
+ 运维在 `nginx` 配置
+ 前端项目打包后 手动修改修改打包后的 `index.html` 中引入静态资源的地址 
+ 前端在项目 `webpack` 的配置文件中配置 

如果公司没有没有运维或者后端不会配置的话，那就可以让前端来做一些修改
这个时候我们就可以通过配置 `webpack` 来做一些修改


`webpack.config.js` 中 `output` 中可以配置 `publicPath` ，该 `publicPath` 会在我们项目打包后引入静态资源的时候作为前缀来加入，如果是生产环境，`publicPath` 也可能会指向 `cdn`，比如七牛

例如我们已有一个项目为 `www.baidu.com`, 我们想在已有的项目下再部署一个项目，类似于 `www.baidu.com/temp/` 的目录，这种情况，我们的项目默认是请求不到资源的，因为我们请求的地址会类似如下

``` html index.html 
<script defer src="a.js"></script>
<script defer src="b.js"></script>
<script defer src="c.js"></script>
```

那我们的解决方案可以将 output 中的 publicPath 来修改为以下两个值
+ `/temp/`
+ `./`


``` js webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.resolve("./build"),
    chunkFilename: '[name].[hash:6].chunk.js'

    // 当我们项目部署在非根目录时， 可以配置成 / 目录名 /  或者  ./
    // 表示从当前目录加载文件
    publicPath: '/temp/'
  },
  mode: "development",

  // 开发服务配置
  devServer: {
    // 热更新
    hot: true,

    hotOnly: true,

    // 配置路径
    // publicPath: '/lfm/',

  },

  module: {
    rules: [
      {
        test: /\.vue$/i,
        use: "vue-loader",
      },
      {
        test: /\.jsx?$/i,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new VueLoaderPlugin(),
    new ReactRefreshPlugin(),
  ],
};

```

重新执行打包命令后，我们生成的引入文件如下，这样的话引入就可以正常引入了

``` html index.html 
<script defer src="/temp/bundle.js"></script>
```
<br/>

## filename 和 chunkFilename 的区别
+ `filename` 入口文件的名称
+  `chunkFilename` chunk 文件的名称
  - 通过 `splitChunks` 分割
  - `import()` 导入


<!-- <article class="message is-warning">
  <div class="message-body">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam, et dictum <a>felis venenatis</a> efficitur. Aenean ac <em>eleifend lacus</em>, in mollis lectus. Donec sodales, arcu et sollicitudin porttitor, tortor urna tempor ligula, id porttitor mi magna a neque. Donec dui urna, vehicula et sem eget, facilisis sodales sem.
  </div>
</article> -->



