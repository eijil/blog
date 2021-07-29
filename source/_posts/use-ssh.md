---
layout: post
title: "use ssh"
date: "2016-06-02 15:51"
---
# SSH的使用

SSH是一种连接服务器的方式，使用SSH可以不必每次都输入用户名和密码

## 一、 Add SSH key to Github

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
 /Users/you/.ssh/github_rsa

```

##### 3. 提示你输入密码，不要输入直接按确定就可以

```
Enter passphrase (empty for no passphrase): [Type a passphrase]
Enter same passphrase again: [Type passphrase again]

```


##### 4.多个SSH-KEY

添加config文件

进入`~/.ssh`目录，使用vi或者你喜欢的编辑器添加`config`文件,保存以下内容

``` bash
Host github.com
HostName github.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/github_rsa

#如果有多个的话继续添加
Host gitlab.com
HostName gitlab.com
PreferredAuthentications publickey
IdentityFile ~/.ssh/gitlab_rsa
```

##### 5. 添加ssh-key 到你的github账号

复制SSH-key

`$ pbcopy < ~/.ssh/github_rsa.pub`

添加到github账户，具体参考[官网教程](https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-mac)


##### 6. 完成

测试你的SSH链接是否成功

`$SSH -T git@github.com`

如果出现下面内容就是验证成功了

```
Hi youname! You've successfully authenticated, but GitHub does not provide shell access.
```
修改你的git仓库，开始使用吧

`git remote set-url origin git@github.com:you/xxx.git`



## windows

windows下请使用[Cmder][Cmder]或者GitBash等命令行工具

> ~/.ssh 等于 c:/Users/you/.ssh
> 复制命令 clip <


## 二、使用ssh公钥/私钥 实现免密码登录服务器

一般我们连线上服务器可能会经过一层或多层堡垒机，可以通过SSH生成后的公钥传到服务器上来实现免密码登录。

假如有两台服务器A 登录 B

A : 192.168.146.95

B : 172.22.213.13

##### 1.在A服务器上生成ssh-key

`$ssh-keygen -t rsa -C "your_email@example.com"`

##### 2.将公钥传到B服务器`.ssh/authorized_keys`文件，使用`scp` 命令上传

`scp ~/.ssh/id_rsa.pub 172.22.213.13:~/.ssh/authorized_keys`

##### 3.如果前面步骤都做完，那现在就可以无密码登录了

```
  ssh 172.22.213.13
  Last login: Mon Jun  6 15:04:46 2016 from 192.168.146.95

```  




[Cmder]: http://www.softpedia.com/get/Programming/Other-Programming-Files/Cmder.shtml

---

last