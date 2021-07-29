---
title: Lerna 的基本使用
date: 2021-07-26 11:30:38
tags:
  - Leran
categories:
  - Leran
cover: /cover-imgs/lerna.png
---

多 package 管理工具 lenra 的基本使用

<!-- more -->


当我们项目大起来且项目间相互依赖的东西多起来，项目管理起来就会很困难，`Leran`的出现揭示了一个真理，当项目复杂度提升时，就需要做架构优化，

# 初始化 项目

执行以下命令

```Bash
mkdir sunshine-cli

```


```Bash
cd sunshine-cli

```


```Bash
npm init -y

```



## 安装 Lerna

```Bash
npm i lerna

```


 这里我们也可以全局再安装一个，避免我们每次使用的时候都需要 `npx leran`，全局和本地都安装了的话， `leran` 会优先使用本地的

```Bash
npm i lerna

```



## 初始化 Leran 项目

```Bash
leran init
```


到这一步我们已经初始化好了一个项目，这个命令会帮我们生成一个 `leran.json` 文件和 `packages` 目录，我们这个项目的所有项目都在 `packages` 里面，


# Leran 常用命令

- [lerna init](https://github.com/lerna/lerna/blob/main/commands/init#readme)         初始化项目

- [lerna create](https://github.com/lerna/lerna/blob/main/commands/create#readme)      创建一个由 `leran` 管理的 `package`

- [lerna exec](https://github.com/lerna/lerna/blob/main/commands/exec#readme)          执行 `shell` 脚本

- [lerna run](https://github.com/lerna/lerna/blob/main/commands/run#readme)            执行 `npm` 的脚本

- [lerna add](https://github.com/lerna/lerna/blob/main/commands/add#readme)            安装依赖，可以指定给哪个 `package` 安装依赖

- [lerna clean](https://github.com/lerna/lerna/blob/main/commands/clean#readme)         清空依赖

- [lerna bootstrap](https://github.com/lerna/lerna/blob/main/commands/bootstrap#readme)   重新安装所有依赖

- [lerna link](https://github.com/lerna/lerna/blob/main/commands/link#readme)           建立软链接

- [lerna version](https://github.com/lerna/lerna/blob/main/commands/version#readme)      更新版本

- [lerna changed](https://github.com/lerna/lerna/blob/main/commands/changed#readme)      查看与上一次版本的变更

- [lerna diff](https://github.com/lerna/lerna/blob/main/commands/diff#readme)           查看 `diff`

- [lerna publish](https://github.com/lerna/lerna/blob/main/commands/publish#readme)      项目发布

- [lerna list](https://github.com/lerna/lerna/blob/main/commands/list#readme)           查看本地所有的 `package`，可以简写成 `ls`

- [lerna import](https://github.com/lerna/lerna/blob/main/commands/import#readme)

- [lerna info](https://github.com/lerna/lerna/blob/main/commands/info#readme)           查看本地的环境信息，系统版本，npm版本等


# package 间相互依赖的使用

如果我们想在其中一个 `package` 中引入另外一个 `package`，并且最终这俩都发布成独立的包。


## 创建 package

这里我们先创建两个 `package`

```Bash
leran create core
```


```Bash
leran create utils
```


执行完成后我们的目录会变成如下所示



![](/image/lerna/Lerna的基本使用/Snipaste_2021-07-26_14-13-46.png)


 

## 引入模块

在 `packages\utils\lib\utils.js` 中新增以下内容

```JavaScript
'use strict';

function add(number1, number2) {
    return number1 + number2;
}

module.exports = {
    add
}
```



在 `packages\core\package.json`  的 `dependencies` 中手动添加依赖

```JSON
  "dependencies": {
    "@sunshine-cli-dev/utils": "file:../utils"
  }
```


然后在 `packages\core` 目录下执行 `npm install`

然后此时我们会发现该 `package` 中的 `node_modules` 中新增了我们刚刚我们手动定添加的依赖，如果我们进入到里面查看，会发现 **这是一个软链接，类似于 windows 的快捷方式** 



![](/image/lerna/Lerna的基本使用/Snipaste_2021-07-26_14-29-02.png)


  



![](/image/lerna/Lerna的基本使用/Snipaste_2021-07-26_14-30-17.png)


 


然后我们在 `packages\core` 中就可以使用了，且我们也不用担心 `packages\utils` 中如果发生了更改会不生效的问题了

```JavaScript
const { add } = require('@sunshine-cli-dev/utils')

console.log(add(1, 2));   // 3
```



