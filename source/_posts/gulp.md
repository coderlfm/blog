---
title: gulp
date: 2021-01-08 11:13:54
tags:


cover: /cover-imgs/gulp.png

---
## gulp 入门

<!-- more -->


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

### 处理文件
gulp 暴露了 src() 和 dest() 方法用于处理计算机上存放的文件。

src() 接受 glob 参数，并从文件系统中读取文件然后生成一个 Node 流（stream）。它将所有匹配的文件读取到内存中并通过流（stream）进行处理。

由 src() 产生的流（stream）应当从任务（task）中返回并发出异步完成的信号，就如 创建任务（task） 文档中所述。

### [插件](https://www.gulpjs.com.cn/docs/getting-started/using-plugins/#%E4%BD%BF%E7%94%A8%E6%8F%92%E4%BB%B6)

并非 gulp 中的一切都需要用插件来完成。虽然它们是一种快速上手的方法，但许多操作都应当通过使用独立的功能模块或库来实现。

插件应当总是用来转换文件的。其他操作都应该使用（非插件的） Node 模块或库来实现。

