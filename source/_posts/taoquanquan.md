---
layout: post
title: "H5游戏开发：套圈圈"
date: "2016-06-03 15:51"
---

## 前言

套圈圈游戏相信很多人小时候都玩过，玩法简单就不用介绍了，本文主要分享下开发过程中遇到的问题和解决思路

游戏体验地址：

![](https://img13.360buyimg.com/imagetools/jfs/t1/35551/10/6013/45115/5cc18c57E98303c70/fc794557ddccefcf.png)

## 技术选型

##### Phaser  & P2

游戏框架原理都是差不多的，基本就是创建场景，精灵，主循环等等，只是每个框架写法不同而已,所以在选择框架的时候我还是考虑以下几点，文档是否完善、API是否易用，demo是否丰富、社区活跃度，最终对比后选择了[Phaer](http://phaser.io)框架，物理引擎使用Phaser中已经自带的P2


## 设置物理碰撞区域

![img](https://img11.360buyimg.com/imagetools/s314x340_jfs/t1/33137/31/7262/402066/5cc1580fEa3cb7e0e/197d152c09382199.png)

上图是游戏中的主要碰撞区域，主要有3块 容器边框、两根针、和圈圈。

容器边框和针比较清晰，都是静态的直接设置成矩形就可以
最主要的还是考虑是圈怎么设置，我们不能直接把整个圈就弄成一个碰撞区域，这样圈也无法套进指针

那怎么设置呢，其实也很简单，将个2D画面想象成3D的话 我们其实只需要设置左右两个点的区域就行了，并且将点设置成圆形的，如果是矩形可能圈掉下来的时候不会倒下。


## 模拟水中发力

接下来是实现按下按钮圈圈飘起来的效果

可以分为两点
1. 模拟水中的效果
2. 按下按钮模拟一个水的冲力

第一点比较其实比较简单，依靠物理引擎我们只需要将重力值调低，效果就跟在水中类似，重点还是要实现按下按钮后向上的冲力,首先想到就是查查物理引擎中有没有能实现往一个坐标点施加力的方法，最后试了几个方法还是不行，所以想到另一种方法就是按下按钮的时候给10个圈都加一个向上的力，力会根据左右位置递减，例如按下左边按钮的时候，左边的力是最大的，越往右越低，这样也是实现了一个往上冲的力。

代码实现呢就当按下按钮是 循环这10个圈，判断圈坐标然后给不同的力度
为了显得更真实，超过一定距离就不施加力了

``` js
//按下左边按钮
 this.quans.forEachAlive( quan => {
      //屏幕一半
       const halfScreen = this.game.width / 2
      //根据圈的x坐标力度递减
       let vy = this.game.width - quan.x
       //屏幕大于一半速度减更多
       vy = vy < halfScreen ? vy / 2:vy
       //施加力
       if (quan.x < halfScreen + quan.width){
           quan.body.velocity.y = -vy * 0.5
        }
 })
```

## 模拟进圈

![](https://img12.360buyimg.com/imagetools/s73x152_jfs/t1/31638/2/15195/13141/5cc1580fE524bbbde/05277faee11dff66.png)

如上图 我们的圈其实是就是一个贴图，怎么去实现"穿过"的效果呢?

##### 使用两个精灵来实现

![](https://img11.360buyimg.com/imagetools/jfs/t1/31744/16/15308/7190/5cc1801cE39d8c237/77f6bf9be498cb06.png)

一开始想到的就是创建两个圈，然后将图切成两半每个圈贴一半图，然后一个圈运动另一个圈跟随，但是发现机器性能太差或者运动很快的时候两个圈会衔接不上，出现错位效果不太理想，最后想到其实运动过程中只需显示一个圈就可以，另一个圈其实在套进去展示就可以，所以将一个圈的贴图改成完整的，跟随的圈只贴一半，如下：

![](https://img10.360buyimg.com/imagetools/jfs/t1/35451/28/5902/9527/5cc18063E3b3eca15/d7cebabdf389e2dc.png)

这样进圈的问题就算解决了，有点瑕疵就是多了10个圈，可能对性能有一丢丢影响

## 计算得分

##### 两线相交
给圈和针做一条辅助线，我们发现其实只要两线相交那圈就是完全套进去，那怎么判断两条直线相交呢？ 

Phaser库中提供了一些数学方法，其中正好有判断两线相交的函数，直接调用即可，需要传入4个参数，分别是两条线的顶点

```
//两线相交
const result1 = Phaser.Line.intersectsPoints(_this.line1.start, _this.line1.end, startPoint, endPoint, true);
```
两线相交的实现感兴趣的可以看下源码：

[https://github.com/photonstorm/phaser-ce/blob/04204f5180af319e3abdc895190543a9f9f9b7f3/src/geom/Line.js#L617](https://github.com/photonstorm/phaser-ce/blob/04204f5180af319e3abdc895190543a9f9f9b7f3/src/geom/Line.js#L617)

##### 如何获取圈的顶点

调用intersectsPoints方法我们还需要获取4个顶点，针的两个顶点因为是静态所以我们可以直接写死，但是圈是不断运动的，我们还需要通过计算。

![](https://img12.360buyimg.com/imagetools/jfs/t1/41746/8/315/62367/5cc18485E0cc9e7d7/8da6c0e1ef20cda6.png)

如上图 我们需要获取的是圈两端的坐标，当圈被创建的时候我们能得到是圈的中心点，圈的宽度，圈的角度，那通过三角函数我们就可以得到两端的坐标点

``` js
      //半径
       var r = this.quanWidth / 2 - this.quanBorder; //半径
       //圆点
       var x0 = frontquan.x;
       var y0 = frontquan.y;
       //StartPoint
       var startPoint = {
            x: x0 - r * Math.cos(frontquan.angle * (Math.PI / 180)),
            y: y0 - r * Math.sin(frontquan.angle * (Math.PI / 180))
       }
       //EndPoint
       var endPoint = {
            x: x0 + r * Math.cos(-frontquan.angle * (Math.PI / 180)),
            y: y0 + r * Math.sin(frontquan.angle * (Math.PI / 180))
        }
       
      const result1 = Phaser.Line.intersectsPoints(_this.line1.start, _this.line1.end, startPoint, endPoint, true);

```

## 陀螺仪

最后还要实现一个功能就是根据手机陀螺仪，圈根据手机倾斜的方向移动，这样玩法会显得更真实。

首先我们手机在倾斜的时候主要是gama值在变化，所以只需要监听gama值然后在更改物理引擎的x值就可以实现

```
window.addEventListener('deviceorientation',(e)=>{
            const maxAngle = 30 
            const gamma = Math.abs(e.gamma) > maxAngle ? maxAngle : e.gamma
            this.water.angle = -gamma
            this.physics.p2.gravity.x = gamma
 },false)
```


## 结语

这次的分享就写到这了，游戏开发其实还会遇到各种各样的问题，如各种手机适配问题、音频问题等、下次有机会再分享，有问题可以在底下留言讨论或咚咚