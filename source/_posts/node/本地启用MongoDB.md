---
title: 本地启用MongoDB
date: 2021-8-09 12:00:10
toc: true
cover: /cover-imgs/mongodb.svg
tags:
  - Node
  - MongoDB
categories:
  - [MongoDB]
---

本地启用MongoDB

<!-- more -->

# 安装MongoDB

[https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) 选择对应的平台，然后下载安装




![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_08-58-48.png)


 




![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-00-12.png)


 

点击 `Browse...` 可以自定义安装位置 




![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-01-25.png)


 




![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-02-34.png)


 




安装完成之后

### 创建数据库目录

在 mongodb 所安装的根目录下 创建 `data` 目录，然后在 `data` 目录里创建 `db` 目录，这个目录需要手动创建，

```Bash
D:\data\db
```



### 通过命令行启动 mongodb

进入到 `mongodb` 安装目录下的bin目录，打开命令行

```Bash
D:\MongoDB\bin>
```


输入以下命令，输入后就启动成功了，启动后，这个命令行窗口不要关闭

```Bash
D:\MongoDB\bin>mongod --dbpath D:\data\db
```




# 安装 Robo 3T

[https://robomongo.org/download](https://robomongo.org/download)  选择 `Download Robo 3T Only` ，然后选择对应的目录安装


## 连接 mongodb

因为刚刚我们在命令行中已经将 `mongodb`开启了，所以我们现在可以来进行连接

安装完成后点击左上角图标，然后在弹出的窗口中点击 `create`(打开时会默认弹出)，创建一个连接

![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-12-07.png)



![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-13-20.png)


默认 端口是 `27017`，我们不需要修改其它的配置，点击 `save`后再点击 `connect`





看到左侧出现这样的标志后表示连接成功





![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-15-27.png)


 



### 创建数据库

点击 `Create Database` ，然后输入数据库名称后创建，就能看见左侧出现了我们刚刚创建的数据库了



![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-22-56.png)



![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-23-111.png)


### 创建 collections

创建完库后，我们需要创建 `collection`，这个概念和关系型数据库中表的概念类似



![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-23-44.png)


![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-24-00.png)


### 插入数据

当创建完 `collection` 后，可以手动往里面插入一下数据，右键刚刚创建的 `collection`，然后选择 `Insert Documents`，往里面填写 `json` 格式的数据



![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-26-51.png)


![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-27-16.png)


即可看到刚刚插入数据成功了

![](/image/node/本地启用MongoDB/Snipaste_2021-08-08_09-27-52.png)

