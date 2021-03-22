---
title: dart 语法三
date: 2021-02-09 18:17:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---

dart语法三
<!-- more -->

## 1. 库/ 模块
在 `dart` 中，一个文件就表示一个库/模块，`dart` 本身给我们内置了一些库 ，[点此查看更多](https://dart.cn/guides/libraries/library-tour)

### 1.1 引用核心库
通过 import 关键字可以引入其他库

``` dart 
import 'dart:math'; // 该示例会全量引入

main(List<String> args) {
  print(max(10, 20));
}

```

### 1.2 引入自定义库
``` dart 
import 'utils/hello.dart';

main(List<String> args) {
  sayHello();
}
```

### 1.3 引入第三方库
``` dart 
import 'package:http/http.dart' as http;

main(List<String> args) async {
  var url = 'https://www.fastmock.site/mock/94a0f2047d1702f65cd162e1a272f080/api/test';
  var response = await http.get(url);
  print('Response status: ${response.statusCode}');
  print('Response body: ${response.body}');
}

```
> 可以通过 import xxx as 的方式来设置库别名
> async await 的语法和 JavaScript 中一致

## mixin 混入
`Mixin` 是一种在多重继承中复用某个类中代码的方法模式。
使用 `with` 关键字并在其后跟上 `Mixin` 类的名字来使用 `Mixin` 模式
该功能类似于 `JavaScript` 里 `Vue` 中的 `mixin`

``` dart
class Person {}

mixin Speck {
  void sayHello() {
    print('hello');
  }
}

class Panent extends Person with Speck {
  @override
  void sayHello() {
    super.sayHello();
  }
}
```


