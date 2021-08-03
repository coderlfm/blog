---
title: Commander 基本使用
date: 2021-08-03 20:30:38
categories:
  - CLI
tags:
  - Commander
cover: /cover-imgs/cli.jpg
---

脚手架开发工具 Commander 的基本使用

<!-- more -->


# Commander 基本使用

```JavaScript
const commander = require('commander');
const pkg = require('../package.json');

const { program } = commander;

  program
    .version(pkg.version)

  program.parse();
```


```Bash
$ node command.js  -V
1.0.0
```



# name

可以用来设置程序的名称

```JavaScript
program
  .name('test-cli')
  .version(pkg.version)
  .parse();
```


可以看到 在 `Usage` 后显示了 程序的名称

```Bash
$ node command.js --help
Usage: test-cli [options]

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```



# usage

用以修改 `Usage` 中的内容

```JavaScript
program
  .name('sunshine-cli-dev')
  .usage('init')
  .version(pkg.version)
  .parse();
```


可以看到下方的 `Usage` 后面的内容变为了我们上方填写的 `init`

```Bash
$ node command.js --help
Usage: test-cli init

Options:
  -V, --version  output the version number
  -h, --help     display help for command

```



# option注册

通过 `option` 注册选项

- 参数一：其中  `'-d, —-debug'`表示可以通过简写 `-d` 和全称 `-—bubug`来指定

&ensp;&ensp;&ensp;&ensp;如果填写了 `<xxx>`(必传参数) 或者 `[xxx]`(可选参数)， 则表示这个 `option` 有参数

- 参数二：`option`的描述

- 参数三：`options`的默认值

```JavaScript
program
  .option('-d, --debug', '开启 debug 模式', false)  // 选项默认值
  .option('-e, --envName <envName>', '环境变量名称') // 选项必传参数
  .parse();

console.log(program.opts());  // 获取所有 options  { debug: true, envName: 'test' }
```



# command 注册命令

通过 `command` 来注册命令

注意：注册命令时不能再继续通过链式调用的方式继续注册

```JavaScript
program
  .name('sunshine-cli-dev')
  .usage('init')
  .version(pkg.version)

program
  .command('clone')                     // 命令名
  .argument('<souce>', '目标源')         // 参数1 必填
  .argument('[destination]', '目标地址') // 参数2 选填
  .description('克隆项目')                    // 描述
  .parse();
```


这样就注册一个简单的命令，查看帮助可以看到还有参数提示

```Bash
$ node command.js --help
Usage: sunshine-cli-dev init

Options:
  -V, --version                          output the version number
  -d, --debug                            开启 debug 模式 (default: false)
  -e, --envName <envName>                环境变量名称
  -h, --help                             display help for command

Commands:
  clone [options] <souce> [destination]  克隆项目
  help [command]                         display help for command
```



## 添加命令的简写方式

以下命令和上述的效果一致

```JavaScript
program
  .command('clone <souce> [destination]')    // 命令
  .parse(); 
```



## 命令的 hooks

`hooks` 一共有两个 `hook`

`preAction` 

`postAction`

```JavaScript
program
  .command('clone')                     // 命令名
  .argument('<souce>', '目标源')         // 参数1 必填
  .argument('[destination]', '目标地址') // 参数2 选填
  .description('克隆项目')                    // 描述
  .option('-f, --force', '强制覆盖')          // 该命令的选项
  .action((souce, destination, objCmd) => {          // 命令处理函数
    console.log('souce:', souce, 'destination:', destination, 'objCmd:', objCmd);
  })
  .hook('preAction', (thisCommand, actionCommand) => {
    // console.log('执行前',thisCommand,actionCommand);
    console.log('执行前');
  })
  .hook('postAction', (thisCommand, actionCommand) => {
    // console.log('执行后',thisCommand,actionCommand);
    console.log('执行后');
  })
```



## 给命令添加 action

上述注册的命令是没有处理函数的，可以通过 `action` 来添加处理函数

其中处理函数的参数位置和注册命令时候填写的参数位置一致，最有一个参数为 `command` 对象

```JavaScript
program
  .command('clone')                     // 命令名
  .argument('<souce>', '目标源')         // 参数1 必填
  .argument('[destination]', '目标地址') // 参数2 选填
  .action((souce, destination, objCmd) => {          // 命令处理函数
    console.log('souce:', souce, 'destination:', destination, 'objCmd:', objCmd);
  })
  .parse(); 
```



# addCommand 注册子命令

```JavaScript
const commander = require('commander');
const pkg = require('../package.json')

const { program } = commander

program
  .name('sunshine-cli-dev')
  .usage('init')
  .version(pkg.version)


const serve = new commander.Command('serve');
serve
  .command('start')
  .argument('<port>', '端口号')
  .action((port) => {
    console.log('服务启动在', port);
  })

serve
  .command('stop')
  .action(() => {
    console.log('服务关闭');
  })

program.addCommand(serve)
program.parse()

```


可以通过 指定命令然后跟上`—-help` 来查看该命令的帮助

```JavaScript
$ node command.js serve --help
Usage: sunshine-cli-dev serve [options] [command]

Options:
  -h, --help      display help for command

Commands:
  start <port>
  stop
  help [command]  display help for command
```



尝试使用一下

```Bash
$ node command.js serve start 3000
服务启动在 3000

$ node command.js serve stop
服务关闭

```



# on 自定义事件监听

可以通过 `on('options:xxx')` 的方式来进行监听

on 会在所有命令处理函数之前，所有可以根据命令来做一些初始化，例如开启 `debug` 模式

```JavaScript
program.on('option:debug', () => {
  console.log('开启 debug 模式', program.opts());
  if (program.opts().debug) {
    process.env.LOG_LEVEL = 'verbose'
  } else {
    process.env.LOG_LEVEL = 'info'
  }
})

```


```Bash
$ node command.js -d
开启 debug 模式 { debug: true }
```



## 通过自定义事件捕捉错误命令

如果所有命令都没有命中，则会来到这个位置

```JavaScript
program.on('command:*', () => {
  const command = program.commands.map(cwd => cwd.name());
  console.log('无效命令', program.commands.map(cwd => cwd.name()));
  console.log('无效命令，请输入以下命令', command);
  process.exitCode = 1;
})
```


```Bash
$ node command.js xxx
无效命令 [ 'clone' ]
无效命令，请输入以下命令 [ 'clone' ]
```



# outputHelp 输出帮助面板

```JavaScript
program.outputHelp()  
```


```Bash
$ node command.js
Usage: sunshine-cli-dev init

Options:
  -V, --version            output the version number
  -d, --debug              开启 debug 模式 (default: false)
  -e, --envName <envName>  环境变量名称
  -h, --help               display help for command
```



# 自定义帮助面板

```JavaScript
program.helpInformation = function () {
  return '自定义帮助信息'
}
```


```Bash
$ node command.js --help
自定义帮助信息
```



