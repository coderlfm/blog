---
title: webpack 中 dll 的使用
date: 2021-03-16 23:08:54
toc: true
tags:
 - Webpack

categories:
 - Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 中 dll 的使用

<!-- more -->

## 打包成 dll 包 
比如我们需要将 `react` 和 `react-dom` 使用 `dll` 打包   

``` js webpack.config.js
const { merge } = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DllPlugin } = require("webpack");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    react: ['react','react-dom']
  },
  output: {
    filename: "[name].[contenthash:6]bundle.js",
    path: path.resolve("./dll"),
    
    // 当我们打包成一个库话，通常我们会会配置 library
    library:'dll_[name]'
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
      // 使用 webpack 中自带的插件来打包 dll
      new DllPlugin({
        name: "dll_[name]",
        path: path.resolve(__dirname, "../dll/[name].manifest.json"),
      }),
  ],
};
```

执行打包命令 

``` shell
yarn build
```

可以看到以下文件，我们的打包就完成了

{% asset_img build-dll.png %}

## 使用打包后的 dll 文件

``` js webpack.config.js
const { merge } = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DllReferencePlugin } = require("webpack");
const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].[contenthash:6]bundle.js",
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
      new HtmlWebpackPlugin({
        template: "./public/index.html",
      }),
      new DllReferencePlugin({
        // tontext 为配置根据 mainfest的上下文提供路径
        context: path.resolve(__dirname, "../"),
        manifest: path.resolve(__dirname, "../dll/react.manifest.json"),
      }),
      new AddAssetHtmlPlugin({
        // 添加静态资源到 html 文件
        filepath: path.resolve(__dirname, "../dll/react.e68e01.bundle.js"),
      }),
  ],
};
```

``` js src/index.js
import React, { useState, } from 'react';
import ReactDom from 'react-dom';

export default function App() {

    const [message, setMessage] = useState('hello react17')

    return (
        <div>
            {message}
        </div>
    )
}

ReactDom.render(<App />, document.getElementById('root'));
```


执行打包命令 

``` shell
yarn build
```
<br/>


可以看到以下文件，我们的 `index` 被打包了，同时 `dll` 目录下我们刚刚已经通过 `dll` 打包后的 `react` 也被复制过来了

{% asset_img build-dll-2.png %}
<br/>
<br/>

我们打开可以看到我们刚刚在 `index.js` 编写代码可以正常运行了
{% asset_img hello-react.png %}
