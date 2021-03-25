---
title: webpack 中的 optimization
date: 2021-03-02 18:24:00
toc: true
tags:
- Webpack

categories:
- Webpack


cover: http://qiniu-oss.liufengmao.cn/blog/cover-imgs/webpack.jpg

---
webpack 中可以通过对 optimization 配置来对我们项目进行一些优化

<!-- more -->

## 1. 不单独生成注释信息 (`optimization.minimizer`)
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
<br/>
<br/>

## 2. 配置 模块id 生成的算法 (`optimization.chunkIds`)
不知道有没有朋友注意到，当我们使用 `@vue/cli` 来搭建我们的项目的时候，当我们把项目跑起来后，可以看到很多类似 `1.js` `2.js` `3.js` 这种文件，这种文件是怎么生成的呢
{% asset_img vue-product.png %}

<br/>
<br/>


我们可以通过配置 `optimization.chunkIds` 来修改模块 `id` 生成的算法，如果我们将 `optimization.chunkIds` 修改为 `named` 后的话，我们在开发阶段就可以看到生成的 js 文件拼接上了我们的原文件名
<br/>

|选项值	| 描述 |
|:-----|----- |
|`natural`|	按使用顺序的数字 id|
|`named`|	对调试更友好的可读的 id，会拼接上模块的原文件名|
|`deterministic`|	在不同的编译中不变的短数字 id，有益于长期缓存，在生产模式中会默认开启|
|`size`|	专注于让初始下载包大小更小的数字 id|
|`total-size`|	专注于让总下载包大小更小的数字 id|

<br/>

### 2.1 多入口文件时注意点 (`optimization.runtimeChunk`)
当我们的项目有多个入口文件时，可能我们多个入口文件都同时依赖了相同的第三方库，这样的话，在有些情况下，有可能这个库会被同时被实例化多次，这种情况我们肯定是不希望发生的，那么我们就可以通过配置 `optimization.runtimeChunk` 来生成一个所有 `chunk` 之前共享的 运行时文件

> [这里](https://bundlers.tooling.report/code-splitting/multi-entry/) 有更多关于多入口文件项目依赖的注意点

`optimization.runtimeChunk` 默认的值是 `false` 
+ `false` 会将所有的入口文件的 runtime 运行时文件写入到打包后的文件中
+ `'single'` 会生成一个在 所有 chunk 间共享的一个运行时文件
+ `'multiple'` 或者 `true` 会为所有的入口 chunk 都单独生成一个 `runtime` 运行时文件 

``` js webpack.common.js
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
  optimization: {

    minimizer: [ new TerserPlugin({ extractComments: false }) ],

    chunkIds: 'named',

    // 只会生成一个 runtime 运行时文件
    runtimeChunk: 'single',
  
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
```
<br/>
<br/>

#### 2.1.1 为每个入口文件都单独配置 `runtime` 运行时文件

首先将 `optimization` 中的 `runtimeChunk` 修改为 `'multiple'` 或 true.

``` js webpack.common.js
  ...
  optimization: {
    ...
    runtimeChunk: 'multiple',
  }
  ...
```
然后重新执行打包命令，可以看到会生成以下文件，`webpack` 为我们给每个入口文件都生成了 `runtime` 运行时文件

{% asset_img build-3.png %}
<br/>
<br/>
<br/>

#### 2.2.2 为所有入口文件只生成一个 `runtime` 运行时文件

首先将 `optimization` 中的 `runtimeChunk` 修改为 `'single'`.

``` js webpack.common.js
  ...
  optimization: {
    ...
    runtimeChunk: 'single',
  }
  ...
```
然后重新执行打包命令，可以看到会生成以下文件，`webpack` 只为我们生成了一个 `runtime` 运行时文件

{% asset_img build-4.png %}

> 有关 `optimization.runtimeChunk` 的更多信息，可以查看 [此处](https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk)


<br/>
<br/>

## 3. optimization.splitChunks
是用来 配置 webpack 中模块分块策略的

以下是 `splitChunksPlugin` 的默认值

``` js webpack.config.js
optimization: {
    splitChunks: {

      // 'async'  'initial'  'all'  
      // async 为只有异步引入模块时才会单独打包
      // all   为所有的模块都单独打包成一个文件
      chunks: 'async',

      // 打包成 chunk 后最小的大小，单位为字节
      minSize: 20000,

      minRemainingSize: 0,
      
      // 将大于 maxSize 的 chunk 分割成一个个较小的 chunk ，且分割后的 chunk 最小体积为 minSize 
      maxSize: 0,

      // 当模块被引用过几次后将其单独打包成一个 chunk
      minChunks: 1,

      // 按需加载时的最大并行请求数
      maxAsyncRequests: 30,

      // 入口的最大并行请求数。
      maxInitialRequests: 30,

      // 强制执行拆分的大小阈值
      enforceSizeThreshold: 50000,

      // 缓存组中可以单独配置以上的所有配置，
      // 除此之外新增了 test 、 priority 和 reuseExistingChunk 三个属性
      // test 填写 模块路径或者 chunk 名称来做匹配到的资源
      // priority 配置该缓存组的优先级，默认值为0，该值优先级为负数，所以我们通常设置为负数，
      // 当匹配到的资源属于多个缓存组的时候，就会根据 优先级来选择最终的匹配自定义缓存组
      // reuseExistingChunk 如果当前 chunk 包含 其它从主 chunk 中拆分出来的模块，则它们会被复用
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  }
```
<br/>


<article class="message">
  <div class="message-body">
    <h5>缓存组中可以单独配置以上的所有配置</h5>
    <h5>除此之外新增了 <code> test </code>、<code> priority </code> 和 <code> reuseExistingChunk </code> 三个属性</h5>
    <ul>
      <li><code>test: </code> 填写 模块路径或者 chunk 名称来做匹配到的资源</li>
      <li><code>priority: </code> 配置该缓存组的优先级，默认值为0，该值优先级为负数，所以我们通常设置为负数，当匹配到的资源属于多个缓存组的时候，就会根据 优先级来选择最终的匹配自定义缓存组</li>
      <li><code>reuseExistingChunk: </code> 如果当前 chunk 包含 其它从主 chunk 中拆分出来的模块，则它们会被复用</li>
    <ul/>
  </div>
</article>








