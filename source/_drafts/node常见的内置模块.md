---
title: node常见的内置模块
date: 2020-10-31 15:19:27
tags:

---
## path

拼接路径，自动转换路径分隔符
path.resolve()

### 获取路径信息
const filepath = 'User/cc/abc.txt';

#### 获取路径名
path.dirname(filepath); //User/cc

#### 获取文件名
path.basename(filepath);//abc

#### 获取后缀名
path.exname(filepath); //.txt

### 路径拼接
1. path.join()
path.join('/user/cc','abc.txt');

1. path.resolve()
// 如果开头不是 / 的话，会以当前文件的所在目录拼接后面的地址
会左边和右边的拼接，
如果是 / 的话则会以该路径是绝对路径来直接查找
path.resolve('user/cc','abc.txt');

## fs
fs中的方法一般情况下会有三种方法供我们调用，分别是
+ 同步
+ 回调(异步)
+ promise(异步)

以读取文件为例
+ `fs.readFileSync(path[, options])`
+ `fs.readFile(path[, options], callback)`
+ `fsPromises.readFile(path[, options])`

写入文件
`fs.writeFile(file, data[, options], callback)`，默认会重新覆盖原来的内容，是因为 options 中的flag值为 'w'，可改为 'a'则会追加内容['http://nodejs.cn/api/fs.html#fs_file_system_flags']

判断文件是否存在
`fs.existsSync()` 如果路径存在，则返回 true，否则返回 false。

JS 补充
(i +'').padStart(2,0)// 字符不足两位时，补0，

尝试写写 拷贝30个文件的练习


## events
`const EventsEmitter = require('events')`
`const emitter = new EventsEmitter()`
   
### 监听事件
+ `emitter.off(eventName, listener)`
+ `emitter.addListener(eventName, listener)`           // emitter.on(eventName, listener) 的别名。
+ `emitter.once(eventName, listener)`                  //只监听一次
+ `emitter.prependListener(eventName, listener)`       //将该监听放到最前
+ `emitter.prependOnceListener(eventName, listener)`   //将该监听放到最前，并只监听一次

### 发射事件
`emitter.emit(eventName[, ...args])`

### 关闭监听
+ `emitter.removeListener(eventName, listener)`
+ `emitter.off(eventName, listener)`    //emitter.removeListener() 的别名。
+ `emitter.removeAllListeners([eventName])   //该形参为可选参数，并非传入数组，若不传则关闭所有监听

### 其它方法

获取监听的所有事件名
`emitter.eventNames()`

获取指定事件的监听器数量
`emitter.listenerCount(eventName)`
