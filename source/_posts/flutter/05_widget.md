---
title: flutter 组件
date: 2022-01-05 17:00:10
toc: true
tags:
- Flutter
- Dart

categories:
- Flutter
- Dart

cover: /cover-imgs/dart2.png
---
flutter 基本组件，`StatelessWidget` 和 `StatefulWidget`的基本使用
 
<!-- more -->


`android/ios` 命令式编程

`vue/react` 声明式编程 只处理状态，状态改变页面自动更新

`flutter` 中，所有的 `widget` 都不能写状态



## 基础组件

- `Column()` 子元素过多，超出安全区域，需要将其改成 `List` 让它可滚动，侧轴会默认居中
- `SizeBox()` 调整间距 `SizeBox(height: 10)`
- `Image.network()` 加载网络图片
- `Icon`
- `RaisedButton` → `ElevatedButton`  按钮将 `RaisedButton` 该为 `ElevatedButton`组件  
- `Container()` 布局容器/类似于前端的`div`
	- `margin`
	- `padding` : `EdgeInsets.all(10)`
	- `decoration` : `Boxdecoration(border: Border.all(width:5, color))`



## 无状态组件 StatelessWidget

`StatelessWidget`是 `immutable`的，类所有的属性必须是 `final`声明的，所有不可变

```Dart
class HomeContent extends StatelessWidget {
  const HomeContent({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container();
  }
}

```




```Dart
class HomeContent extends StatelessWidget {
  const HomeContent({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        HomeItem('标题', '描述',
            'https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp'),
        HomeItem('标题', '描述',
            'https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp'),
        HomeItem('标题', '描述',
            'https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp'),
        HomeItem('标题', '描述',
            'https://i0.hdslb.com/bfs/sycp/creative_img/202112/0e2bd46d2c068ce3066ad3a349b9bdbd.jpg'),
        HomeItem('标题', '描述',
            'https://i0.hdslb.com/bfs/feed-admin/dc3bd50b91e867972852f08756243de860775097.jpg@336w_190h_1c.webp'),
      ],
    );
  }
}

class HomeItem extends StatelessWidget {
  final String title;
  final String desc;
  final String url;

  const HomeItem(this.title, this.desc, this.url, {Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration:
      BoxDecoration(border: Border.all(width: 10, color: Colors.green)),
      padding: EdgeInsets.all(10),
      margin: EdgeInsets.symmetric(vertical: 5),
      child: Column(
        children: [
          Text(title, style: TextStyle(fontSize: 20, color: Colors.red),),
          Text(desc),
          SizedBox(height: 10,),
          Image.network(url)
        ],
      ),
    );
  }
}

```






## 有状态组件 StatefulWidget

`StatefulWidget` 可以通过 `widget.xxx`来获取传入的参数

```Dart
class HomeContent extends StatefulWidget {
  const HomeContent({Key? key}) : super(key: key);

  @override
  _HomeContentState createState() => _HomeContentState();
}

class _HomeContentState extends State<HomeContent> {
  @override
  Widget build(BuildContext context) {
    return Container();
  }
}
```




```Dart
class HomeStatefulWidget extends StatefulWidget {
  const HomeStatefulWidget({Key? key}) : super(key: key);

  @override
  _HomeStatefulWidgetState createState() => _HomeStatefulWidgetState();
}

class _HomeStatefulWidgetState extends State<HomeStatefulWidget> {
  int _counter = 0;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton(
                style: ButtonStyle(backgroundColor: MaterialStateColor.resolveWith((states) => Colors.red)),
                onPressed: () {
                  setState(() => _counter--);
                },
                child: Icon(Icons.exposure_minus_1)),
            ElevatedButton(
                style: ButtonStyle(backgroundColor: MaterialStateColor.resolveWith((states) => Colors.green)),
                onPressed: () {
                  setState(() => _counter++);
                },
                child: Icon(Icons.add))
          ],
        ),
        Text('当前计数$_counter')
      ],
    );
  }
}
```




## StatefulWidget 生命周期

`setState`每次调用都会调用 `build`

```Dart
import 'package:flutter/material.dart';

main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    return Scaffold(
      appBar: AppBar(
        title: Text('第一个 flutter 程序'),
      ),
      // body: HomeContent(),
      body: HomeStatefulWidget(),
    );
  }
}

class HomeStatefulWidget extends StatefulWidget {
  const HomeStatefulWidget({Key? key}) : super(key: key);

  @override
  _HomeStatefulWidgetState createState() => _HomeStatefulWidgetState();
}

class _HomeStatefulWidgetState extends State<HomeStatefulWidget> {
  int _counter = 1;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _counter == 1 ? Test1() : Test2(),
        ElevatedButton(
            onPressed: () {
              setState(() {
                _counter = _counter == 1 ? 2 : 1;
              });
            },
            style: ButtonStyle(
              shape: MaterialStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(10))),
            ),
            child: Text('切换'))
      ],
    );
  }
}

class Test1 extends StatefulWidget {
  const Test1({Key? key}) : super(key: key);

  @override
  _Test1State createState() => _Test1State();
}

class _Test1State extends State<Test1> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print('Test1 instate');
  }


  @override
  void didUpdateWidget(covariant Test1 oldWidget) {
    // TODO: implement didUpdateWidget
    super.didUpdateWidget(oldWidget);
    print('Test1 didUpdateWidget');

  }

  @override
  void didChangeDependencies() {
    // TODO: implement didChangeDependencies
    super.didChangeDependencies();
    print('Test1 didChangeDependencies');

  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    print('Test1 dispose');
  }

  @override
  Widget build(BuildContext context) {
    return Text('test1');
  }
}



class Test2 extends StatefulWidget {
  const Test2({Key? key}) : super(key: key);

  @override
  _Test2State createState() => _Test2State();
}

class _Test2State extends State<Test2> {
  @override
  void initState() {
    // TODO: implement initState
    super.initState();
    print('Test2 instate');
  }

  @override
  void didUpdateWidget(covariant Test2 oldWidget) {
    // TODO: implement didUpdateWidget
    super.didUpdateWidget(oldWidget);
    print('Test2 didUpdateWidget');

  }

  @override
  void didChangeDependencies() {
    // TODO: implement didChangeDependencies
    super.didChangeDependencies();
    print('Test2 didChangeDependencies');

  }

  @override
  void dispose() {
    // TODO: implement dispose
    super.dispose();
    print('Test2 dispose');
  }

  @override
  Widget build(BuildContext context) {
    return Text('test2');
  }
}

```




### StatefulWidget 接受的参数在 build 方法中如何获取

每一个 `_state` 有对 `_widget`对引用

`_widget` 也有对 `_state` 的引用



```
  @override
  Widget build(BuildContext context) {
    String name = widget.name;
    
    return Container();
  }
```


