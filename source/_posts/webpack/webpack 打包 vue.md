---
title: webpack 打包 vue 文件
date: 2021-02-06 19:17:54
toc: true
tags:
- Webpack

categories:
- Webpack


cover: /cover-imgs/webpack.jpg

---
webpack 作为一个模块化打包工具，但是我们一些 `loader` 和 `plugin` 也可以打包 vue 文件

<!-- more -->
## 安装所需插件

``` shell shell
npm install -D vue-loader vue-template-compiler
```

## 修改 webpack.config.js 
``` js webpack.config.js 
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue?$/,
                use: [
                    'vue-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Vue App',
            template: './public/index.html',
        }),
        new DefinePlugin({
            'env': '"development"'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    globOptions: {
                        ignore: [
                            '**/index.html'
                        ]
                    }

                }
            ]
        }),
        new VueLoaderPlugin()
    ]
}
```

``` js src/main.js
import Vue from 'vue'
import App from './App.vue'

new Vue({
    render: h => h(App),
}).$mount('#root')
```

``` js src/App.vue
<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "hello vue",
    };
  },
};
</script>

<style >
</style>
```

 1. 目前我们项目目录如下
 {% asset_img home.png %}
 
 <br/>
 2. 执行打包命令，我们会发现 根目录下会出现 `build` 目录
 {% asset_img output1.png %}
 
 <br/>
 3. 打开 index.html 可以看到网页正常展示了
 {% asset_img html.png %}

但是这其实还不满足我们的基本开发，因为我们在实际开发中肯定是会写一样样式的
接下来我们在 `App.vue` 里面加一些样式代码，我们使用 `less` 作为 `css` 预处理器

```js src/App.vue
<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "hello vue",
    };
  },
};
</script>

<style lang="less">
h1{
    color: red;
}
</style>
```

重新执行打包命令
会发现报错了
 {% asset_img style_error.png %}

## 安装 less 所需插件
``` shell shell
npm install -D less less-loader css-loader style-loader
```

## 修改 webpack.config.js 
``` js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.vue?$/,
                use: [
                    'vue-loader'
                ]
            },
            {
                test:/\.less$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'less-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Vue App',
            template: './public/index.html',
        }),
        new DefinePlugin({
            'env': '"development"'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'public',
                    globOptions: {
                        ignore: [
                            '**/index.html'
                        ]
                    }

                }
            ]
        }),
        new VueLoaderPlugin()
    ]
}
```

重新打开 `build` 目录下的 `index.html`，可以看到我们的样式代码已经作用上去了
{% asset_img html2.png %}

有关 `webpack` 中编译 `vue` 文件的基本配置就到这了，
若要查询更多在 `webpack` 中 编译 `vue` 文件的配置，请查看 [Vue Loader](https://vue-loader.vuejs.org/zh/#vue-loader-%E6%98%AF%E4%BB%80%E4%B9%88%EF%BC%9F)