---
title: 配置 flutter、dart 开发环境
date: 2021-02-02 14:24:10
toc: true
tags:
  - Flutter
  - Dart
  

categories:
  - Flutter
  - Dart

cover: /cover-imgs/dart2.png
---

配置 flutter、dart 开发环境

<!-- more -->

## 1. 配置国内镜像

首先我们需要需要添加两个环境变量，以 windows 为例，mac os 等系统类似

- 右键我的电脑 - 属性 - 高级系统设置 - 环境变量 - 新建
  - PUB_HOSTED_URL: https://pub.flutter-io.cn
  - FLUTTER_STORAGE_BASE_URL: https://storage.flutter-io.cn

{% asset_img pub_hosted_url.png %}

{% asset_img flutter_storage_base_url.png %}
<br/>
<br/>

> 以上镜像为 Flutter 社区镜像，其它更多镜像请 [查看](https://flutter.cn/community/china#%E7%A4%BE%E5%8C%BA%E8%BF%90%E8%A1%8C%E7%9A%84%E9%95%9C%E5%83%8F%E7%AB%99%E7%82%B9)

## 2. 下载 Flutter SDK

下载最新的 [Flutter SDK](https://flutter.cn/docs/development/tools/sdk/releases) 并解压到你想放置的路径中
此处我们的路径为 `C:\flutter\flutter_sdk`

### 3. 将解压后的 flutter sdk 中的 flutter_sdk\bin 目录添加至 环境变量中的 `PATH` 中

{% asset_img save_flutter_path.png %}

## 3. 测试是否配置成功

配置完后在命令行中输入以下命令测试是否配置成功

macOS 也有类似的 `which` 命令

```shell shell
where flutter dart
```

{% asset_img where.png %}

<br/>
<br/>
<article class="message is-warning">
  <div class="message-body">
    <p>
      在 flutter 1.19.0 后的开发版本中，flutter sdk 同时已经内置了 dart 命令，所以我们不需要再单独下载 dart 的 sdk
    </p>
  </div>
</article>
<br/>
<br/>

``` shell shell
flutter doctor
```

执行该命令会对我们现有的环境进行检查，并帮助我们完成一些其它依赖的安装，
{% asset_img doctor.png %}

以上检查报告指出我们没有安装 `Android SDK` 和 `Android Studio` 以及 没有检测到设备


## 4. 安装 Android Studio 
这里我们使用 `Android Studio` 来作为我们的开发工具
下载并安装 [Android Studio](https://android-studio.en.softonic.com/)。

### 4.1 安装 Android SDK 

### 4.2 安装 Flutter、Dart 插件
File - Settings - Plugins


## 5. 配置插件 SDK 
File - Settings - Plugins

报错
### 5.1 安装 Java Sdk 
https://jdk.java.net/ 
此处建议安装 8.0 版本 ，这边测试 jdk 15 重新运行命令后报错
