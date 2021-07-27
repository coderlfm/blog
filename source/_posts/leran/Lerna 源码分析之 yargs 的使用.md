---
title: Lerna 源码分析之 yargs 的使用
date: 2021-07-27 10:30:38
tags:
  - Leran
categories:
  - Leran
cover: /cover-imgs/leran.png
---

Lerna 的基本使用

<!-- more -->

<!-- # Lerna 源码分析之 yargs 的使用 -->

## 源码入口

## core/lerna/cli.js

Leran 的入口文件在 `lerna-main\core\lerna\cli.js`

```JavaScript
#!/usr/bin/env node

"use strict";

/* eslint-disable import/no-dynamic-require, global-require */
const importLocal = require("import-local");

if (importLocal(__filename)) {
  require("npmlog").info("cli", "using local version of lerna");
} else {
  require(".")(process.argv.slice(2));
}

```


可以看到入口文件很简单，一共十几行代码，有关 `import-local` 后面再做分析。

这里我们默认会进入到 `else`分支，可以看到一行 `require(".")(process.argv.slice(2))` 代码，这行代码是什么意思呢，因为在 `node` 中当我们引入文件时不写后缀时，会先解析 `.js` `.json` `.node`，当解析不到时，会把它当成一个`package` 解析它 `package.json` 的 `main` 属性，没有找到 `package.json` 或者 `main` 属性有误，会解析它引入路径下的 `index` 开始依次按照后缀解析，若还是解析不到，则开始抛错，有关 `node` 中 `require` 的机制分析，之前在写过一篇 [node 中 require 的源码分析](https://blog.liufengmao.cn/2020/10/29/node/node%E5%8A%A0%E8%BD%BD%E6%96%87%E4%BB%B6%E7%9A%84%E9%A1%BA%E5%BA%8F/#%E5%AF%BC%E5%85%A5%EF%BC%9A-require)

所以 `require(".")(process.argv.slice(2))` 在这里相当于是 `require("./index.js")(process.argv.slice(2))`，引入了 `index.js` 并将其作为一个函数执行，将命令行携带的参数传入进去。 


## core/lerna/index.js

`index.js` 中可以看到引入了很多包，其中我们可以看到，刚刚我们在 `cli.js` 中执行的其实就是 `main`方法，而 main 方法中的主要逻辑是从 `cli()` 开始的，也就说明我们需要先看 `cli` 的实现，才能明白后面链式调用的 `command` 及 `parse` 具体是什么作用

```JavaScript
"use strict";

const cli = require("@lerna/cli");

const addCmd = require("@lerna/add/command");
const bootstrapCmd = require("@lerna/bootstrap/command");
const changedCmd = require("@lerna/changed/command");
const cleanCmd = require("@lerna/clean/command");
const createCmd = require("@lerna/create/command");
const diffCmd = require("@lerna/diff/command");
const execCmd = require("@lerna/exec/command");
const importCmd = require("@lerna/import/command");
const infoCmd = require("@lerna/info/command");
const initCmd = require("@lerna/init/command");
const linkCmd = require("@lerna/link/command");
const listCmd = require("@lerna/list/command");
const publishCmd = require("@lerna/publish/command");
const runCmd = require("@lerna/run/command");
const versionCmd = require("@lerna/version/command");

const pkg = require("./package.json");

module.exports = main;

function main(argv) {
  const context = {
    lernaVersion: pkg.version,
  };

  return cli()
    .command(addCmd)
    .command(bootstrapCmd)
    .command(changedCmd)
    .command(cleanCmd)
    .command(createCmd)
    .command(diffCmd)
    .command(execCmd)
    .command(importCmd)
    .command(infoCmd)
    .command(initCmd)
    .command(linkCmd)
    .command(listCmd)
    .command(publishCmd)
    .command(runCmd)
    .command(versionCmd)
    .parse(argv, context);
}

```



`cli` 是从 `@lerna/cli` 中引入的，这个 `@lerna/cli` 并不是第三方包，而是内部的包，从 `package.json` 中可以体现。

```JSON
  "dependencies": {
    "@lerna/cli": "file:../cli"
  }
```



## core/cli/index.js

进入到 `cli` 目录下的 `index.js`，可以看到这个文件也是只导出了一个 `lernaCLI` 方法，当看到这里的时候，就觉得 `lerna` 的源码结构写的非常的清晰，至少比看 `react` 源码的时候易懂多了😂

```JavaScript
"use strict";

const dedent = require("dedent");
const log = require("npmlog");
const yargs = require("yargs/yargs");
const { globalOptions } = require("@lerna/global-options");

module.exports = lernaCLI;

/**
 * A factory that returns a yargs() instance configured with everything except commands.
 * Chain .parse() from this method to invoke.
 *
 * @param {Array = []} argv
 * @param {String = process.cwd()} cwd
 */
function lernaCLI(argv, cwd) {
  const cli = yargs(argv, cwd);

  return globalOptions(cli)
    .usage("Usage: $0 <command> [options]")
    .demandCommand(1, "A command is required. Pass --help to see all available commands and options.")
    .recommendCommands()
    .strict()
    .fail((msg, err) => {
      // certain yargs validations throw strings :P
      const actual = err || new Error(msg);

      // ValidationErrors are already logged, as are package errors
      if (actual.name !== "ValidationError" && !actual.pkg) {
        // the recommendCommands() message is too terse
        if (/Did you mean/.test(actual.message)) {
          log.error("lerna", `Unknown command "${cli.parsed.argv._[0]}"`);
        }

        log.error("lerna", actual.message);
      }

      // exit non-zero so the CLI can be usefully chained
      cli.exit(actual.exitCode > 0 ? actual.exitCode : 1, actual);
    })
    .alias("h", "help")
    .alias("v", "version")
    .wrap(cli.terminalWidth()).epilogue(dedent`
      When a command fails, all logs are written to lerna-debug.log in the current working directory.

      For more information, find our manual at https://github.com/lerna/lerna
    `);
}

```



看到这时，会发现这个方法中都是围绕着 `yargs` 创建后的 `cli` 开始的，所以接下来我们开始学习一下 `yargs`，学会 `yargs` 的基本使用后，我们就能读明白 `lerna` 的这么多命令是怎么编写的了，这也是本篇的重点。


## Yargs

`Yargs` 是一个通过解析参数和生成优雅的用户界面来帮助您构建交互式命令行工具 的`nodejs` 库，再也不用手动的解析命令了，之前通过手动解析写过一个`vue`和 `react` 项目模板的脚手架


## 解析参数

注意 `Yargs` 期望传入的数组只包含程序名后的参数，而`process.argv` 会包含`process.execPath`和正在执行的 JavaScript 文件的路径，所以我们需要将`process.argv.slice(2)` 把前面两个参数截取掉再传给 `Yargs`。

或者可以使用 `yargs/helpers` 包中的 `hideBin` 来帮我们解析。

```JavaScript
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

// 以下两种方式都是可以的
const cli = yargs(process.argv.slice(2));
const cli = yargs(hideBin(process.argv));  

console.log(cli.argv);    
```


```Bash
node index.js init app    // { _: [ 'init', 'app' ], '$0': 'index.js' }
```



## 注册命令

`.command(cmd, desc, [builder], [handler])`

- cmd 命令的名称

- builder 命令准备执行前的回调

- desc 命令的描述

- handler 命令的处理函数

```JavaScript
const cli = yargs(process.argv.slice(2));

cli
  .command('init', '初始化项目', (yargs) => {
    return yargs
  }, (argv) => {
    console.log('项目开始初始化... ');
    console.log(argv);
  })
  .argv
```


```bash
node index.js init app    // 项目开始初始化...    { _: [ 'init' ], '$0': 'index.js' }
```



### 注册一个带参数的命令

```JavaScript
  .command('create <name>', '创建项目', (yargs) => {
    return yargs
  }, (argv) => {
    console.log('创建项目... ');
    const { name } = argv;
    console.log('项目名称:', name);
  })
```


```bash
PS > node index.js create app
创建项目... 
项目名称: app
```



注册完命令后，我们也可以通过 `help` 来查看帮助文档看我们一共有哪些命令，这个 `help` 是 `yargs` 自动帮我们配置的，无需我们手动配置。

可以看到我们刚刚注册的命令已经能够在帮助文档中查看到了

```Bash
node index.js help
```


```Bash
PS > node index.js help
index.js [命令]

命令：
  index.js init  初始化项目

选项：
  --help     显示帮助信息                                                 [布尔]
  --version  显示版本号                                                   [布尔]
```



## 注册选项 

`.options(key, [opt])`

- key 选项名

- opt 选项中可填的 `otpions`

有效的 options

- `alias`: string or array of strings, alias(es) for the canonical option key, see `alias()`

- `array`: boolean, interpret option as an array, see `array()`

- `boolean`: boolean, interpret option as a boolean flag, see `boolean()`

- `choices`: value or array of values, limit valid option arguments to a predefined set, see `choices()`

- `coerce`: function, coerce or transform parsed command line values into another value, see `coerce()`

- `config`: boolean, interpret option as a path to a JSON config file, see `config()`

- `configParser`: function, provide a custom config parsing function, see `config()`

- `conflicts`: string or array of strings, require certain keys not to be set, see `conflicts()`

- `count`: boolean, interpret option as a count of boolean flags, see `count()`

- `default`: value, set a default value for the option, see `default()`

- `defaultDescription`: string, use this description for the default value in help content, see `default()`

- `demandOption`: boolean or string, demand the option be given, with optional error message, see `demandOption()`

- `deprecate`/`deprecated`: boolean or string, mark option as deprecated, see `deprecateOption()`

- `desc`/`describe`/`description`: string, the option description for help content, see `describe()`

- `global`: boolean, indicate that this key should not be [reset](#reset) when a command is invoked, see `global()`

- `group`: string, when displaying usage instructions place the option under an alternative group heading, see `group()`

- `hidden`: don't display option in help output.

- `implies`: string or array of strings, require certain keys to be set, see `implies()`

- `nargs`: number, specify how many arguments should be consumed for the option, see `nargs()`

- `normalize`: boolean, apply `path.normalize()` to the option, see `normalize()`

- `number`: boolean, interpret option as a number, `number()`

- `requiresArg`: boolean, require the option be specified with a value, see `requiresArg()`

- `skipValidation`: boolean, skips validation if the option is present, see `skipValidation()`

- `string`: boolean, interpret option as a string, see `string()`

- `type`: one of the following strings

&ensp;&ensp;&ensp;&ensp;- `'array'`: synonymous for `array: true`, see `array()`

&ensp;&ensp;&ensp;&ensp;- `'boolean'`: synonymous for `boolean: true`, see `boolean()`

&ensp;&ensp;&ensp;&ensp;- `'count'`: synonymous for `count: true`, see `count()`

&ensp;&ensp;&ensp;&ensp;- `'number'`: synonymous for `number: true`, see `number()`

&ensp;&ensp;&ensp;&ensp;- `'string'`: synonymous for `string: true`, see `string()`


### 注册一个选项

```JavaScript
  .option("update", {
    describe: '更新脚手架',
  })
```


```Bash
> node index.js --update 
```



### 注册多个选项

```JavaScript
  .options({
    "force": {
      alias: 'f',   // 配置别名 可使用 --force 或者 -f
      describe: '强制覆盖目录',
      type: 'boolean'
    },
    "run": {
      alias: 'r',
      describe: '启动一个服务',
      type: 'boolean'
    },
    "debug": {
      describe: 'debuger 模式',
      type: 'boolean',
      hidden: true,     // 隐藏的命令，不显示，一般用于开发人员的调试
    },

  })
```


```bash
> node index.js --force
> node index.js --run
> node index.js --debug

```



### 设置选项别名

`.aligs()`

```JavaScript
  .alias("u", "update") 
```


```bash
> node index.js -u 
```



### 设置选项分组

`.group()`

```JavaScript
  .group(['run', 'force'], "Deve Options")   // 将 run  force 都分配到 Deve Options下
```


```bash
> node index.js help
index.js [命令]

命令：
  index.js init           初始化项目
  index.js create <name>  创建项目

Deve Options
  -r, --run    启动一个服务                                               [布尔]
  -f, --force  强制覆盖目录                                               [布尔]

选项：
      --help     显示帮助信息                                             [布尔]
      --version  显示版本号                                               [布尔]
  -u, --update   更新脚手架


```


可以看到 `run` `force` 都分配到 `Deve Options` 分组下了


## 严格模式

`.strice` 

任何不需要的命令行参数，或者没有相应的描述，都将被报告为错误。未识别的命令也将被报告为错误。

```JavaScript
  .strict()
  .command('init', '初始化项目', (yargs) => {
    // return yargs
    // yargs
  }, (argv) => {
    console.log('项目开始初始化... ');
    console.log(argv);
  })
```


```Bash
> node index.js test
index.js [命令]

命令：
  index.js init           初始化项目
  index.js create <name>  创建项目

Deve Options
  -r, --run    启动一个服务                                               [布尔]
  -f, --force  强制覆盖目录                                               [布尔]

选项：
      --help     显示帮助信息                                             [布尔]
      --version  显示版本号                                               [布尔]
  -u, --update   更新脚手架

无法识别的选项：test
```


可以看到，我们输入不存在的命令会给我们报错


## 自定义错误处理

当我们输入的命令错误时，可以做一些自定义的错误处理逻辑

```JavaScript
  .fail((msg, err, yargs) => {
    if (err) throw err 
    console.error('发生错误!')
    console.error(msg)
    process.exit(1)
  })
```


```bash
> node index.js test
发生错误!
无法识别的选项：test
```



## 其它使用

### 设置终端的宽度

`.wrap()`

`.wrap(100)` 设置左列的宽度为 `100`

`.wrap(null)`  取消右对齐

`.wrap(cli.terminalWidth())`  占满整个终端的宽度

```JavaScript
cli
  .wrap(cli.terminalWidth()) 
```



### 设置使用示例

`.usage(<message|command>, [desc], [builder], [handler])`

如果 `desc`/ `builder`/`handler` 可选参数被设置了的话，则会被当成是一个 `command`

```JavaScript
  .usage('$0 create <name> ')
```


```Bash
> node .\index.js help
index.js create <name>

命令：
  index.js init           初始化项目
  index.js create <name>  创建项目

Deve Options
  -r, --run    启动一个服务                                               [布尔]
  -f, --force  强制覆盖目录                                               [布尔]

选项：
      --help     显示帮助信息                                             [布尔]
      --version  显示版本号                                               [布尔]
  -u, --update   更新脚手架 
```



### 设置尾部的提示

`.epilogue('这是一行尾部的提示')`

如果我们尾部的提示文字过多，使用模板字符串的时候可能缩进会有一些问题，这里我们可以借助另外一个第三方库 `dedent` 来实现，如下所示，当尾部提示字的时候会帮我们去除掉缩进

```JavaScript
  .epilogue(dedent`尾部提示 我要准备
  换行了`)
```



### 推荐命令

`.recommendCommands()` 可以在我们输入错命令的时候，帮我们尽可能的提示出正确命令

```JavaScript
> node .\index.js cre
发生错误!
是指 create?
```



### 解析与合并环境变量

`.parse([args], [context], [parseCallback])`

```JavaScript
  const context = {
    cliVersion: pck.version
  };
  
  cli
    .parse(process.argv.slice(2), content)
```


```JavaScript
> node .\index.js init      
项目开始初始化... 
{ _: [ 'init' ], cliVersion: '0.0.0', '$0': 'index.js' }
```



## 总结

以上就是 Yargs 的基本使用，利用 Yargs ， 可以节省我们很大的时间，不需要自己手写这些功能，让我们能够快速生成一些命令以及解析出命令行参数

