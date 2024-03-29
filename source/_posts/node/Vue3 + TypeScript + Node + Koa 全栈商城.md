---
title: Vue3 + TypeScript + Node + Koa 全栈商城
date: 2021-09-08 11:03:05
toc: true
tags:
- Node
- Vue
categories: 
- [Node ]
- [Vue ]

cover: /cover-imgs/vue-logo.svg

---


使用 `Vue3` + `Node` 开发的全栈商城

<!-- more -->

## 项目描述

包含一个完整的客户端选购商品到购物车再到下单的流程，以及可以在对应的管理后台查看商城的所有用户以及订单等。
整个项目管理端包含一套完整的权限管理功能，其中表单搜索，表格展示，新增，编辑等功能都进行了封装，多个页面可复用

项目一共包含4个端

- 前端商城

- 前端管理后台

- 后端商城接口

- 后端管理后台接口


## 前端商城

### 技术方案

- vue3

- vue-router

- vuex

- typescript

- naive-ui

- tailwindcss


### 主要功能

- 登录/注册

- 轮播/商品选购

- 商品详情

- 搜索商品

  - 根据商品分类搜索

- 购物车

- 账号信息

  - 修改头像

  - 修改昵称/手机号

- 我的地址

  - 添加地址

  - 编辑地址(设为默认地址)

  - 删除地址

- 我的订单

  - 待支付

  - 待发货

  - 已发货

  - 已取消

  - 已完成


## 前端管理后台

### 技术方案

- vue3.2

- vue-router

- vuex

- typescript

- crypto-js

- dayjs

- element-plus

- tailwindcss

- remixicon

### 管理端功能

- 登录校验

- 动态注册路由

- 动态权限路由

- 密码加密

- 配置式组件

- 登录

- 商品管理

  - 添加商品

    - 商品名称

    - 所属分类(多选)

    - 商品原价

    - 商品优惠价

    - 商品库存

    - 商品主图

  - 添加详情图

  - 编辑商品

  - 删除商品

  - 商品上/下架

- 分类管理

  - 添加分类

    - 分类排序

  - 编辑分类

  - 删除分类

- 订单管理

  - 订单搜索

    - id

    - 用户昵称

    - 订单状态

      - 待支付

      - 待发货

      - 已发货

      - 已取消

      - 已完成

    - 物流号

    - 收件人姓名

    - 收件人手机号

  - 订单详情

    - 商品名称

    - 商品价格

    - 商品数量

  - 编辑订单

  - 删除订单

- banner管理

  - 添加banner

    - 关联商品id

  - 编辑banner

  - 删除banner

  - banner启/停用

- 用户管理(客户端用户)

  - 用户搜索

    - 账号

    - 昵称

    - 手机号

  - 编辑用户

  - 删除用户

  - 用户冻结/解冻

- 账号管理(管理端用户)

  - 新增账号

  - 编辑账号

    - 角色分配

  - 删除账号

  - 账号冻结/解冻

  - 重置密码

- 角色管理

  - 新增角色

  - 编辑角色

    - 权限分配(多选)

  - 删除角色

- 权限管理

  - 新增权限

    - 接口地址

    - 权限描述

    - 权限类型

      - 一级菜单

      - 二级菜单

      - 操作(按钮)菜单

    - 权限图标

    - 前端路由路径

    - 后端路由路径

  - 编辑权限

  - 删除权限


## 后端接口

后端接口 商城端 和 管理端部署在同一台服务器，接口文档采用 `apifox` 
<a  href="/assets/mall.html" target="_blank" >接口文档</a>

<iframe src="/assets/mall.html" width="100%" height="1000" name="topFrame" scrolling="yes"  noresize="noresize" frameborder="0" id="topFrame"></iframe>



## 示例

![](/image/node/vue3全栈商城/login.png)

![](/image/node/vue3全栈商城/product.png)

![](/image/node/vue3全栈商城/product-add.png)

![](/image/node/vue3全栈商城/product-freeze.png)

![](/image/node/vue3全栈商城/role.png)

![](/image/node/vue3全栈商城/role-edit.png)

![](/image/node/vue3全栈商城/users.png)

![](/image/node/vue3全栈商城/account.png)

![](/image/node/vue3全栈商城/account-edit.png)

![](/image/node/vue3全栈商城/banner.png)

![](/image/node/vue3全栈商城/order.png)

![](/image/node/vue3全栈商城/order-edit.png)

![](/image/node/vue3全栈商城/order-search.png)

![](/image/node/vue3全栈商城/permission.png)

![](/image/node/vue3全栈商城/permission-edit-menu.png)

### 客户端示例 
部分示例，还有一部分暂时没空截图展示🤫

![](/image/node/vue3全栈商城/Snipaste_2021-10-21_11-32-13.png)

![](/image/node/vue3全栈商城/Snipaste_2021-10-21_11-33-17.png)

![](/image/node/vue3全栈商城/Snipaste_2021-10-21_11-33-50.png)

![](/image/node/vue3全栈商城/Snipaste_2021-10-21_11-34-21.png)

![](/image/node/vue3全栈商城/Snipaste_2021-10-21_11-34-42.png)