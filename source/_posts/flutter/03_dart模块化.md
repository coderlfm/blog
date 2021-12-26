---
title: dart 中的 模块化
date: 2021-12-26 14:24:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---
dart 中的 模块化
 
<!-- more -->


`dart` 中一个文件就是一个模块

在 `class`中可以通过给成员属性添加 `_`前缀来表示是私有成员



## import

通过 `import 'xxxx';` 进行导入，默认或导入模块内的所有公共属性和方法

`dart:core` 核心库不需要手动导入，如 `print` 方法，其它方法需要导入



```Dart
 import 'dart:math';
 print(max(10, 20));

```




## as

可以通过 `as` 给导入的库起别名

```Dart
import 'dart:math' as Math；

print(Math.max(10, 20));
```




## show/hide

`show/hide`可以显式指定导入和隐藏

```Dart
import 'dart:math' show max hide min;

print(max(10, 20));

```




## export

通过 `export`关键进行导出

自定义模块统一导出

```Dart
// 01.dart

void sum01() {
  print('sum01');
}


// 02.dart

void sum02() {
  print('sum02');
}

// index.dart

export './01.dart';
export './02.dart';

```


```Dart
import 'module/index.dart';

sum01();
sum02();

```




## 本地模块

本地模块导入可以通过以下两种方式导入，编辑器自动导入时会以第一种方式导入



方式一

```Dart
import 'package:project/pages/detail.dart';

```




方式二 (通过相对路径的方式导入)

```Dart
import './project/pages/detail.dart';
```


## 第三方库

1. [https://pub.dev](https://pub.dev) 搜索第三方库(类似前端的npmjs.com)
2. 添加到项目根目录下的`pubspec.yaml`的依赖列表中
3. 执行 `pub get` 命令拉去依赖(和 npm install 类似)



### 导入第三方库

```Dart
import 'package:xxx/yyy.dart'
```




