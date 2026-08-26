export type Locale = 'zh' | 'en'

export const content = {
  zh: {
    nav: {
      experience: '沉浸体验',
      sound: '声音实验室',
      room: '未来包厢',
      roadmap: '下一章节'
    },
    common: {
      join: '加入测试',
      explore: '开始探索',
      soundOn: '开启声音',
      soundOff: '关闭声音',
      menu: '打开菜单',
      close: '关闭'
    },
    hero: {
      eyebrow: 'META QUEST 3 · IMMERSIVE VR KARAOKE',
      lineOne: '把舞台',
      lineTwo: '戴在头上',
      description: '在只属于你的未来包厢里点歌、返听、演唱。灯光追随节拍，空间回应声音，每一次开口都有自己的宇宙。',
      note: '当前版本 V0.78 · Quest 3 原生单人体验',
      scroll: '向下进入包厢'
    },
    manifesto: {
      eyebrow: 'NOT A SCREEN. A PLACE.',
      title: 'K歌不该只是盯着一块屏幕。',
      body: 'TsukiVox 把熟悉的点歌、返听和播放，重新放回一个有距离、有光、有回声的空间。戴上头显，沙发、大屏、麦克风和你的歌声都在场。'
    },
    experience: {
      eyebrow: 'THE EXPERIENCE',
      title: '一台 Quest，完成整场演出。',
      description: '从找到一首歌，到把最后一个尾音留在房间里，所有动作都在头显内自然发生。',
      cards: [
        {
          index: '01',
          title: '实时听见自己',
          subtitle: 'LOW-LATENCY MONITORING',
          body: 'Quest 3 内置麦克风实时返听，四档人声预设从干声参考到浓郁 KTV 空间，随时找到舒服的位置。',
          accent: 'cyan'
        },
        {
          index: '02',
          title: '在头显里完成点歌',
          subtitle: 'DIRECT SEARCH',
          body: '世界空间软键盘、拼音候选与清晰的下载进度，让搜索、点播、排队和切歌不需要离开包厢。',
          accent: 'violet'
        },
        {
          index: '03',
          title: '空间就是控制器',
          subtitle: 'SPATIAL INTERACTION',
          body: '右手麦克风、左手荧光棒、茶几平板和大屏共同组成可触碰的界面，控制不再像操作传统菜单。',
          accent: 'magenta'
        }
      ]
    },
    audio: {
      eyebrow: 'VOICE LAB',
      title: '先让声音，找到它的房间。',
      description: '四种实时人声空间，从忠实参考到舞台感十足。点击预设，看见房间如何回应。',
      input: 'MIC INPUT',
      output: 'ROOM OUTPUT',
      presets: [
        { name: '干声参考', code: 'DRY', detail: '最直接的声音反馈，适合校准与练习。', room: '0%', glow: 0.18 },
        { name: 'KTV 包厢', code: 'ROOM', detail: '自然的近场混响，日常演唱的平衡选择。', room: '48%', glow: 0.52 },
        { name: '浓郁 KTV', code: 'STRONG', detail: '更长的尾韵与更宽的空间，适合抒情与高音。', room: '82%', glow: 0.9 },
        { name: '安全小房间', code: 'SAFE', detail: '控制增益与反馈风险，保留清晰度和包裹感。', room: '32%', glow: 0.36 }
      ]
    },
    flow: {
      eyebrow: 'DIRECT-ONLY',
      title: '没有中间服务，歌声与内容都留在头显。',
      description: 'Quest 直接完成搜索、解析、下载、缓存与本地播放。更少依赖，也更接近一台随开随唱的独立设备。',
      steps: [
        { number: '01', title: '搜索', body: '歌名、歌手、BV号或链接' },
        { number: '02', title: '下载', body: '显示进度并写入本地缓存' },
        { number: '03', title: '排队', body: '播放、暂停、切歌与重播' },
        { number: '04', title: '开唱', body: '视频大屏与实时人声空间同步' }
      ]
    },
    room: {
      eyebrow: 'YOUR PRIVATE STAGE',
      title: '今晚，整间包厢只为一个人亮灯。',
      description: '大屏、沙发、茶几、灯带与手持道具共同构成一个真正有方位感的演唱空间。',
      points: [
        { label: '超宽演唱大屏', detail: '自动适配视频画面比例', x: '63%', y: '36%' },
        { label: '月牙舞台装置', detail: '品牌灯光与声波视觉核心', x: '39%', y: '58%' },
        { label: '茶几控制区', detail: '点歌、队列、人声与设置', x: '59%', y: '78%' }
      ]
    },
    roadmap: {
      eyebrow: 'NEXT CHAPTER',
      title: '现在能唱。接下来，要更好唱。',
      items: [
        { version: 'V0.8', title: '音频引擎打磨', body: '更舒适的人声预设、更清晰的增益结构与更稳妥的反馈保护。' },
        { version: 'V0.9', title: '稳定性与缓存管理', body: '任务重试、缓存清理、网络恢复和更完整的异常处理。' },
        { version: 'FUTURE', title: '练歌的新可能', body: '歌词偏移、录音回放、评分、持久歌单与更多房间主题。' }
      ]
    },
    join: {
      eyebrow: 'EARLY ACCESS',
      title: '下一首，留给你。',
      description: 'TsukiVox 正在 Quest 3 上持续打磨。加入测试名单，成为最早走进月下演唱厅的人。',
      availability: '目前面向 Meta Quest 3 · 单人体验',
      modalTitle: '加入 TsukiVox 测试',
      modalBody: '测试招募通道正在准备中。你可以先前往官网项目提交申请并关注最新进展。',
      github: '前往 GitHub 提交申请',
      later: '暂时先逛逛'
    },
    footer: {
      tagline: '让歌声，在月光里有了形状。',
      status: 'V0.78 · QUEST 3',
      disclaimer: 'TsukiVox 是独立项目，与 Meta、Bilibili 无隶属或合作关系。'
    }
  },
  en: {
    nav: {
      experience: 'Experience',
      sound: 'Voice Lab',
      room: 'The Room',
      roadmap: 'Roadmap'
    },
    common: {
      join: 'Join the Test',
      explore: 'Enter the Room',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      menu: 'Open menu',
      close: 'Close'
    },
    hero: {
      eyebrow: 'META QUEST 3 · IMMERSIVE VR KARAOKE',
      lineOne: 'Put the stage',
      lineTwo: 'on your head',
      description: 'Search, monitor and sing inside a private room built around you. Lights follow the beat, space answers your voice, and every note gets its own universe.',
      note: 'Current build V0.78 · Native solo experience for Quest 3',
      scroll: 'Scroll into the room'
    },
    manifesto: {
      eyebrow: 'NOT A SCREEN. A PLACE.',
      title: 'Karaoke should feel bigger than a screen.',
      body: 'TsukiVox puts song search, live monitoring and playback back into a space with distance, light and echo. Put on the headset—the sofa, screen, microphone and your voice are all present.'
    },
    experience: {
      eyebrow: 'THE EXPERIENCE',
      title: 'One Quest. The whole performance.',
      description: 'From finding the song to letting the final note fade, everything happens naturally inside the headset.',
      cards: [
        {
          index: '01',
          title: 'Hear yourself, live',
          subtitle: 'LOW-LATENCY MONITORING',
          body: 'Live monitoring through the Quest 3 microphone with four vocal spaces, from an honest dry reference to a rich KTV room.',
          accent: 'cyan'
        },
        {
          index: '02',
          title: 'Search inside the headset',
          subtitle: 'DIRECT SEARCH',
          body: 'A world-space keyboard, pinyin suggestions and visible download progress keep search, queue and playback inside the room.',
          accent: 'violet'
        },
        {
          index: '03',
          title: 'The room is the controller',
          subtitle: 'SPATIAL INTERACTION',
          body: 'A right-hand microphone, left-hand light stick, table tablet and giant screen turn controls into objects you can reach.',
          accent: 'magenta'
        }
      ]
    },
    audio: {
      eyebrow: 'VOICE LAB',
      title: 'Give your voice a room first.',
      description: 'Four live vocal spaces, from a faithful reference to a full stage. Pick a preset and watch the room answer.',
      input: 'MIC INPUT',
      output: 'ROOM OUTPUT',
      presets: [
        { name: 'Dry Reference', code: 'DRY', detail: 'The most direct feedback for calibration and practice.', room: '0%', glow: 0.18 },
        { name: 'KTV Room', code: 'ROOM', detail: 'Balanced near-field reverb for everyday singing.', room: '48%', glow: 0.52 },
        { name: 'Strong KTV', code: 'STRONG', detail: 'A longer tail and wider space for ballads and high notes.', room: '82%', glow: 0.9 },
        { name: 'Safe Small Room', code: 'SAFE', detail: 'Controlled gain and feedback risk without losing clarity.', room: '32%', glow: 0.36 }
      ]
    },
    flow: {
      eyebrow: 'DIRECT-ONLY',
      title: 'No middle service. Content and voice stay on the headset.',
      description: 'Quest handles search, resolution, download, cache and local playback directly—fewer dependencies, closer to a standalone karaoke device.',
      steps: [
        { number: '01', title: 'Search', body: 'Song, artist, BV ID or link' },
        { number: '02', title: 'Download', body: 'Visible progress and local cache' },
        { number: '03', title: 'Queue', body: 'Play, pause, skip and replay' },
        { number: '04', title: 'Sing', body: 'Video and live vocal space in sync' }
      ]
    },
    room: {
      eyebrow: 'YOUR PRIVATE STAGE',
      title: 'Tonight, the whole room lights up for one.',
      description: 'A giant screen, sofa, table, light strips and handheld props form a performance space with real direction and presence.',
      points: [
        { label: 'Ultra-wide screen', detail: 'Automatic video aspect fitting', x: '63%', y: '36%' },
        { label: 'Crescent stage', detail: 'The visual heart of light and sound', x: '39%', y: '58%' },
        { label: 'Table controls', detail: 'Search, queue, voice and settings', x: '59%', y: '78%' }
      ]
    },
    roadmap: {
      eyebrow: 'NEXT CHAPTER',
      title: 'It sings now. Next, it sings better.',
      items: [
        { version: 'V0.8', title: 'Audio engine polish', body: 'More comfortable presets, clearer gain structure and stronger feedback protection.' },
        { version: 'V0.9', title: 'Stability and cache', body: 'Retries, cleanup, network recovery and fuller error handling.' },
        { version: 'FUTURE', title: 'New ways to practise', body: 'Lyric offset, recording playback, scoring, persistent playlists and more room themes.' }
      ]
    },
    join: {
      eyebrow: 'EARLY ACCESS',
      title: 'The next song is yours.',
      description: 'TsukiVox is being refined on Quest 3. Join the test list and be among the first inside the moonlit room.',
      availability: 'Currently for Meta Quest 3 · Solo experience',
      modalTitle: 'Join the TsukiVox test',
      modalBody: 'The test channel is being prepared. For now, submit a request through the website project and follow the latest progress.',
      github: 'Apply on GitHub',
      later: 'Keep exploring'
    },
    footer: {
      tagline: 'Give every voice a shape in moonlight.',
      status: 'V0.78 · QUEST 3',
      disclaimer: 'TsukiVox is an independent project and is not affiliated with Meta or Bilibili.'
    }
  }
} as const
