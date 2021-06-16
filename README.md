## 修改 `code` 样式

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
