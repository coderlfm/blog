---
title: webpack 配置分离和代码分离
date: 2021-03-01 19:10:54
toc: true
tags:
- Webpack

categories:
- Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 中对不同环境的配置分离和 多入口时对于引入相同模块时打包处理

<!-- more -->

## 1. 配置分离
原本我们的配置文件都在项目根目录下，如果我们在实际开发中其实是想要做到开发环境和生产环境的配置做一个分离的，这样有利于我们对不同环境来做不同的配置，例如我们在开发环境需要使用 模块热替换，但是在生产环境，我们是不需要的，这种时候就可以做配置分离

### 1.1 安装所需插件
``` bash 
npm i webpack-merge
```

### 1.2 分离配置
在项目根目录下新建 `config` 目录 并且在中新建以下三个文件
  + `webpack.common.js` 项目基本配置
  + `webpack.dev.js`    开发环境配置
  + `webpack.prod.js`   生产环境配置

最终生成的目录结构类似如下
{% asset_img config.png %}

### 1.3 修改 `package.json` 脚本

在 scripts 中 修改成以下

``` json package.json
  "scripts": {
    "build": "webpack --config ./config/webpack.common.js --env production",
    "serve": "webpack serve --config ./config/webpack.common.js --env devlopment"
  }
```

通过 --env 来传入参数时，可以将配置文件写成一个函数 rerurn 配置对象，传入的参数会作为函数的参数注入进去
<br/>

``` js webpack.common.js
const { merge } = require('webpack-merge');
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

const devlopmentConfig = require('./webpack.dev')();
const productmentConfig = require('./webpack.prod')();


// 当配置文件为导出一个函数时，动态传入不同的模式需要在 package.json中 使用 --env 来设置
module.exports = (env) =>{
       
    const mode = env.production ? 'production' : 'devlopment';
    
    let commonConfig = {
        // 此处需要注意该路径是基于 package.json 的路径
        mode,
        entry: "./src/main.js",
        output: {
          filename: "bundle.js",
          path: path.resolve("./build"),
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

        ],
    };

    if(!env.production){
        finalConfig = merge(commonConfig, devlopmentConfig);
    }else{
        finalConfig = merge(commonConfig, productmentConfig);
    }
    
    return finalConfig
}
```

``` js webpack.dev.js
const ReactRefreshPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = () => {
    return {
      mode: "development",
      devServer: {
        hot: true,
        hotOnly: true,
        open: true,
        compress: true,
        watchContentBase: true,
      },
      plugins: [
        new ReactRefreshPlugin(),
      ],
  }
}
```

``` js webpack.prod.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = () => {

    return {
      plugins:[
        new CleanWebpackPlugin(),

      ],
      mode: "production",
  }
}
```

这样配置完后我们就可以根据不同的环境来对我们的项目做不同的处理了

## 2. 代码分离
webpack 中代码分离是比较引人注目的点，如果我项目多个入口文件都依赖相同的一些第三方库，我们可以把这个库做一个抽离

### 2.1 入口起点配置
比如我们项目有两个入口文件 index.js 和 main.js 两个文件都对 jquery 有依赖，那我们就可以把 jquery 单独打成一个包，
 
修改 webpack.common.js 配置，因为我们配置是开发环境和生产环境都需要的，所有我们在 webpack.common.js 中修改 entry 

通过 depenOn 来配置我们需要依赖的库

``` js webpack.common.js
entry: {
  main: { import : "./src/main.js", dependOn: 'jquery' },
  index: { import : "./src/index.js", dependOn: 'jquery' },
  jquery: 'jquery',
},
```
当我们像如上一个网页使用多个入口文件的时候还需要配置 `optimization.runtimeChunk : 'single'`，不然可能会遇到一个对象在我们的项目中实例化多次，这个问题在 [这里](https://bundlers.tooling.report/code-splitting/multi-entry/) 有详细说明，在多数情况下我们是不希望这样的事情发生的。

``` js webpack.common.js
optimization: {
  runtimeChunk: 'single',
}
```

重新执行打包命令，会看到我们生成的 `build` 目录结构会是如下，可以看到 `jquery` 已经被单独打成一个包
{% asset_img build-1.png %}

### 2.1 多依赖文件
比如我们刚刚两个入口文件现在又同时依赖了 `lodash` ，那么这个时候我们可以把它写成一个数组

``` js webpack.common.js
entry: {
  main: { import : "./src/main.js", dependOn: 'shared' },
  index: { import : "./src/index.js", dependOn: 'shared' },
  shared: ['jquery', 'lodash']
}
```
重新执行打包命令，会看到我们生成的 `build` 目录结构会是如下，可以看到 `jquery` 和 `lodash` 都被单独打成了一个包
{% asset_img build-2.png %}























