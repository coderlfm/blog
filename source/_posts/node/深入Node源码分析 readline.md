---
title: 深入Node源码分析 readline
date: 2021-8-11 13:14:10
toc: true
cover: /cover-imgs/node-2.png
tags:
  - Node
categories:
  - [Node]
---

深入 Node 源码分析  readline

<!-- more -->

## readline 源码调用栈流程图

首先先提供两张完整的流程图

### 同步流程图

![](/image/node/深入Node源码分析readline/readline%20%E6%BA%90%E7%A0%81%E6%B5%81%E7%A8%8B%E5%9B%BE_%E5%90%8C%E6%AD%A5.svg)

### 异步回调流程图

![](/image/node/深入Node源码分析readline/readline%20%E6%BA%90%E7%A0%81%E6%B5%81%E7%A8%8B%E5%9B%BE_%E5%BC%82%E6%AD%A5.svg)

## 准备

```JavaScript
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.question('请输入：', answer => {
  console.log(answer);
  rl.close();
})
```

运行以上代码后，会在 终端中出现以下内容，

```JavaScript
请输入：
```

## 同步流程

### createInterface

```JavaScript
function createInterface(input, output, completer, terminal) {
  return new Interface(input, output, completer, terminal);
}
```

### Interface

该方法主要做以下几件事

1. 判断是否通过 **构造函数** 的方式调用，如果不是则强制通过 **构造函数** 的方式调用

2. 调用 `emitKeypressEvents()`

3. **注册 ** `keypress`** 监听，注册 ** `end`** 监听**

&ensp;&ensp;&ensp;&ensp;1. **注册 ** `keypress`** 监听时需要注意，注册完成后判断 是否添加了 ** `newListener`** 监听，如果注册了则会广播一个 ** `newListener`** 事件**

4. 设置成 逐字监听(`this._setRawMode(true)`，这个值默认是 `false` ，逐行监听)

```JavaScript
function Interface(input, output, completer, terminal) {
  if (!(this instanceof Interface)) {
    return new Interface(input, output, completer, terminal);
  }

  ...省略

  FunctionPrototypeCall(EventEmitter, this,);

  ...省略(一系列校验)

  function ondata(data) {
    self._normalWrite(data);
  }

  function onend() {
    if (typeof self._line_buffer === 'string' &&
        self._line_buffer.length > 0) {
      self.emit('line', self._line_buffer);
    }
    self.close();
  }

  function ontermend() {
    if (typeof self.line === 'string' && self.line.length > 0) {
      self.emit('line', self.line);
    }
    self.close();
  }

  // onkeypress 事件监听
  function onkeypress(s, key) {
    self._ttyWrite(s, key);
    if (key && key.sequence) {
      // If the key.sequence is half of a surrogate pair
      // (>= 0xd800 and <= 0xdfff), refresh the line so
      // the character is displayed appropriately.
      const ch = StringPrototypeCodePointAt(key.sequence, 0);
      if (ch >= 0xd800 && ch <= 0xdfff)
        self._refreshLine();
    }
  }

  function onresize() {
    self._refreshLine();
  }

  this[kLineObjectStream] = undefined;

  if (!this.terminal) {
    function onSelfCloseWithoutTerminal() {
      input.removeListener('data', ondata);
      input.removeListener('end', onend);
    }

    input.on('data', ondata);
    input.on('end', onend);
    self.once('close', onSelfCloseWithoutTerminal);
    this._decoder = new StringDecoder('utf8');
  } else {
    // 移除监听
    function onSelfCloseWithTerminal() {
      input.removeListener('keypress', onkeypress);
      input.removeListener('end', ontermend);
      if (output !== null && output !== undefined) {
        output.removeListener('resize', onresize);
      }
    }

    // 调用 emitKeys
    emitKeypressEvents(input, this);

    // 添加 keypress 和 end 监听
    input.on('keypress', onkeypress);
    input.on('end', ontermend);

    // 设置逐行监听
    this._setRawMode(true);
    this.terminal = true;

    // Cursor position on the line.
    this.cursor = 0;

    this.history = [];
    this.historyIndex = -1;

    if (output !== null && output !== undefined)
      output.on('resize', onresize);

    self.once('close', onSelfCloseWithTerminal);
  }

  // Current line
  this.line = '';

  input.resume();
}
```

### emitKeypressEvents

该函数会做以下几件事

1. 调用 `emitKeys(stream)` 函数，然后调用 `next()`，使其停留在 `yield` 的位置，接着继续往下执行

2. 添加 `newListener` 事件监听 (因为 `keypress` 事件需要在当前函数执行完才会注册)

```JavaScript
function emitKeypressEvents(stream, iface = {}) {
  if (stream[KEYPRESS_DECODER]) return;

  stream[KEYPRESS_DECODER] = new StringDecoder('utf8');

  // 初始化触发 generate，返回一个函数，调用 next 使其停留在 yield 的位置
  stream[ESCAPE_DECODER] = emitKeys(stream);
  stream[ESCAPE_DECODER].next();

  const triggerEscape = () => stream[ESCAPE_DECODER].next('');
  const { escapeCodeTimeout = ESCAPE_CODE_TIMEOUT } = iface;
  let timeoutId;

  // onData 事件监听
  function onData(input) {
    if (stream.listenerCount('keypress') > 0) {
      const string = stream[KEYPRESS_DECODER].write(input);
      if (string) {
        clearTimeout(timeoutId);

        // This supports characters of length 2.
        iface._sawKeyPress = charLengthAt(string, 0) === string.length;
        iface.isCompletionEnabled = false;

        let length = 0;
        for (const character of new SafeStringIterator(string)) {
          length += character.length;
          if (length === string.length) {
            iface.isCompletionEnabled = true;
          }

          try {
            // 将这一次 用户输入的字符传入 generate 函数
            stream[ESCAPE_DECODER].next(character);
            // Escape letter at the tail position
            if (length === string.length && character === kEscape) {
              timeoutId = setTimeout(triggerEscape, escapeCodeTimeout);
            }
          } catch (err) {
            // If the generator throws (it could happen in the `keypress`
            // event), we need to restart it.
            stream[ESCAPE_DECODER] = emitKeys(stream);
            stream[ESCAPE_DECODER].next();
            throw err;
          }
        }
      }
    } else {
      // Nobody's watching anyway
      stream.removeListener('data', onData);
      stream.on('newListener', onNewListener);
    }
  }

  // onNewListener 事件处理函数
  function onNewListener(event) {
    if (event === 'keypress') {
      // 发出 监听 data 事件，然后移除掉 newListener
      // 这个事件监听后，命令行会停留在输入的状态
      stream.on('data', onData);
      stream.removeListener('newListener', onNewListener);
    }
  }

  // keypress 需要在第一次当前函数运行完成后才会注册
  if (stream.listenerCount('keypress') > 0) {
    stream.on('data', onData);
  } else {
    // 添加 on newListener 事件
    stream.on('newListener', onNewListener);
  }
}
```

### onNewListener

这里值得关注一下 `onNewListener` ，这个事件监听，会在函数结束后注册 `keypress` 事件的时候触发(使用 on 添加事件的时候最终会判断是否有注册过 `newListener` 事件，如果有，则会触发)，且将 `keypress` 传入进去。

```JavaScript
function onNewListener(event) {
  if (event === 'keypress') {
    // 发出 监听 data 事件，然后移除掉 newListener
    // 这个事件监听后，命令行会停留在输入的状态
    stream.on('data', onData);
    stream.removeListener('newListener', onNewListener);
  }
}
```

### emitKeys

`emitKeys` 主要会做以下几件事

1. 开启 `while(true)` 死循环

2. 通过 `yield` 获取到调用 `next` 时传入的字符，第一次调用时会停留在 `yield` 的位置

3. 把每次传入的字符当做一个对象来处理

4. 对字符进行一系列判断(**下一步骤会具体分析** )

```JavaScript
function* emitKeys(stream) {
  while (true) {
    let ch = yield;
    let s = ch;
    let escaped = false;
    const key = {
      sequence: null,
      name: undefined,
      ctrl: false,
      meta: false,
      shift: false
    };

    ...以下先省略不看
  }
}
```

到 `yield` 的时候其实第一次的同步流程就已经结束了，命令行会等待用户输入。

## 异步流程

异步流程会从用户输入字符开始，当用户在命令行输入字符时

### onData

1. 输入流会广播 `data` 事件(`stream.emit('data', chunk)`)可以在这里先打上断点进行调试

2. 触发 `onData` 事件，然后调用`emitKeys` 的 `next` 方法，将用户输入的字符传入进去

```JavaScript
  try {
    stream[ESCAPE_DECODER].next(character);   // 如用户输入了1
  }
```

### emitKeys

这一次进入到 `emitKeys` 时 `yield` 会接收到用户输入的值

1. 对字符进行一系列校验

2. 广播 `keypress` 事件

```JavaScript
 while (true) {
    let ch = yield;
    let s = ch;
    let escaped = false;
    const key = {
      sequence: null,
      name: undefined,
      ctrl: false,
      meta: false,
      shift: false
    };

    // 判断是否 esc
    if (ch === kEscape) {
      escaped = true;
      s += (ch = yield);

      if (ch === kEscape) {
        s += (ch = yield);
      }
    }

    // 判断时候 f1~ f12 或 insert、 方向键等
    if (escaped && (ch === 'O' || ch === '[')) {
      ...省略
    } else if (ch === '\r') {  // 判断是否换行
      // carriage return
      key.name = 'return';
      key.meta = escaped;
    } else if (ch === '\n') {
      // Enter, should have been called linefeed
      key.name = 'enter';
      key.meta = escaped;
    } else if (ch === '\t') {  // tab 键
      // tab
      key.name = 'tab';
      key.meta = escaped;
    } else if (ch === '\b' || ch === '\x7f') {  // 删除键
      // backspace or ctrl+h
      key.name = 'backspace';
      key.meta = escaped;
    } else if (ch === kEscape) {    // esc键
      // escape key
      key.name = 'escape';
      key.meta = escaped;
    } else if (ch === ' ') {       // 空格键
      key.name = 'space';
      key.meta = escaped;
    } else if (!escaped && ch <= '\x1a') {
      // ctrl+letter
      key.name = StringFromCharCode(
        StringPrototypeCharCodeAt(ch) + StringPrototypeCharCodeAt('a') - 1
      );
      key.ctrl = true;
    } else if (RegExpPrototypeTest(/^[0-9A-Za-z]$/, ch)) {   // 数字和字符串
      // Letter, number, shift+letter
      key.name = StringPrototypeToLowerCase(ch);             // name 转为小写
      key.shift = RegExpPrototypeTest(/^[A-Z]$/, ch);        // 判断是否输入为大写
      key.meta = escaped;
    } else if (escaped) {
      // Escape sequence timeout
      key.name = ch.length ? undefined : 'escape';
      key.meta = true;
    }

    // 取到字符串
    key.sequence = s;

    // 发出 keypress 事件
    if (s.length !== 0 && (key.name !== undefined || escaped)) {
      /* Named character or sequence */
      stream.emit('keypress', escaped ? undefined : s, key);
    } else if (charLengthAt(s, 0) === s.length) {
      /* Single unnamed character, e.g. "." */
      stream.emit('keypress', s, key);
    }
    /* Unrecognized or broken escape sequence, don't emit anything */
  }
```

### onkeypress

调用 `_ttyWrite` 进行写入，准备回显

```JavaScript
  function onkeypress(s, key) {
    self._ttyWrite(s, key);
    // 一般情况下不会进入判断
    if (key && key.sequence) {
      const ch = StringPrototypeCodePointAt(key.sequence, 0);
      if (ch >= 0xd800 && ch <= 0xdfff)
        self._refreshLine();
    }
  }
```

### \_ttyWrite

这个函数其实最主要也是判断用户输入的内容，根据输入的内容做不同的操作

如果输入的是常规的字符，则最后会调用 `this._insertString()` 做写入的操作

``` js
Interface.prototype._ttyWrite = function(s, key) {
  const previousKey = this._previousKey;
  key = key || {};
  this._previousKey = key;


  
  // ctrl + shift
  if (key.ctrl && key.shift) {
    /* Control and shift pressed */
    switch (key.name) {
      // TODO(BridgeAR): The transmitted escape sequence is `\b` and that is
      // identical to <ctrl>-h. It should have a unique escape sequence.
      case 'backspace':
        this._deleteLineLeft();
        break;

      case 'delete':
        this._deleteLineRight();
        break;
    }
  
  } else if (key.ctrl) {       //是否按了 ctrl
    /* Control key pressed */

    switch (key.name) {        // ctrl + c 表示结束
      case 'c':
        if (this.listenerCount('SIGINT') > 0) {
          this.emit('SIGINT');
        } else {
          // This readline instance is finished
          this.close();
        }
        break;
        
      ...省略其它case

    }

  } else if (key.meta) {
    /* Meta key pressed */

    switch (key.name) {
      case 'b': // backward word
        this._wordLeft();
        break;

      case 'f': // forward word
        this._wordRight();
        break;

      case 'd': // delete forward word
      case 'delete':
        this._deleteWordRight();
        break;

      case 'backspace': // Delete backwards to a word boundary
        this._deleteWordLeft();
        break;
    }

  } else {
    /* No modifier keys used */

    // \r bookkeeping is only relevant if a \n comes right after.
    if (this._sawReturnAt && key.name !== 'enter')
      this._sawReturnAt = 0;
    
    // 正常情况下回进到这个 switch
    switch (key.name) {
     
      // 判断是否回车键
      case 'return':  // Carriage return, i.e. \r
        this._sawReturnAt = DateNow();
        this._line();
        break;

      case 'enter':
        // When key interval > crlfDelay
        if (this._sawReturnAt === 0 ||
            DateNow() - this._sawReturnAt > this.crlfDelay) {
          this._line();
        }
        this._sawReturnAt = 0;
        break;

      case 'backspace':
        this._deleteLeft();
        break;

      case 'delete':
        this._deleteRight();
        break;

      case 'left':
        // Obtain the code point to the left
        this._moveCursor(-charLengthLeft(this.line, this.cursor));
        break;

      case 'right':
        this._moveCursor(+charLengthAt(this.line, this.cursor));
        break;

      case 'home':
        this._moveCursor(-Infinity);
        break;

      case 'end':
        this._moveCursor(+Infinity);
        break;

      case 'up':
        this._historyPrev();
        break;

      case 'down':
        this._historyNext();
        break;

      case 'tab':
        // If tab completion enabled, do that...
        if (typeof this.completer === 'function' && this.isCompletionEnabled) {
          const lastKeypressWasTab = previousKey && previousKey.name === 'tab';
          this._tabComplete(lastKeypressWasTab);
          break;
        }
      
      // 当以上都不是时，会进入到这里，基本的字母，数字  
      // falls through
      default:
        if (typeof s === 'string' && s) {
          const lines = StringPrototypeSplit(s, /\r\n|\n|\r/);  // 对字符串进行分割
          for (let i = 0, len = lines.length; i < len; i++) {
            if (i > 0) {
              this._line();
            }
            this._insertString(lines[i]); // 做回显的操作
          }
        }
    }
  }
};

```

### \_insertString

1. 缓存字符串

2. 调用 `this._writeToOutput(c)` 写入

```JavaScript
Interface.prototype._insertString = function(c) {
  if (this.cursor < this.line.length) {
    const beg = StringPrototypeSlice(this.line, 0, this.cursor);
    const end = StringPrototypeSlice(this.line, this.cursor, this.line.length);
    this.line = beg + c + end;
    this.cursor += c.length;
    this._refreshLine();
  } else {

    // 缓存字符串
    this.line += c;
    this.cursor += c.length;

    if (this.getCursorPos().cols === 0) {
      this._refreshLine();
    } else {
      this._writeToOutput(c);
    }
  }
};
```

### \_writeToOutput

1. 判断是否有输入流

2. 调用输出流的 `write` 方法进行写入

```JavaScript
Interface.prototype._writeToOutput = function _writeToOutput(stringToWrite) {
  validateString(stringToWrite, 'stringToWrite');

  // 判断是否有输出流
  if (this.output !== null && this.output !== undefined) {
    // 调用 输出流的 write 方法写入字符串
    this.output.write(stringToWrite);
  }
};
```

异步流程执行到这里就将这一次的字符写入成功了
