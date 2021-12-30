---
layout: post
title: UI自动化测试实践
---

## 前言

相信大多数前端团队在工作中都思考过UI自动测试的方案（特别是发生过线上事故的时候），虽然都知道增加测试能尽量减少事故率
，但其实想落地并没那么容易，原因还是投入的成本通常会大于收益。那么这次我为什么要想尝试去做呢？主要还是觉得是使用场景上比较契合，这个下面展开。

UI自动化测试其实主要可以分为两种，一种是通过无头浏览器比如`puppteer`或测试框架通过执行脚本来断言程序是否符合预期的，这也是最常见的；还有一种就是纯图片的对比，也是本文想讲的。


## 使用场景

是否适合使用图片对比的方式最关键还是看你的业务需求，还有一些必要的前提条件，所以以下方案其实并不通用，仅供参考。


我们平时的业务需求主要是一些H5的营销活动，这类需求主要还是兼容性的测试，比如各个机型展示是否一致，不会出现空窗、价格丢失等问题，自测过程还是比较繁琐的，这些问题基本就是设计稿还原问题，那是不是跟原图对比就可以了？既然是要对比，前提就是要怎么拿到真机的图片，公司其它部门正好开发了一个自动化测试平台，可以自动去获取各个手机网页截图（如下图），所以其实我们是在这个基础上增加一个图片对比的服务。

![截屏2021-08-19 下午3.00.04.png](https://img10.360buyimg.com/imagetools/jfs/t1/222489/9/7781/224500/61cd669cEb5d355bb/7b172984a0755a2a.png)


我们初步打算实现的是集成到内部正在开发的[DECO智能代码](https://jelly.jd.com/article/61a6eb9f2a070818620bac2e)平台，其主要功能是设计稿转换代码，为了确认UI的还原质量，所以我们加入了一个UI测试流程，在转换为代码后生成静态页面发布到线上，再获取真机截图和原设计稿进行对比，输出还原度和像素对比结果，通过这个流程我们可以提前发现大部分ui问题，也可以帮助开发人员减少自测工作量。


## 实现

总结下大概需要以下工作量：

1. 对接其它部门提供获取真机截图的接口
2. 如何去进行图片对比
3. 后台相关的工作量

当然本次只介绍图片对比相关的内容

## 如何合成长图

进行图片对比之前还有一个比较麻烦的问题要解决，我们能取的到的图片只是一张一张的截图，而目前的需求是需要全图去对比，所以我们还需要拼图，一开始还是从网上找有没有开源的库可以使用，js的几乎没有，ObjectC的倒还有几个，借鉴了一些思路然后自己重新实现。

## 思路

首先我们是上下图拼接，那就找出两张图重叠的部分然后进行裁剪即可，那么怎么找到重叠呢？

##### 对比每一行的像素

我们都知道每个像素点都是rgba的值组成，所以可以将图片每一行的像素相加后的值进行对比，当然单纯对比一行的数值是没意义的，但是我们只要对比多行就能确定图像是否相同了，一行相同就继续对比下一行，不同则重新对比。

获取每一行像素的方法：

``` js
// 得到每一行数据
export function toLineSumPixel(imageData) {

  const { width, height, data } = imageData
  let index = 0
  let sum = 0
  const lines = []
  for (let row = 0; row < height; row++) {
    sum = 0
    for (let col = 0; col < width; col++) {
      sum += data[index] + data[index + 1] + data[index + 2] + data[index + 3]
      index += 4
    }
    lines.push(sum)
  }
  return lines
}
```

##### 允许误差

实际页面中可能还会存在一些干扰项，比如浮动的icon,或者某些字体有区别，导致你拼图的结果不如预期，而且实际开发过程中发现上游的截图即使相同的图片每一行像素都可能会有误差，所以我们对比每一行的时候可以允许一些误差：


 
 
``` js
 
 //允许误差
 this.threshold = 0.1

 /*  约等于
  *  @params x:上图每一行的值
  *  @params y:下图每一行的值
  */
 isApproximateTo(x, y) {
    return y >= x * (1 - this.threshold) && y <= x * (1 + this.threshold)
  }
```
在查找过程中，初始时`threshold`可以设置为0(绝对匹配），如果对比一遍没有满足条件的会加大误差值直达满足为止。


##### 找出重叠


下面是我的实现思路，为了方便阅读，代码只展示核心部分，简单讲就是两张图片每一行进行对比，时间复杂度是`O(m^n)`,通过一个二维数组记录上一次是否重叠了，最后把重叠度都大于50像素的保存起来

``` js

const MIN_OVERLAP_HEIGHT = 50

calcultateOverlap(topImage,botImage){
      
      const topLines = toLineSumPixel(topImage)
      const botLines = toLineSumPixel(botImage)
      
      //初始化二维数据，记录重叠信息
      const matrix = [[], []]
      for (let i = 0; i < botImgHeight; i++) {
        matrix[0][i] = matrix[1][i] = 0;
      }
   
      //遍历两张图片每一行，得到所有重叠高度 
      for (let i = 0; i < topImgHeight; i++) {
          const topLineValue = topLines[i]
            for (let j = 0; j < botImgHeight; j++) {
            
              const botLineValue = botLines[j]
              if (this.isApproximateTo(topLineValue,botLineValue))) {
                //重叠高度
                let currentOverlapHeight = 0
                if (j !== 0) {
                  const preOverlapHeight = matrix[(i + 1) % 2][j - 1]
                  currentOverlapHeight = preOverlapHeight + 1
                }
                matrix[i % 2][j] = currentOverlapHeight
                //大于指定的高度的才保存
                if (currentOverlapHeight > MIN_OVERLAP_HEIGHT) {
                
                    cons info = {} 
                    //重叠高度
                    info.verlapHeight = currentOverlapHeight
                    //上图开始重叠函数
                    info.eginOverlapTopImage = i - currentOverlapHeight + 1
                    //下图开始重叠行数
                    info.eginOverlapBotImage = j - currentOverlapHeight + 1
                     
                    this.list.push(info)
                }
              } else {
                matrix[i % 2][j] = 0
              }
        }
      }
}


```

后续的部分就是选出重叠度最大的进行图片的裁切和拼接，就不上代码了，具体可以[点击这里](https://github.com/eijil/stitch/tree/master/src/stitch)查看源码 

##### 效果如何

经过多次调试，也用了10来个页面进行测试，基本是能达到预期的，重新做了个[DEMO](https://eijil.github.io/stitch/)，可以体验下测试下。


##### canvas库安装

上面对于图片的操作都会用到一个[canvas](https://www.npmjs.com/package/canvas)库，api和web的基本一致，但在服务端安装一些图片服务的库总能遇到一些问题，下面顺便记录下安装方法：

``` bash
#环境：centos7 + nodejs 
#先安装依赖
RUN yum install -y gcc-c++ cairo-devel pango-devel libjpeg-turbo-devel giflib-devel 

#从源码安装canvas 
RUN npm install canvas --build-from-source
```



## 图像对比

图像对比其实没有想象中复杂，我们最终要实现的就是对图片像素的对比，并输出差异图，这可以借助[jimp](https://www.npmjs.com/package/jimp)的`diff`功能来实现，在之前还有一步就是要保证对比图大小是一致的，并且对比的区域是你想要的，这一步也是借助了开源库`opencv`的api [template matching](https://docs.opencv.org/4.x/d8/dd1/tutorial_js_template_matching.html) 来实现。


###### 实现 

`templateMatching` 光看英文也应该能知道是什么功能， 通过官方的例子（下图）很好理解，模板是原图中存在的部分，可以快速匹配出模板在原图中的位置


![截屏2021-12-28 上午11.30.10.png](https://img12.360buyimg.com/imagetools/jfs/t1/176476/17/23707/637942/61cd6601Ebc2bed5a/95f3423968f805a1.png)

在实际例子中我们已经存在有DECO生成的静态页面，并且通过接口在真机中跑出所有截图，拿到图片后可以先裁切掉页面都头尾一些无用的信息，比如华为系统底部的虚拟导航，确保模板比原图小，通过api找到相同区域，并裁切出来, 最后使用`jimp`的`diff`来进行像素对比，并输出差异结果，代码如下：




``` js
//原图
let origin_img = await Jimp.read(origin)
//模板
let template_img = await Jimp.read(template)

const w = origin_img.bitmap.width
const h = origin_img.bitmap.height

const dst_w = template_img.bitmap.width
const dst_h = template_img.bitmap.height - 400

// 头尾大概可以截掉两百像素
template_img.crop(0, 200, dst_w, dst_h).write('temp/template.jpg')


let temp_img:any = null

// 比较图片大小,小的作为模板
if (dst_w >= w && dst_h >= h) {
  temp_img = origin_img
  origin_img = template_img
  template_img = temp_img
}


const src = cv.matFromImageData(origin_img.bitmap)
const templ = cv.matFromImageData(template_img.bitmap)

const dst = new cv.Mat()
const mask = new cv.Mat()

//开始匹配
cv.matchTemplate(src, templ, dst, cv.TM_CCORR_NORMED, mask)

//计算匹配结果的矩形
const result = cv.minMaxLoc(dst, mask)
const maxPoint = result.maxLoc
const point = new cv.Point(maxPoint.x + templ.cols, maxPoint.y + templ.rows)

//裁切原图
await origin_img.crop(maxPoint.x, maxPoint.y, point.x, point.y - maxPoint.y).writeAsync('temp/origin.jpg')

//像素对比
const diff = Jimp.diff(origin_img, template_img, threshold)
await diff.image.quality(90).writeAsync('temp/diff.jpg')

src.delete()
dst.delete()
mask.delete()

```


### 结果

下图就是跑完整个流程的一个结果，完全相同的部分是白色的，红色部分是不同区域，opencv的模板匹配和像素都可以输出一个相似度的百分比分值，相似度分值也可以根据阀值`threshold`来调节

![截屏2021-08-03 下午3.32.19.png](https://img13.360buyimg.com/imagetools/jfs/t1/144460/15/26537/165841/61cd670fE8b8b4cc7/e7f933a11ec898ee.png)

## 总结


最后还是得总结下做了这么多到底有没有用？答案是肯定的，首先对于DECO来说，我们目前的使用场景大多是输出组件或楼层代码，由于基本是静态数据，和设计稿进行像素对比是能准确发现ui上的问题的，比如某个商品的价格丢失了，那匹配率数值其实就会明显偏低了。还有就是效率的提升，一次执行就可以输出所有机型的差异图也节省了不少时间。

#### 问题和迭代

当然也存在一些问题，如果只是一屏或者一个楼层的对比（图片越小越好），那匹配度数值是可以反映出问题的，如果是很长页面对比呢，由于细微的像素差异也会被加进去，所以对比的准确度就要大打折扣了。在另一个使用场景下，我们对线上的活动进行对比，当然由于数据是动态的，对比图不可能是使用设计稿了，我们直接用`puppteer`截取了chrome下的长图和真机图片对比，由于页面是很长数值其实已经不够准确说明问题，所以目前就是人工看图，至少减少了一个个手机去测试的麻烦，后续想尝试的一些优化点是想通过AI的方式识别关键的楼层后去对比，这样也不需要前面的合图步骤了。

















