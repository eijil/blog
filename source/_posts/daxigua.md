---
title: 使用Phaser3+Matter.js实现“合成大西瓜”游戏
date: 2021-02-05
---

最近有一款“合成大西瓜”的小游戏有点火，试玩了一下，玩法比较简单，实现难度也不大，所以参照游戏原型自己实现了一下，游戏开发主要使用了Phaser游戏框架，本文主要分享游戏功能的具体实现，对框架使用的API不会做过多介绍。


## 玩法分析
首先简单介绍下游戏的玩法：控制水果从上方掉落，两个相同水果会合成一个更大的水果，最终合成一个大西瓜，效果展示：

![](https://img10.360buyimg.com/imagetools/jfs/t1/165558/3/5026/1415680/6017a011Edfb4e24a/2b99a1a2ded920ce.gif)

游戏的玩法在于合理控制下落的点避免空间的浪费，在顶部有一条“死亡线”，当水果超过这个高度就结束，有点像俄罗斯方块，每合成一次水果都会得分，看谁能在游戏结束前或得更高的分数

##### 有多少种水果

游戏总共会出现11种水果，经过观察，前5种水果会随机掉落，后面的水果都是合成才会出现的

![](https://img11.360buyimg.com/imagetools/jfs/t1/151808/24/17062/216171/6017a011E0cec803c/d7f19b90812f7fd3.png)

##### 如何计算得分

每次合成新水果都会得分，按顺序的话第一种是1分，第二种2分，第10种就是10分，最后合成大西瓜后是额外得100分：
![](https://img14.360buyimg.com/imagetools/jfs/t1/151845/24/17258/201478/601908fbE0416166f/613a1b3c3621eeb0.png)



## 快速开始

游戏的基本玩法都已经清楚了，接下来就是开发了，首先我们通过`Github`上`clone`一个phaser3的[脚手架](https://github.com/photonstorm/phaser3-typescript-project-template)来进行开发,我们首选Typescript版本的，对于这种复杂的框架，类型提示真的非常方便。
``` bash
git clone git@github.com:photonstorm/phaser3-typescript-project-template.git hexigua
cd hexigua
npm install 
#启动 
npm run watch

```
安装依赖并启动后，进入`src/game.ts`,把原来的一些示例代码删掉,结果如下：
```
import 'phaser';
export default class Demo extends Phaser.Scene
{
    constructor (){
        super('demo');
    }
   
    preload () {
    }
   
    create () {
    }
}

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    scene: Demo
};

const game = new Phaser.Game(config);
```
`preload`和`create`都属于框架的生命周期，`preload`主要用于预先下载资源，`create`用于创建对象或事件。

##### 修改config 参数

修改游戏初始化参数，指定使用Matter.js物理引擎，缩放模式通常设置为等比例缩放模式`Phaser.Scale.FIT`，

``` js
const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffe8a3', //改为游戏的背景颜色
    mode: Phaser.Scale.FIT, // 缩放模式
    physics: {
        default: 'matter',  //使用matterjs物理引擎
        matter: {
            gravity: {
                y: 2   
            },
            debug: true //开启调试
        }
    },
    width: window.innerWidth,
    height: window.innerHeight,
    scene: Demo
};
```
##### 加载资源
接下在`preload`函数中加载准备好的图片, 前面我已经准备好了11中类型水果的图片，为了方便开发，分别命名为1-11.png
``` js
preload(){

  //11种类型水果
  for (let i = 1; i <= 11; i++) {
     this.load.image(`${i}`, `assets/${i}.png`)
   }
  //地板图片
  this.load.image('ground', 'assets/ground.png')
}
```
##### 新建水果
加载资源后，我们先来创建游戏中最主要的对象水果，游戏中水果出现的情况有两种，一种是在顶部落下，一种是碰撞后生成，除了位置不同，还有状态和类型也不同，用一个表示如下：

出现位置|状态|类型
--|:--:|--:
顶部|先静止点击后落下|前5种随机
合成后的位置|非静止|上一种+1

把不同的部分作为参数，创建一个`createFruite`函数：
``` js
  /**
     * 添加一个水果
     * @param x 坐标x
     * @param y 坐标y
     * @param key 瓜的类型
     * @param isStatic 是否静止 
     */
    createFruite(x: number, y: number, isStatic = true, key?: string,){
        if (!key) {
            //顶部落下的瓜前5个随机
            key = `${Phaser.Math.Between(1, 5)}`
        }
       //创建
        const fruit = this.matter.add.image(x, y, key)
        //设置物理刚体
        fruit.setBody({
            type: 'circle',
            radius: fruit.width / 2
        }, {
            isStatic,
            label: key //设置label 用于后续碰撞判断是否同一类型
        })
        //添加一个动画效果
        this.tweens.add({
            targets: fruit,
            scale: {
                from: 0,
                to: 1
            },
            ease: 'Back',
            easeParams: [3.5],
            duration: 200
        })
        return fruit


    }
```
在`create`函数中创建地板和生成水果
``` js
create(){
       //设置边界
        this.matter.world.setBounds()
        //添加地面
        const groundSprite = this.add.tileSprite(WINDOW_WIDTH / 2, WINDOW_HEIGHT - 127 / 2, WINDOW_WIDTH, 127, 'ground')
        this.matter.add.gameObject(groundSprite, { isStatic: true })

        //初始化第一个一个水果
        const x = WINDOW_WIDTH / 2
        const y = WINDOW_HEIGHT / 10
        let fruit = this.createFruite(x, y)

}
```
##### 绑定点击屏幕事件
接下来就是添加事件点击屏幕的时候水果往下掉，并生成一个新的水果，新水果生成的时间点就设在落下后一秒钟
```
create(){
     ...
     //绑定pointerdown事件
     this.input.on('pointerdown', (point) => {
        if(this.enableAdd){
          this.enableAdd = false
          //先x轴上移动到手指按下的点
           this.tweens.add({
                    targets: fruit,
                    x: point.x,
                    duration: 100,
                    ease: 'Power1',
                    onComplete: () => {
                        //取消静止状态，让物体掉落
                        fruit.setStatic(false)
                       //1s后生成新的水果
                        setTimeout(() => {
                            fruit = this.createFruite(x, y)
                            this.enableAdd = true
                        }, 1000);
                    }
                })
        }
     }
}
```
##### 物体碰撞事件

完成水果生成后，下一步就是添加碰撞事件，在`phaser`中我们可以使用`this.matter.world.on('collisionstart',fn)`来监听物体的碰撞事件，`fn`中会返回两个相互碰撞的物体对象，我们根据前面设置的`label`值就能判断是否同一组，并进行后续操作
``` js
create(){
 ...
 this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
            const notXigua = bodyA.label !== '11'   //非大西瓜
            const same = bodyA.label === bodyB.label //相同水果
            const live = !bodyA.isStatic && !bodyB.isStatic //非静态
            if (notXigua && same && live ) {
                //设置为Static,这样可以调整物体位置，使物体重合
                bodyA.isStatic = true
                bodyB.isStatic = true
                const { x, y } = bodyA.position
                const lable = parseInt(bodyA.label) + 1
                //添加两个动画合并的动画
                this.tweens.add({
                    targets: bodyB.position,
                    props: {
                        x: { value: x, ease: 'Power3' },
                        y: { value: y, ease: 'Power3' }
                    },
                    duration: 150,
                    onComplete: () => {
                        // 物体销毁
                        bodyA.gameObject.alpha = 0
                        bodyB.gameObject.alpha = 0
                        bodyB.destroy()
                        bodyA.destroy()
                        //合成新水果
                        this.createFruite(x, y, false, `${lable}`)

                    }
                })
            }
        })
}
```



到这一步我们就基本完成了游戏的核心部分，先看下效果：
![](https://img12.360buyimg.com/imagetools/jfs/t1/167267/13/5019/1405651/601a3948E82f1c86e/7033830d0652b11e.gif)

合成后只是简单的销毁物体，有时间的话可以加入一些帧动画之类的效果会更好，这里就不加了，接下来继续加上结束判定和得分。

##### 结束判断

前面提到，当落下的球超过指定的高度游戏即结束，我们还是使用一个碰撞检测来实现，创建一个矩形物体作为我们的“结束线”，当矩形碰到物体的时候即表示空间已经不够游戏结束，还有一点需要特殊处理的是当我们点击水果落下时是会碰到线的，这次碰撞需要过滤掉
``` js
create(){
...
//线创建在水果200px下的位置
const endLineSprite = this.add.tileSprite(WINDOW_WIDTH / 2, y + 200, WINDOW_WIDTH, 8, 'endLine'  )
//设为隐藏
 endLineSprite.setVisible(false)
//设置物理效果
 this.matter.add.gameObject(endLineSprite, { 
  //静止
  isStatic: true,
  //传感器模式，可以检测到碰撞，但是不会对物体产品效果
  isSensor: true,
  //物体碰撞回调,
  onCollideCallback: () => {
     //落下时碰到线不触发
     if(this.enableAdd){
        // 游戏结束
         console.log('end')
     }
  })
 })
}
```
##### 得分

得分的逻辑其实比较简单了，在合成成功后加入代码
```
    //写在合成方法执行内
    let score =  parseInt(bodyA.label)
    this.score += score
    //合成西瓜额外加100分
     if(score === 10){
          this.score += 100
     }
    this.scoreText.setText(this.score)
   //
   create(){
     //创建一个Text
     this.scoreText = this.add.text(30, 20, `${this.score}`, { font: '90px Arial Black', color: '#ffe325' }).setStroke('#974c1e', 16);
   }
```

## 最后
到这里游戏的基础玩法就开发结束了，借助Phaser框架基本算能快速的开发游戏的原型，如果你是新手对H5游戏开发感兴趣的话，那么Phaser是一个非常容易上手的框架，api的设计也比较友好，还有大量的demo可以学习，或许下一个爆款游戏就出自于你呢。 

本项目[源码](https://github.com/eijil/hexigua)已经发布到github仓库，感兴趣的可以自行查看

## 参考文章
[如何随手合成大西瓜，把把1000分？手残必看的高分攻略来了！](https://mp.weixin.qq.com/s/GPJElGWV8MLr2Dp9n8NtNg)

[Phaser](http://phaser.io/)