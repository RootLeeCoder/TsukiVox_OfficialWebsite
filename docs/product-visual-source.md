# 产品视觉来源

官网以 [TsukiVox](https://github.com/RootLeeCoder/TsukiVox) 提交 `32cc45ad5bfc83772c7865ba410881c30d85739f` 为视觉参考。

| 官网元素 | 项目来源 |
| --- | --- |
| 深灰、香槟金、暖白与蓝灰 | `Assets/Scripts/AudioPrototype/QuestUiThemePalette.cs` 的 Dark 色板 |
| 包厢模型、家具、月牙灯、舞台灯和材质色 | `Assets/Scenes/AudioPrototype.unity`、`QuestKtvRoomPrototype.cs` |
| 品牌字标 | `Assets/Resources/Textures/TsukiVoxFloorLogo.png`，原图复用 |
| 点歌平板主页的布局与空队列状态 | `Assets/Scripts/AudioPrototype/QuestConsumerUiPrototype.cs` 的 `BuildHomePage` |

色板对应：Screen `#0B0D12`、Surface `#11151D`、Raised `#1C2028`、Line `#393B40`、Text `#F2EFE8`、Secondary `#A9A697`、Accent `#D8C49D`、Strong `#EDE2CC`、Warm `#929CAF`。

## 场景图与边界

`tools/render-product-scene.py` 读取 Unity 场景序列化网格、层级变换、激活状态和材质色，生成两张 WebP。渲染采用简化的离线光照；立方体、圆柱和球体使用对应基础几何。视频大屏的运行时表面按项目中的位置与尺寸补齐。场景图不是 Quest 实机截图，未复现 Unity URP、真实阴影、动态灯光、极光、星空及体积光。网页上标注“项目场景 · 网页展示”。

`TabletPreview.vue` 按项目主页结构展示等待点歌状态，属于不可操作的界面预览。官网连续滚动转场与声波是网页演绎，环境音也不代表实际麦克风返听效果。没有添加产品不具备的社交、评分或角色系统。

## 重新生成

这是可选的素材生成步骤，不属于网站构建依赖。先将对应提交的场景文件和原始品牌 PNG 下载至本地，再运行：

```bash
python -m pip install numpy scipy pyyaml pillow moderngl
python tools/render-product-scene.py /path/to/AudioPrototype.unity /path/to/TsukiVoxFloorLogo.png
```

需要 EGL 上下文，输出到 `public/assets/product-room-opening.webp` 和 `product-room-front.webp`。`product-wordmark.png` 直接复制原始品牌图。
