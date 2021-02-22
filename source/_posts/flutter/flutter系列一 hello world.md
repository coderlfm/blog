---
title: flutter系列一 hello world
date: 2021-02-10 09:36:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---
flutter hello world
<!-- more -->

## 创建 flutter 项目
首先执行以下命令来创建一个基本的 flutter 项目
``` shell shell
flutter create hello_flutter
```
### 使用 Android Studio 打开项目
这里我们使用 `Android Studio` 来打开我们的项目
点击 `open` 然后找到我们刚刚创建的项目目录
{% asset_img open_project.png %}

打开后会发现 我们左侧出现了以下目录
{% asset_img project-menu.png %}

+ .dart_tool 主要是记录 flutter 的版本信息
+ .idea 主要是 Android Studio 是基于 idea 改的，所以会生成一个这个文件
+ android 是安卓端
+ ios 是苹果端
+ lib 是我们写的核心代码，类似于前端项目的 src 目录
+ test 是一些测试相关代码
+ .gitignore 是 git 的忽略文件
+ .metadata 是记录 flutter 版本相关的信息，我们不需要手动修改
+ .packages 是下载包后自动生成的
+ hello_flutter.iml 是一些项目依赖的记录
+ pubspec.lock 是记录当前第三方库的安装版本，类似于前端项目的 package-lock.json
+ pubspec.yaml 是当前项目的一些信息，包含 项目名称，项目依赖等，当我们需要使用第三方库是就需要修改它
+ README.md 项目描述文件
<br/>
<br/>


## 安装开发所需插件
我们在 `Android studio` 开发 flutter 应用的时候需要安装两个插件来是我们开发更编辑
开发工具左上角 `File - settings - plugins` 搜索 `Flutter` 和 `Dart` 并进行安装 
{% asset_img plugins.png %}
<br/>
<br/>


## 运行项目
``` dart
import 'package:flutter/material.dart';

main(){
  runApp(Text('hello world', textDirection:TextDirection.ltr));
}
```
<br/>

1. 在添加完设备后在开发工具顶部的工具栏中选择刚刚添加的设备，添加设备的流程不再赘述
{% asset_img tools1.png %}
<br/>
<br/>

2. 随后点击右侧的 Run 按钮，让我们的 flutter 项目开始运行
{% asset_img tools2.png %}
<br/>
<br/>

3. 运行之后就可以看到在模拟器上面看到内容了
<div style="width:60%;margin:auto">{% asset_img phone1.png %}</div>

> 但是我们会发现文字在屏幕的最左上角，没有关系，后续会解决这个问题

<br/>
<br/>

## 创建一个 Material 风格的项目

### 创建项目
我们可以使用 `MaterialApp` 在项目的最外层，
在home中 为我们需要展示的内容，我们在此使用 `Scaffold` 来帮助我们快速布局
+ `appBar` 为头部区域
+ `body` 为主要内容区域
  - 

``` dart lib/main.dart
import 'package:flutter/material.dart';

main(){
  runApp(
      MaterialApp(
          home: Scaffold(
            appBar: AppBar(
              title: Text('第一个 fulltter app'),
            ),
            body: Container(
              child: Text('hello flutter'),
            ),
          )
      )
  );
}
```

> 以上我们都省略了 new 关键字

### 重新运行
flutter 中有 热重载 和 热重启的概念
+ `Hot Reload` 热重载 主要是会执行 `build` 方法
+ `Hot Restart` 热重启 会重新运行项目
<br/>

{% asset_img terminal1.png %}
<br/>

此处我们需要点击 `Hot Restart` 热重启 即可以看到我们的页面被重新运行
<br/>

{% asset_img phone2.png %}

