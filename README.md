# TsukiVox Official Website

TsukiVox 官方产品网站，介绍面向 Meta Quest 3 的单人 VR K歌体验。首页是一条由滚轮控制的连续演出：月亮入口打开为包厢，包厢收为悬浮屏幕，屏幕压成一条线并展开为声波，声波收拢后切入品牌与测试入口。

## 本地运行

```bash
npm install
npm run dev
```

```bash
npm run build
npm test
```

## 滚动架构

- Vue 3 + TypeScript + Vite，GSAP ScrollTrigger 控制一条可逆时间线。
- `ScrollStory.vue`：固定在视口内的舞台，页面滚动距离映射到同一时间线的进度；图片、遮罩、排版和场景转接同步推进。向上滚动可还原转场。
- `SignalField.vue`：Canvas 2D 绘制声波，按滚动进度逐点变形为环。无需 WebGL 或视频解码；停止滚动后不持续空转渲染。
- 原生滚动与 0.7 秒进度追随，保留滚轮、触控、键盘和浏览器滚动条操作。
- 导航可直接进入章节。手机使用独立构图；减少动态效果偏好下，使用按钮即时切换静止场景。
- 产品信息与路线图位于演出之后，首个键盘链接可跳过动画。

## 页面能力

中英双语、包厢热点、四档人声预设视觉模拟、默认静音的可选环境音、原生 dialog 申请弹窗、GitHub 预填测试申请、产品路线图与社交分享卡片。

官网内容对应 TsukiVox V0.78：Quest 3 原生单人体验、实时麦克风返听、四档人声预设、头显内搜索点歌、本地下载缓存、播放队列和空间化控制。

## 设计参考

参考 [Pear](https://pear.no/) 的固定舞台与连续滚动叙事：滚轮推进画面内部的转场，每段视觉从上一段的元素接续产生。Pear 作者公开介绍了固定画布、滚动映射影片帧以及独立 DOM 字幕的实现；本项目以原创图像、CSS 遮罩、GSAP 与 Canvas 实时绘制实现自己的转场，没有复用 Pear 的影片、图片、代码或字体。

主视觉位于 `public/assets/tsukivox-moon.webp`；包厢概念视觉位于 `public/assets/tsukivox-hero.webp`。网页预设与声波为视觉模拟，环境音不代表应用内实际麦克风返听效果。浏览器无需麦克风权限。

TsukiVox 是独立项目，与 Meta、Bilibili 无隶属或合作关系。
