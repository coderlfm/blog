---
title: typeof null === 'object'
date: 2021-09-27 18:02:38
tags:
  - javaScript
categories:
  - javaScript
cover: /cover-imgs/js-2.jpg
---

typeof null === 'object'

<!-- more -->
# typeof null === 'object'

在 `js`中我们使用 `typeof` 关键字来检测 `null` 时会错误的返回 `'object'` 类型，如下所示

```Bash
> typeof null
< 'object'
```



## 原因

`typeof null` 错误是 `JavaScript` 第一个版本的设计，在这个版本中，所有值都是以 `32`位存储的，它由一个 `类型标签(1-3位)` 和值 来组成，**类型标签** 存储在单元的地位中，一共有以下五个类型标签

- `000`：对象

- `1`：整数

- `010`：双精度

- `100`：字符串

- `110`：布尔值


额外需要注意以下两个类型

- `undefined`(JSVAL_VOID) : 是整数 $−2^{30}$ （整数范围之外的数字）。

- `null`(JSVAL_NULL)：是机器码NULL指针。或者：**一个对象类型标记加上一个为零的引用** 。

到这里应该能很明显看出为什么 `null`会返回一个 `object`，以下是 `typeof` 引擎代码

```C
  JS_PUBLIC_API(JSType)
  JS_TypeOfValue(JSContext *cx, jsval v)
  {
      JSType type = JSTYPE_VOID;
      JSObject *obj;
      JSObjectOps *ops;
      JSClass *clasp;

      CHECK_REQUEST(cx);
      if (JSVAL_IS_VOID(v)) {  // (1)
          type = JSTYPE_VOID;
      } else if (JSVAL_IS_OBJECT(v)) {  // (2)
          obj = JSVAL_TO_OBJECT(v);
          if (obj &&
              (ops = obj->map->ops,
               ops == &js_ObjectOps
               ? (clasp = OBJ_GET_CLASS(cx, obj),
                  clasp->call || clasp == &js_FunctionClass) // (3,4)
               : ops->call != 0)) {  // (3)
              type = JSTYPE_FUNCTION;
          } else {
              type = JSTYPE_OBJECT;
          }
      } else if (JSVAL_IS_NUMBER(v)) {
          type = JSTYPE_NUMBER;
      } else if (JSVAL_IS_STRING(v)) {
          type = JSTYPE_STRING;
      } else if (JSVAL_IS_BOOLEAN(v)) {
          type = JSTYPE_BOOLEAN;
      }
      return type;
  }
```



主要关注 (2) 这里会检测该值是否具有对象标记。如果它另外是可调用的 (3) 或其内部属性 [[Class]] 将其标记为函数 (4)，则它是一个函数。否则，它是一个对象。这是`typeof null`产生的结果。


这其实是当时`js`第一版语言的设计失误，只不过后面想要修复的时候可能会影响到很多现有的web应用，以至于一直没有修改 `typeof null` 的返回值


## 原文链接

[https://2ality.com/2013/10/typeof-null.html](https://2ality.com/2013/10/typeof-null.html)


