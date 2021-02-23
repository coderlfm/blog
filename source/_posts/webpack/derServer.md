---
title: Webpack derServer
date: 2021-02-23 16:05:54
toc: true
tags:
- Webpack

categories:
- Webpack

cover: /cover-imgs/webpack.jpg

---
derServer 可以帮助我们在本地起一个服务器来更便捷的帮助我们开发

<!-- more -->
前言
    在我们开发 Vue 或者 React 项目时，当我们修改完某一行代码时，我们的项目无需重启浏览器便会自动刷新，为我们加载最新的代码
通常，这些功能都是脚手架帮我们完成的，如果我们需要自己也搭建一个这样的服务，就需要借助 `webpack-dev-server`，在某些地方也被简称为 `WDS`;

## 安装 devServer


``` shell
npm i webpack-dev-server
```
## 基本使用

1. 在 webpack.config.js 中配置 devServer 
``` js webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./build'),
    },
    mode: 'development',
    devServer: {
        hot: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
    ]
}
```

2. package.json 中新增脚本
``` json package.json
  "scripts": {
    "serve": "webpack serve",
  },
```

3. 运行以下命令 
``` shell
npm run serve
```

 测试代码
 ``` js src/main.js
console.log('hello webpack');
```

4. 控制台即可看到我们的输出结果
{% asset_img hello_webpack.png %}
<br/>
<br/>

 此时，我们修改一下输出内容@pmmmwh/react-refresh-webpack-plugin
 ``` js src/main.js
console.log('hello webpack5');
```

 之后我们切换到浏览器，无需手动刷新，浏览器会自动加载我们刚刚修改后的代码
 {% asset_img hello_webpack5.png %}


> derServer 会帮我们把编译解析后的内容存在内存中，所以加载的时候很快

## 进阶使用

### 配置 `Vue` 模块热替换
如果我们不借助脚手架，也想在编写 vue 代码时可以模块热替换的话，我们可以借助 `vue-loader`, `vue-loader`默认已经帮我们开启了热重载

#### 安装所需插件
``` shell
npm i vue vue-loader vue-template-compiler
```

``` js src/vueApp.vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: "hello vue",
      style:'hello wordle'
    };
  },
};
</script>

<style>
</style>
```

``` js src/main.js 
import Vue from 'vue';
import VueApp from './vueApp.vue';

new Vue({
    render: h => h(VueApp)
}).$mount('#app');
```

配置 `webpack.config.js` 
``` js webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./build'),
    },
    mode: 'development',
    devServer: {
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.vue$/i,
                use: 'vue-loader'
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new VueLoaderPlugin(),
    ]
}
```

重新执行以下命令 
``` shell
npm run serve
```

既可在页面中看到以下内容
{% asset_img hello_vue.png %}

此时，我们修改一下文件内容
``` js src/vueApp.vue
<template>
  <div>{{ message }}</div>
</template>

<script>
export default {
  data() {
    return {
      message: "hello vue3",
      style:'hello wordle'
    };
  },
};
</script>

<style>
</style>
```

既可看到浏览器页面已经变成以下内容
{% asset_img hello_vue3.png %}

### 配置 `React` 模块热替换
`React` 配置起来相对麻烦一些，需要借助以下两个插件
+ `react-refresh`
+ `@pmmmwh/react-refresh-webpack-plugin`

#### 安装所需插件
``` shell shell
npm i react react-dom react-refresh @pmmmwh/react-refresh-webpack-plugin @babel/core @babel/preset-env @babel/preset-react
```

``` jsx src/reactApp.jsx
import React, { useState } from 'react';

export default function App() {

    const [message, setMessage] = useState('hello react')

    return (
        <div>
            {message}
        </div>
    )
}
```

``` js src/main.js
import React from 'react';
import ReactDom from 'react-dom'
import ReactApp from './reactApp.jsx'

ReactDom.render(<ReactApp />, document.getElementById('root'));
```

``` js webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./build'),
    },
    mode: 'development',
    devServer: {
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/i,
                use: 'babel-loader'
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html'
        }),
        new ReactRefreshPlugin(),
    ]
}
```

``` js babel.config.js
module.exports = {
    presets: [
        ['@babel/preset-env'],
        ['@babel/preset-react']
    ],
    plugins: [
        ['react-refresh/babel']
    ]
}
```

运行以下命令
``` shell shell
npm run serve
```

打开浏览器既可看到以下内容
{% asset_img hello_react.png %}

此时，我们修改一下文件内容
``` jsx src/reactApp.jsx
import React, { useState } from 'react';

export default function App() {

    const [message, setMessage] = useState('hello react17')

    return (
        <div>
            {message}
        </div>
    )
}
```

既可看到以下内容
{% asset_img hello_react17.png %}

