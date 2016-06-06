---
layout: "post"
title: "ssh for git"
date: "2016-06-02 15:51"
---
# SSH的使用

SSH是一种连接服务器的方式，使用SSH可以不必每次都输入用户名和密码

## Add SSH key to Github

> 介绍如何使用SSH来接连github和添加多个ssh-key


### Mac

##### 1. 打开命令行工具，输入以下内容,替换你的邮箱名

```
$ssh-keygen -t rsa -C "your_email@example.com"

```
> `-t` : [rsa | dsa ] 加密类型,默认rsa

> `-C` : 添加一个注释


##### 2. 生成SSH-KEY

```
Generating public/private rsa key pair.
Enter file in which to save the key (/Users/you/.ssh/id_rsa): 
```

> 第一步执行后会让你指定一个ssh key文件名，默认是id_rsa,这里我们不使用默认的,因为你可能不止一个git服务，可能你们公司使用了gitlab或者其它的，但如果你使用默认的待会可以直接跳过第***4***步

输入文件名，需要带上目录

```
 /Users/you/.ssh/id_rsa 
 
```

#####3. 提示你输入密码，不要输入直接按确定就完成了

```
Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]

```


#####4.多个SSH-KEY





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
