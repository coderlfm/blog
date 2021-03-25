---
title: webpack5 入门
date: 2021-01-19 14:10:54
toc: true
tags:
- Webpack

categories:
- Webpack


cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/webpack.jpg

---

几个月前webpack发布了webpack5，相对webpack 4有一些改变

首先我们要了解一些webpack 的基本概念，webpack 是一款现代JavaScript 应用程序的 静态模块化打包工具,其实 webpack 最主要是处理我们js中的模块关系依赖，

<!-- more -->

webpack 默认会将 `src/index.js` 的文件作为[入口](https://www.webpackjs.com/concepts/#%E5%85%A5%E5%8F%A3-entry-)， `dist/index.js` 作为出口，但是某些情况下我们的入口文件可能不是index.js， 或者出口的文件夹不想为dist，这个时候就需要修改webpack 默认的入口和出口了
## 指定入口，出口

### [通过命令行的方式来指定](https://www.webpackjs.com/api/cli/#%E8%BE%93%E5%87%BA%E9%85%8D%E7%BD%AE)

```shell shell
webpack --entry ./src/main.js -o ./build
```
配置输出有多种配置，该例子是其中一种配置，
以上配置会在将入口指定为 `src/main.js`， 出口目录指定为 `build` 目录

如果还想指定出口的文件名，可通过 `--output-filename`，来指定出口文件名

#### 示例用法
```shell shell
webpack --entry ./src/main.js -o ./build --output-filename bundle.js
```
执行该命令后就会发现在build目录出现了名为 bundle.js的出口文件了

<br/>

### [通过配置文件的方式来指定](https://www.webpackjs.com/api/cli/#%E8%BE%93%E5%87%BA%E9%85%8D%E7%BD%AE)
>我们会发现，当我们要自定义webpack的入口和出口的时候要在命令会输入一长串的命令，当我们的配置更多的时候该刚会很低效，所以在实际开发中，我们用的比较多的是采用配置文件的方式来对webpack进行一些个性化的配置

我们首先来对刚刚的配置转换到配置文件的方式

webpack 会默认将项目根目录下的webpack.config.js 作为webpack的配置，
```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename:'bundle.js'
    }
}

```
output 中的path 必须是一个绝对路径

<br/>

## 指定配置文件

某些情况下我们的配置文件可能名字不是 webpack.config.js 或者配置文件在一个文件夹中，这一点使用过vue2 cli或者Taro cli开发过项目的同学应该了解

<br/>

#### 示例用法1, 命令行指定配置文件
``` shell shell
webpack --config config.js
```

#### 示例用法2, `package.json` 指定配置文件
``` json package.json
"scripts": {
    "build": "webpack  --config config.js"
}
```
