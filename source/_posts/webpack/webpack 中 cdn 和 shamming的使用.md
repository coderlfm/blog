---
title: webpack 中 CDN 的使用
date: 2021-03-15 11:09:54
toc: true
tags:
  - Webpack

categories:
  - Webpack

cover: /cover-imgs/webpack.jpg
---

## webpack 中 cdn 的使用

<!-- more -->

## cdn 的使用
如果我们项目在打包后，生成的文件会很大的话，我们可以通过 CDN 的方式来优化我们打包压缩后的代码，
使我们在项目中使用的一些第三方库不打包到源代码中，使用 CDN 的方式来引入

```js webpack.config.js
const { merge } = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

// 当配置文件为导出一个函数时，动态传入不同的模式需要在 package.json中 使用 --env 来设置
module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("./build"),
    chunkFilename: "[name].[hash:6].chunk.js",
  },
  externals: {
    // 属性名是 引入的包名称，属性值是 全局变量
    loadsh: "_",
    dayjs: "dayjs",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```
<br/>

``` js src/index.js
import _ from 'lodash';
import dayjs from 'dayjs';

console.log(_.join(['hello','webpack5','main.js']));

console.log("当前时间：", dayjs().format());
```
<br/>

``` html public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="app"></div>
    <div id="root"></div>

    <!-- 判断生产环境使用 cdn 的方式引入 -->
    <% if (process.env.NODE_ENV === 'production') { %>
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.3/dayjs.min.js"></script>
    <% } %>
</body>
</html>
```

重新打包
``` shell shell
yarn build
```
<br/>

可以看到生成以下两个文件，没有将 lodash 和 dayjs 单独打包
{% asset_img build-1.png %}

<br/>
<br/>


js 文件也没有将 lodash 和 dayjs 打包进去
``` js build/index.bundle.js
(()=>{"use strict";var e={n:o=>{var r=o&&o.__esModule?()=>o.default:()=>o;return e.d(r,{a:r}),r},d:(o,r)=>{for(var a in r)e.o(r,a)&&!e.o(o,a)&&Object.defineProperty(o,a,{enumerable:!0,get:r[a]})},o:(e,o)=>Object.prototype.hasOwnProperty.call(e,o)};const o=_;var r=e.n(o);const a=dayjs;var n=e.n(a);console.log(r().join(["hello","webpack5","main.js"])),console.log("当前时间：",n()().format())})();
```


可以看到 `build` 目录下的 `index.html` 为以下内容即配置成功
``` html build/index.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Document</title>
    <script defer="defer" src="1.vendor.js"></script>
    <script defer="defer" src="index.bundle.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <div id="root"></div>
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.20/lodash.min.js"></script>
    <script src="https://cdn.bootcdn.net/ajax/libs/dayjs/1.10.3/dayjs.min.js"></script>
  </body>
</html>

```
<br/>


打开该文件可以看到我们项目可以正常运行
{% asset_img run.png %}

## shimming 的使用
如果我们在项目中 使用了一些第三方库，而这些第三方库又使用了一些其它库，由于某些原因，这个库没有直接对其它库有依赖，或者在 `package.json` 中没有填写对该库的依赖，那我们就需要给这些库打一些补丁，告诉这些库，当在项目运行中使用某些对象出现 undefined 的时候，按照我们配置的方式来寻找对应的库，这个方式就叫做 `shamming`


而要使用 `shimming` 我们就需要使用一个插件 `ProvidePlugin`, `webpack` 给我们内置了这个插件 

配置使用

```js webpack.config.js
const { merge } = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const { ProvidePlugin } = require("webpack");

// 当配置文件为导出一个函数时，动态传入不同的模式需要在 package.json中 使用 --env 来设置
module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("./build"),
    chunkFilename: "[name].[hash:6].chunk.js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        use: "babel-loader",
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    // 使用 webpack 中的 ProvidePlugin 内置插件来给我们使用的一些第三方插件做一些补丁
    new ProvidePlugin({
      _ : 'lodash',
      dayjs : 'dayjs',
    }),
  ],
};
```
<br/>

``` js src/index.js

// TODO: 未引入 lodash , 但是我们使用 shimming 做补丁来保障代码能正常运行
console.log(_.join(['hello','webpack5','main.js']));

console.log("当前时间：", dayjs().format());

```

重新执行打包命令
会看到生成以下文件，我们没有引入任何第三方库，但是帮我打包出了一个 `434.vendor.js`
{% asset_img build-2.png %}

打开该文件可以看到我们项目可以正常运行
{% asset_img run-2.png %}

> 注意：webpack不太推荐我们使用 `shimming` 在实际开发中我们也应该尽量减少使用，尽量使用一些比较可靠的一些第三方库
