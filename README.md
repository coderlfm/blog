# 个人博客
<!-- 记录一些工作及学习上的 -->
🌐[部署地址](http://blog.liufengmao.cn)


<!-- ## 修改 `code` 样式

`node_modules\hexo-theme-fluid\source\css\_pages\_base\base.styl` 29行，将以下代码注释

```styl
code
  color inherit
```
## 添加封面图字段配置
由于之前使用的 `icarus` 主题，配置封面图的配置不一致，为了兼容 `node_modules\hexo-theme-fluid\layout\index.ejs` 中 12行修改为以下
``` exj
  <% var post_url = url_for(post.path), index_img = post.index_img || post.cover || theme.post.default_index_img %>
```

## 自定义 css
在 `cource/css` 下新建 `custom.css`，并新增以下内容

``` css
@font-face {
  font-family: 'JetBrainsMono-Regular';
  src: url(./font/dc4a787d9fe96142a846de9989ca233d.eot);
  src: url(./font/d4ff51ff52d30f839d5be70c33bf872e.woff) format('woff'),
  url(./font/3eacd63796de4b39bc102dae7b143ca5.woff2) format('woff2'),
  url(./font/e1caef645de334fee2f25834b0d03c28.ttf) format('truetype');
}

.markdown-body p, li {
  line-height: 2em;
}

.markdown-body img {
  margin: 0 0 16px !important;
}
.markdown-body code, .markdown-body pre {
  font-family: JetBrainsMono-Regular,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace !important;
}

.code-wrapper pre {
  font-family: JetBrainsMono-Regular,SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace !important;
}

.markdown-body .hljs pre {
  background-color: #282A36 !important;
  /* background-color: #161B22 !important; */
}


.code-wrapper pre .caption {
  color: #fff;
}

``` -->

<!-- ## 适配暗黑模式

https://github.com/ppoffice/hexo-theme-icarus/issues/564

https://github.com/imaegoo/hexo-theme-icarus/tree/night4

1. 将以上的 zip 包下载下来 后直接对 node_modules 中的 `hexo-theme-icarus` 进行合并覆盖

2. 修改 logo

2.1
将 logo 修改为 亮色和 暗黑模式两个不同的 图标

before
``` yml _config.icarus.yml
logo: /images/logo.png
```

after
``` yml _config.icarus.yml
logo:
  light: /images/logo.png
  dark: /images/logo-dark.png
```

屏幕在tablet大小的时候，navbar-menu会变白色，作以下修改即可
在 `node_modules/hexo-theme-icarus/source/css/night.styl` 中的第 62 行 修改成以下代码
```
.navbar，
+ .navbar-menu，
 .card
    background-color：rgba（40,44,52,0 .5）background
    -filter：none
    -webkit-backdrop-filter：none
```

2.2
为了根据系统颜色来动态添加类名以避免 canvas 失效的情况
在 `node_modules/hexo-theme-icarus/source/js/imaegoo/night.js` 中头部新增以下几行代码

同时 给 isNight 新增为以下代码

``` js
   var prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
   if(prefersDarkMode){
        document.body.classList.add('night');
   }

  if(localStorage.getItem('night')){
    var isNight = localStorage.getItem('night')
  }else{
    var isNight = prefersDarkMode ? 'true' : 'false';
  }

```
2.3
修改
`node_modules/hexo-theme-icarus/source/css/night.styl` 中 29 行

``` styl
  background: radial-gradient(1600px at 70% 120%, #202124 10%, #020409 100%)

```

3. 重新打包生成静态文件
 -->
