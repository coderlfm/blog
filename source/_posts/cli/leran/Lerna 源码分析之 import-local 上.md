---
title: Lerna 源码分析之 import-local 上
date: 2021-07-28 11:30:38
categories:
  - CLI
tags:
  - Leran
cover: /cover-imgs/lerna.png
---

`import-local` 可以让全局和本地安装了同一个模块时，优先使用本地模块

<!-- more -->

<!-- # Lerna 源码分析之 import-local 上 -->

# lerna 入口

首先我们进入到 `lerna` 的入口 ，`lerna`的入口是 `lerna/cli.js`，代码很简单

通过 `import-local` 判断本地是否有安装 `lerna`，有的话会使用本地的 `lerna`，否则使用全局的

`import-local`具体是怎么找到本地 `lerna` 的，就需要深入到 `import-local` 的源码

```JavaScript
#!/usr/bin/env node

"use strict";

const importLocal = require("import-local");

// 判断本地是否有 lerna 如果有的话则会优先使用本地的
if (importLocal(__filename)) {
  require("npmlog").info("cli", "using local version of lerna");
} else {
  require(".")(process.argv.slice(2));
}

```



# import-local 源码

`import-local` 主要做了以下几件事

1. 这个模块全局目录，会向上去找最近的 `package.json` 所在的目录

2. 拿到这个模块的入口文件 相对于 模块根路径 的相对路径

3. 拿到这个模块在本地的路径(如果本地有安装的情况下)

4. 判断 **本地 node_modules 路径**  和 **全局模块的路径**  是否 `..` 开头

5. 判断是否加载本地模块

&ensp;&ensp;&ensp;&ensp;1. 判断 4 是否为 true

&ensp;&ensp;&ensp;&ensp;2. 判断3 是否有值

&ensp;&ensp;&ensp;&ensp;3. 判断 3 是否和全局模块入口的地址不相等

6. 以上判断都满足的话，使用本地的模块 `require(localFile)`

7. 不满足的话会 `return undefinde`，会使用全局的模块


这里我们需要深入看的源码一共有两个 

- `pkgDir.sync(path.dirname(filename))` ： 向上找到最近的 `package.json` 所在的路径

- `resolveCwd.silent(path.join(pkg.name, relativePath))`：找这个模块在本地的路径(如果本地有安装)


> 这一节我们会深入 `pkgDir.sync(path.dirname(filename))` 



```JavaScript
'use strict';
const path = require('path');
const resolveCwd = require('resolve-cwd');
const pkgDir = require('pkg-dir');

module.exports = filename => {
  // 拿到这个模块的根路径， 会依次向上查找距离最近的 package.json 目录
  const globalDir = pkgDir.sync(path.dirname(filename));
  
  // 得到 模块入口 相对于 模块根路径 的相对路径 (cli.js)
  const relativePath = path.relative(globalDir, filename);
  
  // 读取 模块根路径的 package.json
  const pkg = require(path.join(globalDir, 'package.json'));
  
  // 取到模块package.json的name，lerna 中 package.json 的 name 属性取到 (lerna)
  // 以及 lerna 入口文件相对于 package.json 所在的地址 (cli.js)
  // 将 模块根路径 和 模块入口 拼接起来，进行拼接成一个 path (lenam/cli.js)
  // 如果本地也有 安装 lerna 会得到本地的 lerna 地址
  const localFile = resolveCwd.silent(path.join(pkg.name, relativePath));
  
  // 根据 命令行所在的路径 拼接上 node_modules 生成一个 本地项目node_modules路径
  const localNodeModules = path.join(process.cwd(), 'node_modules');
  
  // 判断 本地本地项目node_modules路径 和 这个全局模块所在的目录是否 .. 开头，这个取反，其实没有必要
  const filenameInLocalNodeModules = !path.relative(localNodeModules, filename).startsWith('..');
  
  // 如果本地有 lerna 则会加载本地的，否则返回 undefined 
  return !filenameInLocalNodeModules && localFile && path.relative(localFile, filename) !== '' && require(localFile);
};
```


可以看到 `pkgDir.sync(path.dirname(filename))`  主要调用了 `pkg-dir` 这个库，且将全局的 `lerna` 入口文件的路径传了进去，例如我这里是(`'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna'`)

# pkg-dir 源码

可以看到 `pkg-dir`的源码实现也是较为简单，

- 调用 `findUp.sync('package.json', {cwd})`,将需要查找的 **文件/目录 **  和 开始查找的路径 传入进去

-  如果找到了则返回这个 **文件/目录 ** 所在 路径

```JavaScript
'use strict';
const path = require('path');
const findUp = require('find-up');

module.exports.sync = cwd => {
  
  // 将需要查找的 文件 传入，以及开始查找的目录，找不到会返回 undefined
  const filePath = findUp.sync('package.json', {cwd});
  
  // 如果找到了，则会返回这个 文件 所在的文件目录
  return filePath && path.dirname(filePath);
};

```


## find-up 的基本使用

`find-up`可以根据指定路径逐级往上匹配最近包含某个文件的路径

如下，它会在我们传入的 `cwd` 目录下逐级往上，找到最近一个包含 `package.json` 文件的目录

```JavaScript
findUp.sync(
  'package.json', 
  { cwd: 'C:\\Users\\37564\\AppData\\Roaming\\npm\\node_modules\\lerna'}
);
```




# find-up 源码

`find-up` 主要做了以下几件事

- 拿到开始查找的路径，默认值为命令行所在的路径(`这里是 lerna 的全局路径`)

- 将需要查找的 文件/目录(name) 转为 放到数组中

- 开始 `while(true)` 循环

&ensp;&ensp;&ensp;&ensp;- 判断传入的 `name` 是否为函数，如果是则调用它，再开始查找

&ensp;&ensp;&ensp;&ensp;- 不是函数则直接调用 `locatePath.sync(paths, locateOptions)` 开始查找

&ensp;&ensp;&ensp;&ensp;- 如果这一级没有找到，则开始找上一级 `directory = path.dirname(directory)`,

&ensp;&ensp;&ensp;&ensp;- 如果找到根路径还没有找到，则 `return undefined;`

&ensp;&ensp;&ensp;&ensp;- 如果找到了，则将路径和 `文件/目录` 名拼接后再 `return;`


```JavaScript
'use strict';
const path = require('path');
const locatePath = require('locate-path');

module.exports.sync = (name, options = {}) => {
  let directory = path.resolve(options.cwd || '');
  
  // 取到根路径 如 'C:\\' 或  '/'
  const {root} = path.parse(directory);
  
  // 将需要查找的文件转为一个数组，因为这个name 既可以传数组，也可以传字符串
  const paths = [].concat(name);

  const runMatcher = locateOptions => {
  
    // 判断是否为函数，如果是则调用后再查找，否则直接开始查找 
    if (typeof name !== 'function') {
      return locatePath.sync(paths, locateOptions);
    }

    const foundPath = name(locateOptions.cwd);
    if (typeof foundPath === 'string') {
      return locatePath.sync([foundPath], locateOptions);
    }

    return foundPath;
  };

  // 开始进行匹配，将目录传入进去
  while (true) {
  
    // 如果找到了会将目录返回
    const foundPath = runMatcher({...options, cwd: directory});

    if (foundPath === stop) {
      return;
    }

    if (foundPath) {
      // 找到了会将 路径和 文件/目录 名拼接后返回
      return path.resolve(directory, foundPath);
    }
    
    // 如果以及找到根路径了还没有找到表示找不到了 return 
    if (directory === root) {
      return;
    }
    
    // 如果没有找到则会开始向上一级查找
    directory = path.dirname(directory);
  }
};
```



# locate-path 源码

`locate-path` 会做以下几件事

- 判断是否允许软链接(`allowSymlinks`)来判断调用 `fs.statSync` 还是 `fs.lstatSync`

- 遍历需要查找的数组

&ensp;&ensp;&ensp;&ensp;- 将 开始查找的路径(cwd `这里是 lerna 的全局目录`) 和需要查找的 **文件/目录**  拼接起来

&ensp;&ensp;&ensp;&ensp;- 调用 `fs.statSync` 或 `fs.lstatSync` 拿到 **文件/目录**  的`stats`

&ensp;&ensp;&ensp;&ensp;- 判断这个 **文件/目录**  是否真实存在 `isFile()/isDirectory()`

&ensp;&ensp;&ensp;&ensp;- 如果存在则将这个 **文件/目录**  返回

&ensp;&ensp;&ensp;&ensp;

```JavaScript
'use strict';
const path = require('path');
const fs = require('fs');

const typeMappings = {
  directory: 'isDirectory',
  file: 'isFile'
};

function checkType({type}) {
  if (type in typeMappings) {
    return;
  }

  throw new Error(`Invalid type specified: ${type}`);
}

const matchType = (type, stat) => type === undefined || stat[typeMappings[type]]();

module.exports.sync = (paths, options) => {
  options = {
    cwd: process.cwd(),    // 默认会拿到命令执行的所在目录
    allowSymlinks: true,   // 是否允许软链接，默认true
    type: 'file',          // 类型，默认为 file
    ...options
  };
  
  // 校验类型是否正确
  checkType(options);
  
  // 根据是否允许软链接判断待会调用 fs.statSync 还是 fs.lstatSync
  const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync;
  
  // 遍历所有需要查找的文件数组
  for (const path_ of paths) {
    try {
    
      // 从需要查找的目录拼接上需要查找的文件/目录
      // 取到 文件/目录 的 stats
      const stat = statFn(path.resolve(options.cwd, path_));
      
      // 根据 类型(文件/目录) 调用 isFile() 或 isDirectory()
      // 如果 返回 true，表示已经找到，则将 这个 文件/目录 字符串 return
      if (matchType(options.type, stat)) {
        return path_;
      }
    } catch (_) {
    }
  }
};

```



# 总结

到这里就把 `import-local`源码的上半部分读完了，也巩固了一下 `nodejs`， 读到这里发现了有些老外比较喜欢写一些小而美库，功能不需要太大。

这里 `pkg-dir` 和 `find-up` 都是同一个作者写的库，下载量也很多。



