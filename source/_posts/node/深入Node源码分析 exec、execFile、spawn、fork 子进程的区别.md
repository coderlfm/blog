---
title: 深入Node源码分析 exec、execFile、spawn、fork 子进程的区别
date: 2021-8-6 11:14:10
toc: true
cover: /cover-imgs/node-2.png
tags:
- Node
categories: 
- [Node ]
---

深入 Node 源码分析  exec、execFile、spawn、fork  子进程的区别

<!-- more -->

## readline 源码调用栈流程图
首先奉上几张源码调用栈流程图
### 完整源码调用栈图

图片放大后看的更清晰
![](</image/node/深入node源码分析exec、execFile、spawn区别/node%20%E5%A4%9A%E8%BF%9B%E7%A8%8B%20%E6%B5%81%E7%A8%8B%E5%9B%BE%20(2).svg>)
### 异步回调流程

当所有的同步代码运行完成时候，会开始执行异步回调

异步回调的流程如下

![](/image/node/深入node源码分析exec、execFile、spawn区别/Snipaste_2021-08-06_08-10-57.png)

![](/image/node/深入node源码分析exec、execFile、spawn区别/Snipaste_2021-08-06_08-15-52.png)



## 认识 child_process

`node` 内置了一个 `child_process` 模块，通过该模块可以衍生出子进程，让子进程来帮助我们做一些其他的操作，有关 child_process 的更多信息，可以查看 [这里](http://nodejs.cn/api/child_process.html#child_process_child_process)

本篇主要分析以下几个 `child_process` 中的方法

- exec

- execFile

- spawn

- fork

## 准备

通过以下简单示例，来深入 Node 源码，分析整个运行机制

```JavaScript
const cp = require('child_process');

cp.exec('ls', (err, stdout, stderr) => {
  console.log('callback start ------------');
  console.log(err, stdout, stderr);
  console.log('callback end ------------');
})
```

## exec 源码

首先进入到 exec 源码中，可以看到 exec 的源码内容很少，它主要会做以下两件事

1. 标准化参数

2. 调用 `execFile`

也就是说，其实 `exec` 其实是对 `execFile` 进行了封装

```JavaScript
function exec(command, options, callback) {
  const opts = normalizeExecArgs(command, options, callback);
  return module.exports.execFile(opts.file,
                                 opts.options,
                                 opts.callback);
}
```

### normalizeExecArgs (对 exec 进行参数标准化)

`normalizeExecArgs` 会做以下几件事

1. 对可选参数 `options` 做兼容，如果第二个参数传的是 `function`，则两个参数交换位置

2. 如果没有手动指定 `shell`则会赋值为 `true`，后面运行的时候，会根据平台默认选择，Unix 上是 `'/bin/sh'`，Windows 上是 `process.env.ComSpec`

3. 返回一个处理后的对象

```JavaScript
function normalizeExecArgs(command, options, callback) {

  // 如果第二个参数是函数，则第二个参数和第三个参数交换位置，兼容参数
  if (typeof options === 'function') {
    callback = options;
    options = undefined;
  }

  // 做一个浅拷贝，这样我们就不会破坏用户的选项对象。
  // Make a shallow copy so we don't clobber the user's options object.
  options = { ...options };
  // shell 如果没传，默认会是true，如果传了则是用户传的值
  options.shell = typeof options.shell === 'string' ? options.shell : true;

  // 将 command设置为 赋值为 file，为调用 execFile做准备
  return {
    file: command,
    options: options,
    callback: callback
  };
}
```

## execFile (源码)

`exec` 对参数进行简单处理后就交给了 `execFile`

简单看下一 `execFile` ，可以看到 execFile 其实只接收了第一个参数，其它参数是通过 arguments 来获取的， `execFile` 主要做了以下几件事

1. 对参数进行校验

2. 生成 `options`

3. 调用 `spawn`

4. 注册 `close`和 `error` 事件

所以，可以看到 `execFile` 底层是调用了 `spawn` ，然后注册了 `close` 和 `error` 回调，看到这里的时候，如果我们了解过 spawn 的话，会知道`spawn` 是没有回调的，这就意味着，`execFeile` 其实是对 `sapwn` 进行了一次封装。

```JavaScript
// 只接收了一个参数，剩下的参数通过 arguments 来获取
function execFile(file /* , args, options, callback */) {
  let args = [];
  let callback;
  let options;

  // Parse the optional positional parameters.
  let pos = 1;

  // 判断是否传入了命令参数
  if (pos < arguments.length && ArrayIsArray(arguments[pos])) {
    args = arguments[pos++];
  } else if (pos < arguments.length && arguments[pos] == null) {
    pos++;
  }

  // 判断是否传入了 options
  if (pos < arguments.length && typeof arguments[pos] === 'object') {
    options = arguments[pos++];
  } else if (pos < arguments.length && arguments[pos] == null) {
    pos++;
  }

  // 判断是否传入回调
  if (pos < arguments.length && typeof arguments[pos] === 'function') {
    callback = arguments[pos++];
  }

  // 如果参数传错，则抛错
  if (!callback && pos < arguments.length && arguments[pos] != null) {
    throw new ERR_INVALID_ARG_VALUE('args', arguments[pos]);
  }

  // 生成 options，默认 会覆盖 shell
  options = {
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: MAX_BUFFER,
    killSignal: 'SIGTERM',
    cwd: null,
    env: null,
    shell: false,
    ...options
  };

  // 一系列验证，是否 数字
  // Validate the timeout, if present.
  validateTimeout(options.timeout);

  validateMaxBuffer(options.maxBuffer);

  validateAbortSignal(options.signal, 'options.signal');

  // 操作系统相关
  options.killSignal = sanitizeKillSignal(options.killSignal);

  // 开始执行 spawn
  const child = spawn(file, args, {
    cwd: options.cwd,
    env: options.env,
    gid: options.gid,
    uid: options.uid,
    shell: options.shell,
    windowsHide: !!options.windowsHide,
    windowsVerbatimArguments: !!options.windowsVerbatimArguments
  });

  let encoding;  // 字符编码 默认 utf-8

  // 用来记录所有的输出和错误流，最后一次性输出
  const _stdout = [];
  const _stderr = [];

  if (options.encoding !== 'buffer' && Buffer.isEncoding(options.encoding)) {
    encoding = options.encoding;
  } else {
    encoding = null;
  }

  // 记录输出流和错误流的长度，用来判断是否超过maxBuffer
  let stdoutLen = 0;
  let stderrLen = 0;

  let killed = false;
  let exited = false;
  let timeoutId;

  let ex = null;

  let cmd = file;

  // 退出事件回调
  function exithandler(code, signal) {
    ...
  }

  // 错误事件回调
  function errorhandler(e) {
    ...
  }

  function kill() {
    ...
  }

  function abortHandler() {
    if (!ex)
      ex = new AbortError();
    process.nextTick(() => kill());
  }

  // 校验是否有 timeout
  if (options.timeout > 0) {
    ...
  }
  if (options.signal) {
    ...
  }

  // 是否有输出流
  if (child.stdout) {
    ...
  }

  // 对错误流的处理同上
  if (child.stderr) {
    ...
  }

  // 另外添加了 close 和 error 的事件监听
  child.addListener('close', exithandler);
  child.addListener('error', errorhandler);

  return child;
}
```

## spawn 源码

`spawn` 是没有回调的，它返回的是流，那这个流是怎么来的呢，来看 `spawn` 的源码，`spawn` 的源码其实很少

1. 创建子进程且注册 `exit` 回调

2. `normalizeSpawnArguments()` 对参数进行了，且对不同操作系统进行了命令兼容

3. 调用 `child.spawn(options)` ，内部执行了子进程

```JavaScript
function spawn(file, args, options) {
  // 通过 new ChldProcess 内部创建子进程，
  const child = new ChildProcess();

  // 对参数进行校验
  options = normalizeSpawnArguments(file, args, options);

  // 将参数传给子进程
  child.spawn(options);

  // 返回流对象
  return child;
}
```

### ChildProcess (创建子进程)

在 `ChildProcess` 中创建了子进程且注册了关闭的回调

这里指的注意的是，关闭回调中会做哪些事

1. 关闭输出流

2. 关闭进程

3. 判断是否发生错误

&ensp;&ensp;&ensp;&ensp;1. 发生错误则发出 `error` 事件(`this.emit('error', err)`)

&ensp;&ensp;&ensp;&ensp;2. 没有发生错误则发出 `exit` 事件(`this.emit('exit')`)

4. 调用 `maybeClose()`，子进程的每一个流(子进程会创建**3** 个流，在下面会讲到) 在关闭时都会调用 `maybeClose()`, 当调用过**3** 次后，会发出 `close` 事件，表示子进程关闭

```JavaScript
...省略

// 创建子进程
this._handle = new Process();
this._handle[owner_symbol] = this;

// 注册进程的关闭回调
this._handle.onexit = (exitCode, signalCode) => {
  if (signalCode) {
    this.signalCode = signalCode;
  } else {
    this.exitCode = exitCode;
  }

  if (this.stdin) {
    // 关闭输入流
    this.stdin.destroy();
  }

  // 执行进程的 close
  this._handle.close();
  this._handle = null;  //将对象置空，以更好的进行垃圾回收

  // 校验是否发生错误
  if (exitCode < 0) {
    const syscall = this.spawnfile ? 'spawn ' + this.spawnfile : 'spawn';
    const err = errnoException(exitCode, syscall);

    if (this.spawnfile)
      err.path = this.spawnfile;

    err.spawnargs = this.spawnargs.slice(1);
    this.emit('error', err);
  } else {
    // 发出进程的 exit 事件
    this.emit('exit', this.exitCode, this.signalCode);
  }

  // 在下一个事件循环将还在缓存区的内容输出掉
  process.nextTick(flushStdio, this);

  // 调用 maybeClose
  maybeClose(this);
};
```

### normalizeSpawnArguments

这里我们看 `normalizeSpawnArguments` 在处理系统兼容的部分源码

判断操作系统，这里也对应了在 Node 文档中所说

> 在 Unix 上使用 `'/bin/sh'`，在 Windows 上使用 `process.env.ComSpec`

```JavaScript
if (options.shell) {
  // 将命令 和 命令参数(没传就是一个空数组)通过空串进行拼接
  const command = [file].concat(args).join(' ');

  // 判断操作系统
  if (process.platform === 'win32') {
    if (typeof options.shell === 'string')
      file = options.shell;
    else
      file = process.env.comspec || 'cmd.exe';   // 获取到用户 cmd 的位置 'C:\\Windows\\system32\\cmd.exe'

    // '/d /s /c' 仅用于 cmd.exe。
    if (/^(?:.*\\)?cmd(?:\.exe)?$/i.test(file)) {
      args = ['/d', '/s', '/c', `"${command}"`];
      windowsVerbatimArguments = true;
    } else {
      args = ['-c', command];
    }
  } else {
    if (typeof options.shell === 'string')
      file = options.shell;
    else if (process.platform === 'android')    // 安卓
      file = '/system/bin/sh';
    else
      file = '/bin/sh';                         // unix
    args = ['-c', command];
  }
}

```

## child.spawn(options) (执行子进程)

`child.spawn(options)` 实际上调用的是 `ChildProcess` 原型上的 `spawn`方法`(ChildProcess.prototype.spawn)`

主要会做以下几件事

1. 拿到 `stdio`，如果不传默认会取到 `'pipe'`

2. 调用 `getValidStdio` 创建管道，拿到创建一个管道数组 `[输入流，输出流，错误流]`

3. 拿到 `command`，拿到 `args`

4. 调用 `this._handle.spawn(options)` **执行子进程**

5. 遍历 `stdio` 管道数组，为 **可读流** 和 **错误流** 注册`close` 回调

6. 如果 `ipc` 不为空，则调用 `setupChannel()` 创建 `ipc`通道，让两个进程进行通信，(`fork`)会需要

这里指的注意的是 `this._handle.spawn(options)` 内部是通过调用 `C++` 的代码来执行进程的，如果需要了解的话，需要查看到对应的 `C++` 文件中

```JavaScript
ChildProcess.prototype.spawn = function(options) {
  let i = 0;

  if (options === null || typeof options !== 'object') {
    throw new ERR_INVALID_ARG_TYPE('options', 'Object', options);
  }

  // stdio 默认为 pipe
  let stdio = options.stdio || 'pipe';

  // 创建管道
  stdio = getValidStdio(stdio, false);

  const ipc = stdio.ipc;
  const ipcFd = stdio.ipcFd;
  stdio = options.stdio = stdio.stdio;

  ...

  this.spawnfile = options.file;      // 拿到命令执行器 'C:\\Windows\\system32\\cmd.exe'

  if (ArrayIsArray(options.args))
    this.spawnargs = options.args;    // 拿到命令 [ "C:\\Windows\\system32\\cmd.exe","/d", "/s", "/c","\"ls\"",]
  else if (options.args === undefined)
    this.spawnargs = [];
  else
    throw new ERR_INVALID_ARG_TYPE('options.args', 'Array', options.args);

  // 开始创建子进程 -> C++; 会返回一个错误码
  const err = this._handle.spawn(options);

  ...

  // 取到 pid
  this.pid = this._handle.pid;

  // 遍历 stdio 数组，创建 socket， 给输出流和错误流添加 close 监听
  for (i = 0; i < stdio.length; i++) {
    const stream = stdio[i];
    if (stream.type === 'ignore') continue;

    if (stream.ipc) {
      this._closesNeeded++;
      continue;
    }

    if (stream.type === 'wrap') {
      ...
    }

    if (stream.handle) {
      // 创建 cocket
      // 内部监听了
      // i === 0 表示这是一个可写流
      stream.socket = createSocket(this.pid !== 0 ?
        stream.handle : null, i > 0);

      // 并且给 输出流和错误流添加 close 监听
      // 并且调用 maybeClose
      if (i > 0 && this.pid !== 0) {
        this._closesNeeded++;
        stream.socket.on('close', () => {
          maybeClose(this);
        });
      }
    }
  }

  // 拿到三个流 输入流，输出流，错误流
  this.stdin = stdio.length >= 1 && stdio[0].socket !== undefined ?
    stdio[0].socket : null;
  this.stdout = stdio.length >= 2 && stdio[1].socket !== undefined ?
    stdio[1].socket : null;
  this.stderr = stdio.length >= 3 && stdio[2].socket !== undefined ?
    stdio[2].socket : null;

  this.stdio = [];
  // 将三个流都存储到 this.stdio 数组中
  for (i = 0; i < stdio.length; i++)
    this.stdio.push(stdio[i].socket === undefined ? null : stdio[i].socket);

  // 添加 .send() 方法并开始监听 IPC 数据 使用 fork 的时候会用到
  if (ipc !== undefined) setupChannel(this, ipc, serialization);

  return err;
};
```

### getValidStdio (给流创建管道)

这一步主要会做以下几件事

1. 将 `stdio` 转换为数组 `'pipe'` → `['pipe', 'pipe', 'pipe']`([输入流，输出流，错误流])

2. 遍历 `stdio`，给每个流都创建一个管道

```JavaScript
function getValidStdio(stdio, sync) {
  let ipc;
  let ipcFd;

  if (typeof stdio === 'string') {
    // 将其转换为数组，如 ['pipe', 'pipe', 'pipe']
    stdio = stdioStringToArray(stdio);
  } else if (!ArrayIsArray(stdio)) {
    throw new ERR_INVALID_OPT_VALUE('stdio', stdio);
  }

  while (stdio.length < 3) stdio.push(undefined);

  // 对 stdio 进行遍历，将stdio转换为c++可读的形式(例如PipeWraps或fds)
  stdio = stdio.reduce((acc, stdio, i) => {
    function cleanup() {
      for (let i = 0; i < acc.length; i++) {
        if ((acc[i].type === 'pipe' || acc[i].type === 'ipc') && acc[i].handle)
          acc[i].handle.close();
      }
    }

    // Defaults
    if (stdio == null) {
      stdio = i < 3 ? 'pipe' : 'ignore';
    }

    // 会根据不同的 stdio 类型来建立管道
    if (stdio === 'ignore') {         // ignore 不会有输出流，一般用于静默执行
      acc.push({ type: 'ignore' });
    } else if (stdio === 'pipe' || (typeof stdio === 'number' && stdio < 0)) {

      // 每一个流对象，输入流可读，输出流和错误流可写
      const a = {
        type: 'pipe',
        readable: i === 0,
        writable: i !== 0
      };

      // 给每一个流对象建立管道
      if (!sync)
        a.handle = new Pipe(PipeConstants.SOCKET);

      acc.push(a);
    } else if (stdio === 'ipc') {
      if (sync || ipc !== undefined) {
        // Cleanup previously created pipes
        cleanup();
        if (!sync)
          throw new ERR_IPC_ONE_PIPE();
        else
          throw new ERR_IPC_SYNC_FORK();
      }

      ipc = new Pipe(PipeConstants.IPC);
      ipcFd = i;

      acc.push({
        type: 'pipe',
        handle: ipc,
        ipc: true
      });
    } else if (stdio === 'inherit') {
      acc.push({
        type: 'inherit',
        fd: i
      });
    } else if (typeof stdio === 'number' || typeof stdio.fd === 'number') {
      acc.push({
        type: 'fd',
        fd: typeof stdio === 'number' ? stdio : stdio.fd
      });
    } else if (getHandleWrapType(stdio) || getHandleWrapType(stdio.handle) ||
               getHandleWrapType(stdio._handle)) {
      const handle = getHandleWrapType(stdio) ?
        stdio :
        getHandleWrapType(stdio.handle) ? stdio.handle : stdio._handle;

      acc.push({
        type: 'wrap',
        wrapType: getHandleWrapType(handle),
        handle: handle,
        _stdio: stdio
      });
    } else if (isArrayBufferView(stdio) || typeof stdio === 'string') {
      if (!sync) {
        cleanup();
        throw new ERR_INVALID_SYNC_FORK_INPUT(inspect(stdio));
      }
    } else {
      // Cleanup
      cleanup();
      throw new ERR_INVALID_OPT_VALUE('stdio', stdio);
    }

    return acc;
  }, []);

  // stdio 变为了三个socket 对象的数组
  // ipc 和 ipcFd 为 fork 需要用到
  return { stdio, ipc, ipcFd };
}
```

## createSocket

当创建完 `3`个管道后会走到 `createSocket`

```JavaScript
stream.socket = createSocket(this.pid !== 0 ? stream.handle : null, i > 0);
```

进入到 `createSocket` 源码

可以看到，`createSocket` 的源码非常的简单，只是调用了 `net.Socket()`

```JavaScript
function createSocket(pipe, readable) {
  return net.Socket({ handle: pipe, readable, writable: !readable });
}
```

### net.Socket (创建 socket)

`net` 是 `Node` 内置的一个异步网络模块，而 socket 是该模块中的一个方法

```JavaScript
function Socket(options) {
  if (!(this instanceof Socket)) return new Socket(options);

  ...省略

  if (options.handle) {
    this._handle = options.handle; // private
    this[async_id_symbol] = getNewAsyncId(this._handle);
  } else {
    ...
  }

  // 监听 socket的关闭  onReadableStreamEnd 发出
  this.on('end', onReadableStreamEnd);

  // 监听 socket 的输出
  initSocketHandle(this);

  this._pendingData = null;
  this._pendingEncoding = '';

  ...省略
}
```

#### onReadableStreamEnd

通过 `this.destroy()` 发出 结束事件

```JavaScript
function onReadableStreamEnd() {
  if (!this.allowHalfOpen) {
    this.write = writeAfterFIN;
    if (this.writable)
      this.end();
    else if (!this.writableLength)
      this.destroy();
  } else if (!this.destroyed && !this.writable && !this.writableLength)
    this.destroy();
}
```

#### initSocketHandle

`self._handle.onread = onStreamRead` 为写入时会触发的事件

```JavaScript
function initSocketHandle(self) {
  self._undestroy();
  self._sockname = null;

  if (self._handle) {
    self._handle[owner_symbol] = self;
    self._handle.onread = onStreamRead;
    self[async_id_symbol] = getNewAsyncId(self._handle);

    ...
  }
}
```

在这个事件中，如果监听到输出流会发出 `'data'` 事件，这也是为什么我们监听输出流和错误流的时候要通过 `on('data')` 来监听了，这里具体的源码流程可以看下图

![](/image/node/深入node源码分析exec、execFile、spawn区别/Snipaste_2021-08-05_23-24-30.png)

## 注册 流的 close 回调

当 `socket` 创建完成后，会给 输出流和错误流添加 `close` 回调，回调中会调用 `maybeClose()`

```JavaScript
  stream.socket = createSocket(this.pid !== 0 ? stream.handle : null, i > 0);

  if (i > 0 && this.pid !== 0) {
    this._closesNeeded++;
    stream.socket.on('close', () => {
      maybeClose(this);
    });
  }
```

## 同步代码准备出栈

这些 close 的回调都注册完毕之后，同步的流程基本上就已经完了

从 `child.spawn` 开始出栈

```JavaScript
  this.stdin = stdio.length >= 1 && stdio[0].socket !== undefined ?
    stdio[0].socket : null;
  this.stdout = stdio.length >= 2 && stdio[1].socket !== undefined ?
    stdio[1].socket : null;
  this.stderr = stdio.length >= 3 && stdio[2].socket !== undefined ?
    stdio[2].socket : null;

  this.stdio = [];

  for (i = 0; i < stdio.length; i++)
    this.stdio.push(stdio[i].socket === undefined ? null : stdio[i].socket);

  // Add .send() method and start listening for IPC data
  if (ipc !== undefined) setupChannel(this, ipc, serialization);

  return err;
```

然后到 `spawn`

```JavaScript
function spawn(file, args, options) {
  const child = new ChildProcess();

  options = normalizeSpawnArguments(file, args, options);

  child.spawn(options);

  return child;
}
```

## execFile 注册回调

接着到 `execFile`，在 `execFile` 调用完 `spawn` 后，主要做了四件事情

1. 注册输出流的 `data` 事件

2. 注册错误流的 `data` 事件

3. 注册子进程的 `close` 事件

4. 注册子进程的 `error` 事件

### on('data') 回调

```JavaScript
  const child = spawn(file, args, {
    cwd: options.cwd,
    env: options.env,
    gid: options.gid,
    uid: options.uid,
    shell: options.shell,
    windowsHide: !!options.windowsHide,
    windowsVerbatimArguments: !!options.windowsVerbatimArguments
  });

  ... 省略

  // 注册输出流的 data 事件
  if (child.stdout) {
    if (encoding)
      child.stdout.setEncoding(encoding); // 设置 encoding，默认为 utf-8

    // 添加 data 监听
    child.stdout.on('data', function onChildStdout(chunk) {
      const encoding = child.stdout.readableEncoding;
      const length = encoding ?
        Buffer.byteLength(chunk, encoding) :
        chunk.length;
      stdoutLen += length;

      // 校验是否超过 maxBuffer
      if (stdoutLen > options.maxBuffer) {
        const truncatedLen = options.maxBuffer - (stdoutLen - length);
        _stdout.push(chunk.slice(0, truncatedLen));   // 每次监听到输出都累加

        ex = new ERR_CHILD_PROCESS_STDIO_MAXBUFFER('stdout');
        kill();   //如果超出则直接 杀死这个进程
      } else {
        // 存入 _stdout 数组中
        _stdout.push(chunk);
      }
    });
  }

  // 注册错误流的 data 事件
  if (child.stderr) {
    if (encoding)
      child.stderr.setEncoding(encoding);

    child.stderr.on('data', function onChildStderr(chunk) {
      const encoding = child.stderr.readableEncoding;
      const length = encoding ?
        Buffer.byteLength(chunk, encoding) :
        chunk.length;
      stderrLen += length;

      if (stderrLen > options.maxBuffer) {
        const truncatedLen = options.maxBuffer - (stderrLen - length);
        _stderr.push(chunk.slice(0, truncatedLen));

        ex = new ERR_CHILD_PROCESS_STDIO_MAXBUFFER('stderr');
        kill();
      } else {
        _stderr.push(chunk);
      }
    });
  }

  child.addListener('close', exithandler);
  child.addListener('error', errorhandler);

  return child;
```

这里我们需要关注的是 `stdout` 和`stderr` 的`on('data')` 事件处理是类似的

这里面每次接收到流的输出时会先判断加上这次的输出是否有超过 `maxBuffer`(默认值 1024 \* 1024)，如果超过则会 `kill` 掉子进程

另外一个是 `_stdout.push(chunk)`，这个`_stdout`是之前定义的一个数组，每次监听到 输出流的信息，他都会`push`进去，最后一次性进行返回，这也是为什么说 `exec`和`execFile` 不太适合做一些耗时较长的任务，因为在任务没有结束前，它不会有任何输出

### close 回调

这里还需要注意 `close` 回调，因为这里才是真正执行我们 `callback` 的地方

主要做以下几件事

1. 判断是否有传 `callback`

2. 取到所有输出流

3. 取到所有错误流

4. 判断是否有错误

&ensp;&ensp;&ensp;&ensp;1. 无：调用 `callback(null, stdout, stderr)`， `err` 为 `null`

&ensp;&ensp;&ensp;&ensp;2. 有：调用 `callback(ex, stdout, stderr)`， `err` 为 `cmd` + 错误流

```JavaScript
 function exithandler(code, signal) {
    if (exited) return;
    exited = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (!callback) return; //如果没有callback则 return

    // merge chunks
    let stdout;
    let stderr;
    if (encoding ||
      (
        child.stdout &&
        child.stdout.readableEncoding
      )) {
      stdout = _stdout.join('');    // 取到所有输出流
    } else {
      stdout = Buffer.concat(_stdout);
    }
    if (encoding ||
      (
        child.stderr &&
        child.stderr.readableEncoding
      )) {
      stderr = _stderr.join('');    // 取到所有错误流
    } else {
      stderr = Buffer.concat(_stderr);
    }

    if (!ex && code === 0 && signal === null) {
      // 调用 callback，这个callback 就是我们在外面调用 exec 和 execFile 写的 callback
      callback(null, stdout, stderr);
      return;
    }

    if (args.length !== 0)
      cmd += ` ${args.join(' ')}`;

    if (!ex) {
      // eslint-disable-next-line no-restricted-syntax
      ex = new Error('Command failed: ' + cmd + '\n' + stderr);
      ex.killed = child.killed || killed;
      ex.code = code < 0 ? getSystemErrorName(code) : code;
      ex.signal = signal;
    }

    ex.cmd = cmd;
    callback(ex, stdout, stderr);
  }
```

