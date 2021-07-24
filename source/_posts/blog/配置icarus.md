---
layout: hexo5.0
title: 配置icarus
toc: true
date: 2020-10-28 16:06:33
tags:

cover: cover-imgs/icarus.png
---

icarus 更新 4.0 后根据官网的配置方式会发现还是会有些问题，基于这些问题做了一些记录，看到这边博客的伙伴可以避免踩坑

<!-- more -->

# hexo 5.0 配置 icarus 主题

记一次 hexo 5.0 配置 icarus 的正确方式

## 安装

hexo 5.0 支持 npm 下载
这里使用 npm 方式下载

- 方式一
  使用 git 把项目安装下来

```bash bash
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

- 方式二
  使用 npm 下载

```bash bash
npm install hexo-theme-icarus
```

### 修改主题

在 hexo 项目根目录找到`_config.yml` 并修改 `theme` 为 `icarus`

```yml _config.yml
theme: icarus
```

或者在命令行执行以下命令

```bash bash
hexo config theme icarus
```

## 启动

控制台输入

```bash bash
hexo clean
```

> 输入后会发现控制台报错

```bash bash
INFO  === Checking package dependencies ===
ERROR Package bulma-stylus is not installed.
ERROR Package hexo-renderer-inferno is not installed.
ERROR Please install the missing dependencies your Hexo site root directory:
ERROR npm install --save bulma-stylus@0.8.0 hexo-renderer-inferno@^0.1.3
ERROR or:
ERROR yarn add bulma-stylus@0.8.0 hexo-renderer-inferno@^0.1.3
```

接着在控制台输入

```bash bash
npm install --save bulma-stylus@0.8.0 hexo-renderer-inferno@^0.1.3
```

成功安装后依次运行以下命令

```bash bash
hexo clean
```

```bash bash
hexo g
```

```bash
hexo s
```

运行完在浏览器输入 `http://localhost:4000` 看到以下页面即成功
{% asset_img home.png This is an example image %}
