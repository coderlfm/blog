---
title: Webpack 中 plugin 的使用
date: 2021-01-26 22:20:54
toc: true
tags:
- Webpack

categories:
- Webpack

cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/webpack.jpg

---

[plugin](https://webpack.docschina.org/plugins/) 是 Webpack 中比较重要的一个概念，插件 可以帮我做一些更广泛的操作，来实现 loader 不能实现的事情

<!-- more -->

我们来简单使用一些 plugin ，其它 `plugin` 使用方式大同小异

## [clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin) 插件的使用 
该插件会在我们每次打包前将我们打包目录先做一次删除

```js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```

## [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 插件的使用 
`html-webpack-plugin` 会帮我们自动在出口生成一个html文件，并引入出口js

```js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
    ]
}
```

### [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 插件 自定义配置的使用 
某些时候插件的默认行为可能不满足我们的个性化配置，比如我们现在想自定义自己个模板，让 插件根据我们的定义的模板生成到出口目录

<article class="message is-primary">
  <div class="message-body">
    在这之前，我们需要了解在 webpack 中，当我们需要给 plugin 配置一些参数的时候，需要在 new 插件时，传入一个对象进去，这个对象也被我们称为 options ，插件会根据传入的参数来修改一些行为
  </div>
</article>


```js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'my App',
            template: './public/index.html'
        }),
    ]
}
```
以上我们配置了默认模板以及网站标题，但是但我们打开网页的时候会发现标题并没有改成我们配置的，
原因是我们没有在html 里面使用我们配置的 标题，

```html public/index.html
<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><%= htmlWebpackPlugin.options.title %></title>
</head>

<body>
</body>

</html>
```



## [DefinePlugin](https://www.webpackjs.com/plugins/define-plugin/) 插件的使用
`DefinePlugin` 是 `webpack` 的内置插件，需要从 `webapck` 中导出使用， `webpack` 还有很多 [内置插件](https://www.webpackjs.com/plugins/)
该插件可以定义一些全局变量来供我们在开发中使用
``` js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin(),
        new DefinePlugin({
            'env': '"development"'
        })
    ]
}
```
<article class="message is-warning">
  <div class="message-body">
    注意，因为这个插件直接执行文本替换，给定的值必须包含字符串本身内的实际引号。通常，有两种方式来达到这个效果，使用 '"development"', 或者使用 JSON.stringify('development')。
  </div>
</article>

## [copy-webpack-pulugin](https://www.webpackjs.com/plugins/copy-webpack-plugin/) 的使用
`copy-webpack-pulugin` 可以帮我们将一些文件复制到 `webpack` 打包的出口目录，例如在 `vue` 或者 `react` 的脚手架下的 `public` 目录下的文件会被原封不动的复制到项目的出口

如果我们有些文件是不想被复制， 列如 `public` 下的 `index.html`，我们是不希望它也被复制过去， 可以在 `globOptions` 的 `ignore` 中配置忽略文件

```js webpack.config.js
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { DefinePlugin } = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'my App',
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
        })
    ]
}

```