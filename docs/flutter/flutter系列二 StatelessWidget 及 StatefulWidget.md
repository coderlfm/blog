---
title: flutter系列二 StatelessWidget 及 StatefulWidget
date: 2021-02-20 014:11:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---
StatelessWidget 及 StatefulWidget
<!-- more -->

## Widget
在 flutter 开发中，几乎所有的对象都是一个 `Widget` ，
`Widget` 是一个抽象类，通过调用 `createElemet` 来生成最终的 UI 页面

> 在Flutter开发中，我们一般都不用直接继承Widget类来实现一个新组件，相反，我们通常会通过继承StatelessWidget或StatefulWidget来间接继承Widget类来实现。StatelessWidget和StatefulWidget都是直接继承自Widget类，而这两个类也正是Flutter中非常重要的两个抽象类，它们引入了两种Widget模型，接下来我们将重点介绍一下这两个类。

## StatelessWidget 
StatelessWidget 一般用于不需要维护状态的场景，在前端开发中，我们习惯把页面上展示的数据称之为状态，
``` dart
import 'package:flutter/material.dart';

main(){
  runApp(
      MaterialApp(
          home: Scaffold(
            appBar: AppBar(
              title: Text('第一个 fulltter app'),
            ),
            body: HomePageWidget(),
          )
      )
  );
}

/// StatelessWidget 需要我们实现 build 方法
class HomePageWidget extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return Text('hello flutter');
  }
}

```


### StetefulWidget
实际开发中，涉及到需要修改状态的场景，我们通常都是使用 `StetefulWidget`
``` dart 
/// StatefulWidget 需要我们实现 createState 方法
class HomePageWidget extends StatefulWidget {
  /// 重写 createState 方法
  @override
  _HomePageWidgetState createState() => _HomePageWidgetState();
}

/// State 是一个泛型，并且要继承 StatefulWidget
/// 所以我们给它指定一下泛型
/// 并且该 State 需要我们实现 build 方法
class _HomePageWidgetState extends State<HomePageWidget> {
  /// 此处定义的变量是动态的变量
  int _count = 0;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          RaisedButton(
            onPressed: () {
              /// 数据更改需要调用 setState 方法来使得 widget 的 build 方法重新调用
              setState(() {
                _count++;
              });
            },
            child: Text('+'),
          ),

          /// 使用变量
          Text('$_count')
        ],
      ),
    );
  }
}
```
> createState() 用于创建和Stateful widget相关的状态，它在Stateful widget的生命周期中可能会被多次调用。例如，当一个Stateful widget同时插入到widget树的多个位置时，Flutter framework就会调用该方法为每一个位置生成一个独立的State实例，其实，本质上就是一个StatefulElement对应一个State实例


### StatelessWidget 生命周期
{% asset_img 3-2.jpg %}

## 计数器案例
``` dart 
import 'package:flutter/material.dart';

main() => runApp(MyApp());

class MyApp extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return HomePageWidget();
  }
}

class HomePageWidget extends StatelessWidget{
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return MaterialApp(
        home: Scaffold(
          appBar: AppBar(
            title: Text('第一个 fulltter app'),
          ),
          body: HomeBodyContent(),
        )
    );
  }
}

class HomeBodyContent extends StatefulWidget {
  @override
  _HomeBodyContentState createState() => _HomeBodyContentState();
}

class _HomeBodyContentState extends State<HomeBodyContent> {

  int count = 0;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              RaisedButton(
                  child: Icon(Icons.add),
                  onPressed: () {
                    setState(() {
                      count++;
                    });
                    print('+++');
                  }
              ),
              SizedBox(width: 10,),
              RaisedButton(
                  child: Icon(Icons.delete),

                  onPressed: () {
                    setState(() {
                      count--;
                    });
                    print('---');
                  }
              ),
            ],
          ),
          Text('当前计数：$count')
        ],
      ),
    );
  }
}

```
运行我们的项目即可看到，当我们点击按钮时状态会随之改变
<div style="width:60%;margin:auto">{% asset_img phone1.png %}</div>


> 以上例子中用到了很多其它的 Widget ,这些 Widget 的使用都是比较简单的，可以从 [widget目录](https://flutter.cn/docs/reference/widgets) 中查到使用实例及文档

由于 flutter 中`表现与结构没有分离`，所以我们初次接触会觉得代码嵌套的有点深，后续我们可以对代码进行抽离