---
title: 手写实现 call，apply，bind
date: 2021-09-10 09:39:38
tags:
- javaScript
categories:
- javaScript

cover: /cover-imgs/js-2.jpg

---
手写实现简易 call，apply，bind

<!-- more -->

## call

```JavaScript
function foo(param1, param2, param3) {
  console.log('this', this, param1, param2, param3);
}

Function.prototype.myCall = function (thisArg, ...argArray) {
  // 获取到需要重新绑定的 this 对象，如果为空，则默认设置为 window
  thisArg = new Object(thisArg ?? window);

  // 将原来的 方法取到，重新绑定到新的 this 对象上面，再通过新的 this 对象来调用，以实现this的绑定
  thisArg.fn = this;

  // 将剩余参数数组解构传入到原 方法中
  return thisArg.fn(...argArray);
};

foo.call('abc', 10, 20, 30);
foo.myCall('abc', 10, 20, 30);
```



实现效果



![](/image/javascript/手写call/call.png)



 


## apply

```JavaScript
function foo(param1, param2, param3) {
  console.log('this', this, param1, param2, param3);
}

Function.prototype.myApply = function (thisArg, argArray) {
  thisArg = Object(thisArg ?? window);
  thisArg.fn = this;
  return thisArg.fn(...argArray);
};

foo.apply('abc', [10, 20, 30]);
foo.myApply('abc', [10, 20, 30]);

```



实现效果



![](/image/javascript/手写call/apply.png)


 

## bind

```JavaScript
function foo(param1, param2, param3) {
  console.log('this', this, param1, param2, param3);
}

Function.prototype.myBind = function (thisArg, ...argArray) {
  thisArg = Object(thisArg ?? window);
  thisArg.fn = this;

  // 返回一个箭头函数，以实现 bind 后的函数不能再次 bind 其它 this
  // 最终调用的时候讲参数一次性传入
  return (...args) => thisArg.fn(...argArray, ...args);
};

const fnBind = foo.bind('abc', 10).bind('bbb');
fnBind(20, 30);

const fnMyBind = foo.myBind('abc', 10).myBind('bbb');
fnMyBind(20, 30);

```




实现效果

![](/image/javascript/手写call/bind.png)


 




