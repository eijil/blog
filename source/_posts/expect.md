---
title: 使用expect快速登录服务器
---

前段时间开发中台项目的时候经常需要频繁登录生产服务器去修改代码，但通常企业为了服务器安全，需要通过跳板机来链接，如下图，每次都需要先登录两台服务器才能链接到正式服务器，非常繁琐，这时候expect就派上用场了


![](https://img11.360buyimg.com/opr/jfs/t1/97795/18/14901/175820/5e6b2fd9E9b02195e/db1d64d12dcad3e9.png)

### expect是什么

expect就是一个能帮我们自动化执行交互式脚本的命令行工具

### 安装

mac `brew install expect`

linux `yum install expect`

### expect 常用命令

 `spawn`  接收命令  如ssh 192.168.100.100

 `expect` 等待接收上面命令执行完的字符串，执行下一步操作

 `send` 发送你要输入的内容

`interact` 退出自动执行 返回人工交互

### 开始使用

下面来实现如何自动登录

先创建一个文件`login_server.sh`

```
#! /usr/bin/expect

#定义一些变量
set timeout 30 #超时时间，随便写一个吧
set username hello
set password 123456  #密码123456

# 登录跳板机
spawn ssh $username@192.168.000.00
#expect 根据上面命令执行后返回的信息，如果包含password，就证明成功,执行下一步，
#所以需要根据自己返回的信息确定成功后每次都包含哪些字符串
expect "password" 
# 发送密码
send "$password\r"
# 返回的信息包含"@"成功
expect "@" 

# 下面就基本重复上面的步骤

# 堡垒机
send "ssh 10.123.456.789\r"
expect "*password:"
send "$password\r"

# idc
expect "*IP:"
send "10.123.45.67\r"
expect "*user:"
send "$username\r"
expect "Password:"
send "$password\r"

# 最后退出返回人工操作
interact

```

然后命令行 `./login_server.sh` 等执行完就ok了