toStringTag

##
Object.defineProperty(persion, Symbol.toStringTag, {value:'人'})

console.log(Object.prototype.toString.call(presion  ))

## 手写实现 webpack 模块引入的实现以及缓存


## commonjs 加载 es模块
如果原来是 es6 ，兼容 commonjs

require.r = (exports)=>{
  
}

## es6 模块加载 commonjs
需要通过 n 方法，做一个兼容，判断取到的值是esmodelus === true,来决定取什么

## 总结
common + common 不需要处理
common + es6 es6 需要转换成 common
es6 + es6 es6 都需要转换成 common
es6 + common es6 转换成 common

## 异步代码
import() 异步加载代码原理是 使用 jsonp ，
请求之前 存了一个promise，相应后调用 它的 resolve 方法

## 代码规范

### 良好的 commit 规范

1. 先安装所需插件

+ `commitizen` 是格式化 commit message 的工具
+ `validate-commit-msg` 检查项目 commit message 是否符合格式
+ conventional-changelog-cli 可以从 git metadata 生成变更日志

2. 初始化配置
或者查看 `commitizen` 文档，也可以使用 --yarn

```
commitizen init cz-conventional-changelog --save --save-exact
```
会修改 pageage.json 
 
 husky
 husky 可以把 validate-commit-msg 作为一个 githook 来验证提交信息
  
npm i husky validate-commit-msg --save-dev

package.json 中配置

husky:{
  hooks:{
    commit-msg: "validate-commit-msg"
  }
}

























































