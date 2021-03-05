---
title: webpack 中的 optimization
date: 2021-03-04 18:24:00
toc: true
tags:
- Webpack

categories:
- Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 中可以通过对 optimization 配置来对我们项目进行一些优化

<!-- more -->

## 1.不单独生成注释信息
假设我们现在 webpack 配置文件如下

``` js webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode:'production',
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("./build"),
    chunkFilename: '[name].[hash:6].chunk.js'
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
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};

```

``` js src/index.js
import _ from 'lodash';

console.log(_.join(['hello','webpack5','index.js']));
```

现在我们运行打包命令，可以看到打包之后的代码现在是这样的，它除了帮我们打包 index.js 外，还帮我们生成了一个 index.bunle.js.LICENSE.txt，这个文件是一些许可证注释信息，

{% asset_img build-1.png %}

试想一下，当我们项目越来越大时，我们肯定是不希望它给我们生成一堆这样的注释文件的，那这个时候我们就可以在 optimization.minimizer 来进行配置

minimizer 可以配置很多个 [TerserPlugin](https://webpack.docschina.org/plugins/terser-webpack-plugin/) 插件实例 , 通过手动配置来覆盖默认的压缩工具

TerserPlugin 插件在 webpack5 中已经内置了，如果使用的 webpack5 以下的版本，则需要手动安装一下

重新修改 webpack 的配置文件
extractComments 是用来配置是否单独生成注释文，有关 `extractComments` 的更多配置，可以查看 [这里](https://webpack.docschina.org/plugins/terser-webpack-plugin/)

``` js webpack.config.js
const TerserPlugin = require("terser-webpack-plugin");

...
optimization: {
  minimizer: [ new TerserPlugin({ extractComments: false }) ],
}
...       
```

重新执行打包命令，可以看到以下目录，已经没有帮我们单独生成注释文件了
{% asset_img build-2.png %}


### 配置 模块id 生成的算法
不知道有没有朋友注意到，当我们使用 `@vue/cli` 来搭建我们的项目的时候，当我们把项目跑起来后，可以看到很多类似 `1.js` `2.js` `3.js` 这种文件，这种文件是怎么生成的呢
{% asset_img vue-product.png %}

<br/>
我们可以通过配置 optimization.chunkIds 来修改模块 id 生成的算法

|选项值	描述
'natural'	按使用顺序的数字 id。
'named'	对调试更友好的可读的 id。
'deterministic'	在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。
'size'	专注于让初始下载包大小更小的数字 id。
'total-size'	专注于让总下载包大小更小的数字 id。





