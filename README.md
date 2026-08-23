# TsukiVox Official Website

TsukiVox 官方产品网站。以“把舞台戴在头上”为核心叙事，通过 WebGL 星空、音频响应、滚动转场和未来 KTV 包厢视觉，介绍面向 Meta Quest 3 的沉浸式单人 VR K歌体验。

## 技术栈

- Vue 3 + TypeScript + Vite
- Three.js：星空、轨道和实时声波背景
- GSAP ScrollTrigger：滚动叙事与段落转场
- Lenis：平滑滚动与 WebGL 同步
- 原生 Web Audio API：用户主动开启的环境声音

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

## 页面能力

- PC 与移动端自适应，移动端自动降低 WebGL 粒子密度和渲染精度
- 简体中文 / English 双语切换
- 默认静音，用户可主动开启轻量环境声音
- `prefers-reduced-motion` 动效降级
- 加入测试入口与 GitHub 申请模板
- Open Graph / X 社交分享卡片

## 内容说明

官网当前内容对应 TsukiVox V0.78：Quest 3 原生单人体验、实时麦克风返听、四档人声预设、头显内搜索点歌、本地下载缓存、播放队列和空间化控制。

TsukiVox 是独立项目，与 Meta、Bilibili 无隶属或合作关系。
