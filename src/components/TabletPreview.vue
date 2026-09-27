<template>
  <div class="tablet-preview" aria-hidden="true">
    <div class="tablet-home">
      <div class="tablet-header"><strong><span>◔</span> TsukiVox</strong><span class="tablet-search"><svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>{{ zh ? '搜索点歌' : 'Search' }}</span><span class="tablet-settings">⚙ {{ zh ? '设置' : 'Settings' }}</span></div>
      <div class="tablet-song"><div><small>{{ zh ? '播放队列为空' : 'Your queue is empty' }}</small><h3>{{ zh ? '等待点歌' : 'Choose a song' }}</h3></div><div class="tablet-wave"><i v-for="(height, index) in [20, 38, 58, 30, 50, 24, 40, 16]" :key="index" :style="{ height: `${height / 10}cqw` }"></i></div></div>
      <div class="tablet-transport">
        <span><svg viewBox="0 0 24 24"><path d="M3 10a9 9 0 1 1 1 8M3 3v7h7"/></svg></span>
        <span><svg viewBox="0 0 24 24"><path d="M5 5v14M19 5 8 12l11 7Z"/></svg></span>
        <span>−10</span><span class="tablet-play"><svg viewBox="0 0 24 24"><path d="m7 4 14 8-14 8Z"/></svg></span><span>+10</span>
        <span><svg viewBox="0 0 24 24"><path d="M19 5v14M5 5l11 7L5 19Z"/></svg></span>
        <span class="tablet-mic"><svg viewBox="0 0 24 24"><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></svg></span>
      </div>
      <div class="tablet-mixer"><div><span>{{ zh ? '视频' : 'Video' }}</span><i><b></b></i><span>75%</span></div><div><span>{{ zh ? '人声' : 'Voice' }}</span><i><b style="width: 70%"></b></i><span>70%</span></div></div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ zh: boolean }>()
</script>
