---
title: mysql 常用语句
date: 2021-3-24 10:31:10
toc: true
tags:
- Node
categories: 
- [Node ]
cover: /cover-imgs/mysql.jpg
---

mysql 常用语句

<!-- more -->

## 查看表

```sql
DESC `users`
```

## 创建表

```sql
CREATE TABLE IF NOT EXISTS `users` (
    id INT
)
```

## 常用的存储类型

### 数字类型

- INT 类型
- BIGINT
- FLOAT
- DOUBLE

### 字符串类型

- CHAR 指定长度 -128 127 区间
- VARCHAT 可变长度 0-255 区间
- BINARY
- VARBINARY
- TEXT 超长字符串

### 时间类型

- YEAR 只存储年份 1901 - 2155
- DATE 存储年和月
- TIME 时分秒
- DATETIME 年月日时分秒 '1000-01-01 00:00:00' - '9999-12-31 23:59:59'
- DATESTAMP 年月日时分秒 存储 UTC 内的时间类型 '1970-01-01 00:00:01.000000' - '2038-01-19 03:14:07.999999'

## 表约束

# `PRIMARY KEY` 主键约束

每张表都需要有一个唯一主键，且值为 NOT NULL, 如果设置为 NULL ，默认依旧会设置为 NOT NULL
主键也可以表中的多列索引，被称为联合主键
不建议使用业务上的字段作为唯一主键

```sql
CREATE TABLE IF NOT EXISTS `users` (
    id INT PRIMARY KEY
)
```

# `DEFAULT` 默认值

```sql
CREATE TABLE IF NOT EXISTS `users` (
    id INT,
    mobile INT DEFAULT 0
)
```

# `NOT NULL` 不能为空

```sql
CREATE TABLE IF NOT EXISTS `users` (
    id INT,
    name NOT NULL
)
```

# `AUTO_INCREMENT` 自动递增

```sql
CREATE TABLE IF NOT EXISTS `users` (
    id INT PRIMARY KEY AUTO_INCREMENT
)
```

修改表
ALTER TABLE `user` RENAME TO `user`
ALTER TABLE `user` add `updateTime` TIMESTAMP
修改字段名称
ALTER TABLE `user` CHANGE `phoneNum` `telPhone` VARCHAR(20)
修改字段类型
ALTER TABLE `user` MODIFY `name` VARCHAR(30)
删除表
DROP TABLE table_name ;
ALTER TABLE `user` DROP `age`

根据一个表结构创建一张新的表
CRATE TABLE `user1` LIKE `user`
只会复制内容
CRATE TABLE `user3` (SELECT \* FROM `user`)

对数据库进行增删改
DML

增加

```sql
INSERT INTO `user` (`phone`,`name`) VALUES(100,'lfm')
```

修改

```sql
DEFAULT CURRENT_TIMESTAMP 当前时间
ALTER TABLE `user` MODIFY `name` ON UPDATE CURRENT_TIMESTAMP 更新时间
DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP 不更新时间则为创建时间

```

删除

```sql
DELETE FROM `user`
DELETE FROM `user` WHERE id = 100;// 一个等号
```

更新数据
要加 id

```sql
UPDATE `user` SET `name` = 'lily',`telPhone` = '010-110110' WHERE id = 113
```

### 查询语句

- 准备数据

```sql
SELECT * FROM `prducts`
SELECT title,price FROM `prducts`
```

#### WHERE 查询

```sql
SELECT * FROM `products` WHERE price < 1000;
SELECT * FROM `products` WHERE price = 1500;
SELECT * FROM `products` WHERE price != 1000;
SELECT * FROM `products` WHERE price <> 1000;
```

- 条件判断

- 逻辑运算

```sql
SELECT * FROM `products` WHERE price > 5000 AND title = '华为';
SELECT * FROM `products` WHERE price > 5000 && title = '华为';
SELECT * FROM `products` WHERE title IN ('华为','苹果');

SELECT * FROM `products` WHERE price > 1000 OR title = 'OPPO';
SELECT * FROM `products` WHERE price > 1000 || title = 'OPPO';
```

查询是否为 NULL
查询不为 NULL

```sql
SELECT * FROM `products` WHERE title IS NULL;
SELECT * FROM `products` WHERE title IS NOT NULL;
```

- 模糊查询

```sql
SELECT * FROM `products` WHERE brand LIKE '_为'
SELECT * FROM `products` WHERE brand LIKE '%为%'
```

### 结果排序

ORDER BY

```sql
SELECT * FROM `products` ORDER BY price DESC

```

### 分页查询

```sql
SELECT * FROM `products` LIMIT 10
```

## 聚合函数

默认聚合函数会将素有数据看成一组数据

- SUM
- AVG
- MAX
- MIN

```sql
SELECT SUM(peice) FROM `products`
SELECT SUM(peice) AS  totalPrice FROM `products`

SELECT AVG(peice) FROM `products` WHERE brand = '华为'
SELECT MAX(peice) FROM `products` WHERE brand = '华为'
SELECT MIN(peice) FROM `products` WHERE brand = '华为'

SELECT COUNT(*) FROM `products` WHERE brand = '华为'
# 搜索ulr的个数
SELECT COUNT(url) FROM `products` WHERE brand = '苹果'

# 去重
SELECT COUNT (DISTINCT price) FROM products

```

分组

```sql
SELECT FROM `products` GROUP BY brand;
# 按品牌分组，并求出评价价格和总个数
SELECT barnd ,AVG(price),COUNT(*),AVG(score) FROM `products` GROUP BY brand;

# 分组后筛选平均价格大于2000的品牌
SELECT barnd ,AVG(price) avgPrice,COUNT(*),AVG(score) FROM `products` GROUP BY brand HAVING avgPrice >2000 ;

# 价格大于2000，按照品牌分类，求出平均价格
SELECT barnd ,AVG(price) FROM `products` WHERE price >2000 GROUP BY brand;

```

外键约束

```sql
# 添加外键 brand_id 为 brand 中的 id 且更新时自动更新
ALTER TABLE `products` ADD FOREIGN KEY (brand_id) REFERENCES brand(id)
                                                    ON UPDATE CASCADE
                                                    ON DELETE RESTRICT
```

## 多表查询

### 左连接

以左边为基准，左边的表会全部搜索到

```sql
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL
```

### 右连接

```sql
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id
# 查询没有对应手机品牌的信息
SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL
```

### 内连接

查询交集

```sql
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id
SELECT * FROM `products` JOIN `brand` ON products.brand_id = brand.id WHERE price = 8699
```

### 全链接

```sql
(SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id)
UNION
(SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id)

(SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE brand.id IS NULL)
UNION
(SELECT * FROM `products` LEFT JOIN `brand` ON products.brand_id = brand.id WHERE products.brand_id IS NULL)

```

### 多关系设计，关系表设计

使用内连接查找交集，并且过滤掉中间表的内容

查询所有学生的选课情况
left join

查询所有未选课的学生
后面跟上 where 条件 souress.id IS NULL

查询未被选择的课程
right join
并且 判断 stu.id IS NULL

查询某个学生选了什么课
left join
并且判断 stu.id = 1

多条语句 转成数组
group BY stu.id 分组
JSON_ARRAYAGG(JSON_OBJEST('key':'value'))

```js
 cosnt connection =  mysql.createConnection({
     host: 'localhost',
     port: 3006,
     dataBase: 'coderhub',
     user: 'root',
     password: '123456'
 })


 connection.query('SELECT * FROM students',(err,results,field)=>{

        connection.end();// 关闭
        connection.destroy();
 })

connection.on('error',(err)=>{
    console.log(err)
})
```

预处理语句

- 性能高
- 防止 sql 注入

```js
connection.execute('SELECT...', [], (err, results) => {});
```

LRU Cache 缓存算法 当再次执行时会从缓存中取，让运行速度更快

连接池
在需要的时候自动连接

```js
const connection = mysql.createPool({
  connectionLimit: 10,
});
```

// 内部封装了 promise

```js
connection.promise().execute()
.then([results,field]=>{}) // 拿到的结果是数组
.catch(err=>{})
```
