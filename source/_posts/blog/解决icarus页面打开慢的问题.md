---
title: 解决icarus页面打开慢的问题
date: 2020-10-28 17:46:47
toc: true
tags:

cover: cover-imgs/icarus.png
---

构建完博客后会发现页面打开和刷新很慢，原因是什么

<!-- more -->

# 解决 icarus 引入字体图标超时

上篇文章已经可以访问到主页了，但是会发现主页要等待近半分钟才能显示页面，找了一下，发现是 cdn 引入字体图标的时候请求超时了
{% asset_img network_error.png %}
{% asset_img network_error2.png %}

> 可以看到上面请求 font-awesome 字体图标的时候挂了，既然找到了问题在哪，就好解决了，一步一步找后发现是这个加载是在 hexo-component-inferno 这个包中配置的 cdn 请求地址

- node_modules 中找到 `hexo-component-inferno`
  {% asset_img cdn_setting.png %}

找到后有两种解决方法

1.  直接注释该行

    > 该方法会导致页面无法使用字体图标
    > {% asset_img cdn_setting_new_2.png %}

        1.1 会发现底部的link图标不显示了

    {% asset_img no_icon.png %}

2.  修改 cdn 引用地址
    在 `https://www.bootcdn.cn/`中找到 `font-awesome` 的链接复制下来
    {% asset_img cdn_setting_new.png %}

保存后后依次运行以下命令

```bash bash
hexo clean
```

```bash bash
hexo g
```

```bash bash
hexo s
```

接着在浏览器打开控制台可以看到字体图标已经请求成功了
{% asset_img network_success.png %}
