

content 为 静态目录提供地址，并且会先读取 output中的 path，再读取dev 中的 contentPath
ouput.publicPath 可能会指向 cdn，比如七牛

writeToDisk 为写入硬盘
file-laoder 的配置选项 esModule: false 就可以不用使用 .default 来获取图片
url-loader 小于的话就转成base64，大于的话交给 filte-loader
laoder：loader.raw = true ，得到的是 buffer，否则是一个urf-8字符串

html-loader 解决在 html 的image 标签引入的地址

babel-laoder：提供一个过程管理过程 -> 调用 babel-core
babel-core：把源码转换成 抽象语法树，进行遍历生成
babel-preset-env：把 es6 语法树转成es5 语法树

再把es5 语法树转换成 es5 代码 -> 再次使用 babel-core转换

配置装饰器插件

babel 预设 是多个 插件的集合，
polyfill，使用 第三方

它会根据浏览器的 请求头来动态下发不同的 polyfill，

`polyfill.io/v3` 网站有自己搭建私服的教程

polyfill.io/v3/polyfill.min.js

loader 属性

es-lint-loader 配置

enforce：'pre'  最先执行
options：fix：true，
exclude：/node_modules/
include：

.eslintrc 
需要一个 解析器转换成抽象语法树

babel-eslint来解析

配置不使用 console 等 relus

有时候配置loader报错时，把 use 换成 loader
项目根据 新建 .vscode 然后配置项目自动修复














































