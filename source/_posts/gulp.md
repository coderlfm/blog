---
title: gulp
date: 2021-01-08 11:13:54
tags:
- javaScript

categories:
- javaScript

cover: /cover-imgs/gulp.png

---
## gulp 入门

<!-- more -->

### 创建 gulpfile.js
导出函数 export { foo }
就可以 npx gulp foo
默认情况下就是异步的任务，如果要结束任务的话要调用 cb

``` js 
const foo = (cb) =>{

  // 调用回调函数表示结束
  cb();
}

module.exports = { foo }
```
``` shell
npx gulp foo
```
早期3.x版本 是通过 导入 gulp 然后 gulp.task('bar', (cb)=> {
  cb();
})

这样子也是可以的，这种方式是4.x之前的写法版本


默认任务，调用的时候不用 跟任务名
``` js
module.exports.default = {}
```

任务分为以下两种
+ 公共任务
+ 私有任务


任务的组合
+ series()    串行任务
+ parallel()  并行任务

``` js 串行任务和并行任务
const seriesTask = series(tesk1, tesk2, tesk3);
const parallelTask = parallel(tesk1, tesk2, tesk3);

// 还可以继续组合
const composeTask = series(seriesTask, parallelTask)

export { seriesTask, parallelTask }

```











### [gulp异步任务](https://www.gulpjs.com.cn/docs/getting-started/async-completion/#%E5%BC%82%E6%AD%A5%E6%89%A7%E8%A1%8C)

### task任务可以为一个异步任务
```js
const fs = require('fs');

async function asyncAwaitTask() {
  const { version } = fs.readFileSync('package.json');
  console.log(version);
  await Promise.resolve('some result');
}

exports.default = asyncAwaitTask;
```

## 插入babel 图片

对代码进行转换成 es5

对代码进行压缩 uglify 或者 terser 来压缩

## glob 文件匹配

*
** 

## 监听
监听文件变化后执行单个任务，如果要执行多个任务就需要 使用组合任务，

``` js
watch('src/**/*.js', jsTask);
```


### 处理文件
gulp 暴露了 src() 和 dest() 方法用于处理计算机上存放的文件。

src() 接受 glob 参数，并从文件系统中读取文件然后生成一个 Node 流（stream）。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。

由 src() 产生的流（stream）应当从任务（task）中返回并发出异步完成的信号，就如 创建任务（task） 文档中所述。

### [插件](https://www.gulpjs.com.cn/docs/getting-started/using-plugins/#%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6)

并非 gulp 中的一切都需要用插件来完成。虽然它们是一种快速上手的方法，但许多操作都应当通过使用独立的功能模块或库来实现。

插件应当总是用来转换文件的。其他操作都应该使用（非插件的） Node 模块或库来实现。

