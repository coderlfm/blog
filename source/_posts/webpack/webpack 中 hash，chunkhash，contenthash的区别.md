---
title: webpack 中 hash，chunkhash，contenthash的区别
date: 2021-03-16 22:32:54
toc: true
tags:
 - Webpack

categories:
 - Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 中 hash，chunkhash，contenthash的区别

<!-- more -->


+ `hash` 是项目级别的，当项目中任何一个文件修改后所有文件都会重新生成
+ `chunkhash` 会根据不同的入口文件，进行文件依赖解析再使用散列算法来生成一个 哈希值
+ `contenthash` 的粒度是文件级别的，只有修改的文件才会重新生成 哈希值，有利于缓存

## `hash` 
我们先使用 hash 来对我们的项目来进行打包

```js webpack.config.js
const { merge } = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");


module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
    mian: "./src/mian.js",
  },
  output: {
    // hash 
    filename: "[name].[hash:6]bundle.js",
    path: path.resolve("./build"),
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

``` js src/indec.js
console.log('hello index.js');
```

``` js src/mian.js
console.log('hello mian.js');
```
执行打包命令 

``` shell
yarn build
```

可以看到我们的两个入口文件的生成的 hash 值都是相同的
{% asset_img build-hash-1.png %}

1. 现在我们来简单修改一下 `src/idnex.js` 中的代码 
``` js src/index.js
console.log('hello index.js webpack');
```

2. 重新执行打包命令 

 ``` shell
yarn build
```

3. 可以看到，我们只修改了 `index.js` ，但是打包后的 `main.js` `hash` 值也被修改了，这就是 hash 的特性，它的粒度是项目级别的，只要项目中任意一个文件被修改，都会将重新生成所有文件
{% asset_img build-hash-2.png %}

<br/>

## `chunkhash` 
将 `hash` 修改为 `chunkhash`

``` js webpack.config.js 
...
  filename: "[name].[chunkhash:6].bundle.js",
...
```

执行打包命令 

 ``` shell
yarn build
```

可以看到我们的两个入口文件的生成的 `chunkhash` 值现在就不同了
{% asset_img build-chunkhash-1.png %}


1. 现在我们再来简单修改一下 `src/idnex.js` 中的代码 
``` js src/index.js
console.log('hello index.js webpack');
```

2. 重新执行打包命令 

 ``` shell
yarn build
```

3. 可以看到，这次它只给 index.js 重新生成了， `chunkhash` 会根据不同的入口根据依赖生成一个 32位的 `hash` 值，不属于这个入口的不会被重新生成
{% asset_img build-chunkhash-2.png %}
<br/>

## `contenthash` 
将 `chunkhash` 修改为 `contenthash`

``` js webpack.config.js 
...
  filename: "[name].[contenthash:6].bundle.js",
...
```

执行打包命令 

 ``` shell
yarn build
```

可以看到我们的两个入口文件的生成的 `contenthash` 值现在就不同了
{% asset_img build-contenthash-1.png %}


1. 现在我们再来简单修改一下 `src/idnex.js` 中的代码 
``` js src/index.js
console.log('hello index.js webpack');
```

2. 重新执行打包命令 

 ``` shell
yarn build
```

3. 可以看到，这次也只有 `index.js` 被重新生成
{% asset_img build-contenthash-2.png %}

4. 那我们再来试一下修改一下 `src/main.js` 中的代码 
``` js src/main.js
console.log('hello main.js webpack');
```

5. 重新执行打包命令 

 ``` shell
yarn build
```

6. 可以看到，这次也只重新生成了 `main.js` 被重新生成
{% asset_img build-contenthash-3.png %}

`contenthash`  的粒度是文件级别的，只有修改的文件才会重新生成 哈希值，有利于缓存，[这里](https://webpack.docschina.org/blog/2020-10-10-webpack-5-release/#real-content-hash) 有关于 `contenthash` 的更多说明
<br/>

## 最佳实践

+ `hash` 单入口项目
+ `chunkhash` 多入口项目 
+ `contenthash` 需要长期缓存，并且确定变化较小的
