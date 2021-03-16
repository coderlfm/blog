---
title: Webpack 中loader的使用
date: 2021-01-21 14:11:54
toc: true
tags:
- Webpack

categories:
- Webpack

cover: /cover-imgs/webpack.jpg

---

[leader](https://www.webpackjs.com/concepts/#loader) 是 Webpack 中比较重要的一个概念，webpack 默认只能处理 `js` 和 `json` 文件，对于一些其它的文件(例如`.css` 文件)，webpack 默认是不支持的，这个时候，我们可能需要使用一些合适的 `loader` 来对这些文件进行处理

<!-- more -->


## loader 的基本使用

loader需要配置在 `module` 对象中的 `rules` 中，`rules` 是一个数组，数组中是一个个对象， 配置 loader 需要有两个必须的属性
+ `test` 用于匹配需要处理的文件
+ `use` 配置需要使用的 loader

<article class="message is-info">
  <div class="message-header">
    <p>use 是一个数组，在 use 中配置 loader 有两种写法</p>
  </div>
  <div class="message-body">
    <p>1. 字符串，直接写 loader 名</p>
    <p>2. 对象，对象中 loader 属性为 需要配置的 loader 名，options 为该 loader 可配置的 option，当不需要配置 options 的时候可以直接以字符串的方式简写</p>
  </div>
</article>


示例使用
```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'css-loader',
                ]
            }
        ]
    }
}
```
以上是loader的基本使用，示例了 `css-loader` 的使用，按照上述配置后，当我们在代码中引入了 `.css` 文件时，会发现我们的样式并没有生效，是因为 `css-loader` 只会帮我解析 `.css` 文件的引用，但是没有帮我把这些 `css` 添加到网页中

这时候我们需要使用 `style-loader` 来帮我们做这些操作
<br/>

## style-loader 的使用

`style-loader` 会帮我创建一个 `style` 标签，并帮我们把样式注入进去 

```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            }
        ]
    }
}
```

配置完 `style-loader` 后基本就可以满足我们项目中的 css 的基本使用了，但是我们在实际开发中，经常是使用 `less` 或 `sass` 等 css 预处理器来编写样式，这个时候我们的配置显然就不满足了，我们以 `less` 举例

眼尖的朋友会注意到 `style-loader` 在 `css-loader` 前面，是因为  `webpack` 在加载 `loader` 时是从后往前加载的 

<article class="message is-warning">
  <div class="message-body">未接触过 webpack 的同学需要注意 loader 的加载顺序是从后往前的</div>
</article>
<br/>

## `less-loader` 的使用
`less-loader` 的使用配置很简单，`sass` 同理

<article class="message is-warning">
  <div class="message-body">
   注意：使用 less-loader 需要同时安装 less
  </div>
</article>


```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ]
            }
        ]
    }
}
```

到目前为止，以上的配置基本上够我们项目中使用了，但是当我们把我们的项目跑在不同的浏览器中，可能会出现样式失效的情况，这是为什么呢

因为我们编写的很多样式都是基于主流浏览器适配的，所以跑在不同浏览器时我们需要加上浏览器前缀，但是我们所有的样式都要手动加上浏览器前缀的话，工作量就太大了，这时候我们就需要一个合适的 loader 来帮我们完成这些操作
<br/>

## `postcss-loader` 的使用

<article class="message is-info">
  <div class="message-header">
    <p> <a href="https://github.com/postcss/postcss/blob/main/docs/README-cn.md#postcss-"> PostCss </a> </p>
  </div>
  <div class="message-body">
    <a href="https://github.com/postcss/postcss/blob/main/docs/README-cn.md#postcss-"> PostCss </a>本身是一个可以独立使用的工具，它的很多能力其实在与它强大的插件，具体的插件可以在 <a href="https://github.com/postcss/postcss/blob/main/docs/plugins.md"> 插件列表 </a>找到它们。
  </div>
</article>

在 `webpack` 中使用 `PostCss` 需先安装 `postcss-loader`， 并在 `webpack.config.js` 配置使用 `postcss-loader` 
```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' }
                ],
            }
        ]
    }
}
```
然后在根目录 创建 `postcss.config.js`
<br/>

### `PostCss` 中 `autoprefixer` 的使用
```js postcss.config.js
module.exports = {
    plugins:[
         'autoprefixer'
    ]
}
```
`autoprefixer` 会自动给不同浏览器添加一些前缀，配置完后我们写的样式代码就可以跑在所有现代浏览器了，但当我们的项目在低版本浏览器打开时，会发现我们写的样式可能还是不生效的情况，这个时候，我们就需要再使用另一个 `PostCss` 的插件了 

> `autoprefixer` 是 `PostCss` 中的一个插件，它会使用 [borwserslist](https://github.com/browserslist/browserslist#browserslist-) 根据 [Can I Use](https://caniuse.com/usage-table) 的数据来给不同浏览器自动添加上前缀，
>
> 如果项目中未对 [borwserslist](https://github.com/browserslist/browserslist#browserslist-)  配置，则会使用默认值 `> 0.5%, last 2 versions, Firefox ESR, not dead`，
>
> 表示全球市场占有率 大于 `0.5%`，最后两个版本， 最新的 `Firefox ESR` 版本，没有死亡的(24个月内更新过版本的浏览器)，其中只要满足一个条件就会自动添加前缀
>
关于 [Can I Use](https://www.npmjs.com/package/caniuse-lite) 和 [borwserslist](https://github.com/browserslist/browserslist#browserslist-) 不在本篇博客的探讨范围之内
<br/>

### `PostCss` 中 `postcss-preset-env` 的使用
`postcss-preset-env` 可以帮我们把最新的 css 特性转换为大多数浏览器都可以识别的样式代码
`postcss-preset-env` 已经[集成了](https://github.com/csstools/postcss-preset-env#autoprefixer) `autoprefixer` ，并且默认开启， 所以可以去除 `autoprefixer` 

```js postcss.config.js
module.exports = {
    plugins:[
         'postcss-preset-env'
    ]
}
```
配置完 `postcss-preset-env` 后我们的css代码就可以随心所欲的跑在所有主流浏览器了
<br/>

## `file-loader` 的使用
当我们在代码中使用了一些图片等静态资源，就需要使用 `file-loader` 来帮我们处理了，


```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',

                    }
                ],
            },
            {
                test: /\.(png|svg|jpg)$/,
                use: [
                    {
                        loader: 'file-loader', 
                        options: {
                            name:'img/[name].[hash:6].[ext]'
                        }
                    }
                ]
            }
        ]
    }
}
```
<br/>

如果我们在js代码中 使用过 import 或者 require 的方式引入静态图片资源，file-laoder 默认的配置需要我们 再通过 .default 来获取图片，因为它默认帮我们转换成 es6 模块化了

如：
``` js index.js
import logo from './assets/images/logo.png';

...
<img src={log.default}>
...

```
<br/>

如果不想使用这种方式，我们还需要对 file-loader 进行一些额外的配置, `esModule: false`

``` js webpack.config.js
...
 {
    test: /\.(png|svg|jpg)$/,
    use: [
        {
            loader: 'file-loader', 
            options: {
                name: 'img/[name].[hash:6].[ext]',
                esModule: false
            }
        }
    ]
}
...

```

<br/>
<br/>


options 中的配置项目 可从 [webpack官网](https://www.webpackjs.com/loaders/file-loader/#%E9%80%89%E9%A1%B9) 中查询到
上述配置表示在 打包后把图片放到img文件下，保留原文件名并拼接上6位的hash值，最后保留原有文件的扩展名



## `url-loader` 的使用
`url-loader` 的功能和 `file-loader` 类似，
相当于对 `file-loader` 进行增强，并且可以通过 `limit` 属性来配置限制，
大于这个限制的 图片会被交给 `file-loader` 处理，小于这个限制的会被转换成 base64 的格式，直接打包进源代码
但是可以设置指定大小内的图片转换为base64格式的图片，加载网页时一并加载出来

```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    { loader: 'css-loader' },
                    {
                        loader: 'postcss-loader',

                    }
                ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 100
                        }
                    }
                ]
            },
        ]
    }
}
```
<br/>

## html-loader
可以解决在 html 文件中使用 img 标签使用的 url 问题


## `webpack 5` 中 `asset` 的使用
在 `webpack 5` 中，给我们内置了一些模块，可以在不使用其它 loader 的时候使用 图片、字体等文件
+ `asset/resource` 发送一个单独的文件并导出 URL。之前通过使用 `file-loader` 实现。
+ `asset/inline` 导出一个资源的 data URI。之前通过使用 `url-loader` 实现。
+ `asset/source` 导出资源的源代码。之前通过使用 `raw-loader` 实现。
+ `asset` 在导出一个 data URI 和发送一个单独的文件之间自动选择。之前通过使用 `url-loader`，并且配置资源体积限制实现。

### `asset/resource` 的使用

```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name].[hash:6][ext]'
                }
            },
        ]
    }
}
```

### `asset/inline` 的使用

使用 `asset/inline` 资源会以 base64 的格式来展示

```js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset/inline',
            },
        ]
    }
}
```

### `asset` 的使用 
当我们有些图片资源过大时，我们是不希望它也被转换成base64 的，此时，就可以使用 asset 模块来帮我们做转换，
当我是不设置 parser 时，asset 会默认将小于 8kb 的资源使用 inline 来选择 inline 类型，大于的会选择 resource 类型，
当我们想要手动配置大小时，示例代码如下

``` js webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|gif)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 100 * 1024,
                    }
                }
            },
        ]
    }
}
```
