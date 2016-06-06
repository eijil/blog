---
layout: "post"
title: "ssh for git"
date: "2016-06-02 15:51"
---

## Mac

## windows

##### 生成ssh

打开命令行工具，命令行工具使用[Cmder][Cmder]或者GitBash

输入以下内容，替换你的邮箱名

```
$ssh-keygen -t rsa -f ~/.ssh/github_rsa -C "your_email@example.com"

```
* `-t` :  [ rsa | dsa ] 加密类型
* `-f` :  指定保存文件文件名，需要加上目录，`~/` winows下等于 `C:/Users/you/`
* `-C` :  添加一个注释 一般指定你的邮箱名

按下Enter后会提示你输入密码，不需要输入，一直按Enter键就可以完成

```
Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]
```

##### 添加SSH到你的GitHub账号


复制SSH key

`clip < ~/.ssh/github_rsa.pub`


修改仓库地址

`git remote set-url origin ssh://git@git.sailor.cn/~/WeiYu`

[Cmder]: http://www.softpedia.com/get/Programming/Other-Programming-Files/Cmder.shtml
