<template>
  <div class="site" :class="{ 'sound-active': soundActive }">
    <a class="skip-link" href="#product-notes">{{ zh ? '跳过动画，查看产品信息' : 'Skip the film, read product information' }}</a>
    <div class="grain" aria-hidden="true"></div>
    <div class="progress" :style="{ transform: `scaleX(${scrollProgress})` }" aria-hidden="true"></div>
    <header class="site-header">
      <a href="#top" class="brand" aria-label="TsukiVox" @click.prevent="navigate(0)">TsukiVox</a>
      <nav class="desktop-nav" :aria-label="zh ? '主要导航' : 'Main navigation'"><a v-for="(chapter, index) in chapters.slice(1)" :key="chapter.id" :href="`#${chapter.id}`" @click.prevent="navigate(index + 1)"><small>0{{ index + 1 }}</small>{{ chapter.label }}</a></nav>
      <div class="header-actions">
        <button class="sound-toggle" :aria-label="soundActive ? t.common.soundOff : t.common.soundOn" :aria-pressed="soundActive" @click="toggleSound"><span class="sound-bars" aria-hidden="true"><i v-for="n in 4" :key="n"></i></span></button>
        <button class="locale-toggle" :aria-label="zh ? 'Switch to English' : '切换到中文'" @click="toggleLocale">{{ zh ? 'EN' : '中' }}</button>
        <button class="header-cta" @click="openJoin">{{ t.common.join }} <span>↗</span></button>
        <button class="menu-toggle" :aria-label="t.common.menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">{{ menuOpen ? '×' : '☰' }}</button>
      </div>
    </header>
    <nav class="chapter-rail" :aria-label="zh ? '章节导航' : 'Chapter navigation'"><a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`" :class="{ active: activeChapter === index }" :aria-current="activeChapter === index ? 'location' : undefined" @click.prevent="navigate(index)"><i></i><span>{{ String(index).padStart(2, '0') }} / {{ chapter.label }}</span></a></nav>
    <nav v-if="menuOpen" class="mobile-menu" aria-label="移动端导航"><a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`" @click.prevent="navigate(index)"><small>CH. 0{{ index }}</small>{{ chapter.label }}<span>↗</span></a><button class="button" @click="openJoin">{{ t.common.join }}<span>↗</span></button></nav>
    <main :inert="joinOpen || menuOpen">
      <ScrollStory ref="story" :locale="locale" :selected-preset="selectedPreset" @progress="scrollProgress = $event" @scene="activeChapter = $event" @join="openJoin" @preset="selectPreset" />
      <section id="product-notes" class="product-notes">
        <div class="section-label"><span>AFTER THE ENCORE / TSUKIVOX</span><a href="#top" @click.prevent="navigate(0)">{{ zh ? '重看演出' : 'REPLAY THE FILM' }} ↗</a></div>
        <div class="notes-heading"><h2>{{ zh ? '舞台之后。' : 'Behind the stage.' }}</h2><p>{{ t.manifesto.body }}</p></div>
        <div class="feature-notes"><article v-for="card in t.experience.cards" :key="card.index"><span>0{{ Number(card.index) }}</span><h3>{{ card.title }}</h3><p>{{ card.body }}</p></article></div>
        <div id="roadmap" class="roadmap"><h2>{{ zh ? '下一章节。' : 'The next chapter.' }}</h2><details v-for="item in t.roadmap.items" :key="item.version"><summary><span>{{ item.version }}</span><h3>{{ item.title }}</h3><i>+</i></summary><p>{{ item.body }}</p></details></div>
        <footer><span>© {{ currentYear }} ROOTLEECODER</span><p>{{ t.footer.disclaimer }}</p><a href="https://github.com/RootLeeCoder/TsukiVox_OfficialWebsite" target="_blank" rel="noreferrer">GITHUB ↗</a></footer>
      </section>
    </main>
    <dialog ref="joinDialog" class="join-modal" aria-labelledby="join-title" @close="joinOpen = false" @click="onDialogClick"><button class="modal-close" :aria-label="t.common.close" @click="closeJoin">×</button><p class="eyebrow">EARLY ACCESS / META QUEST 3</p><h2 id="join-title">{{ t.join.modalTitle }}</h2><p>{{ t.join.modalBody }}</p><a class="button" :href="issueUrl" target="_blank" rel="noreferrer"><span>{{ t.join.github }}</span><span>↗</span></a><button class="modal-secondary" @click="closeJoin">{{ t.join.later }}</button></dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import ScrollStory from './components/ScrollStory.vue'
import { content, type Locale } from './content'

const locale = ref<Locale>('zh')
const zh = computed(() => locale.value === 'zh')
const t = computed(() => content[locale.value])
const story = ref<{ goTo: (index: number) => void } | null>(null)
const soundActive = ref(false)
const menuOpen = ref(false)
const joinOpen = ref(false)
const joinDialog = ref<HTMLDialogElement | null>(null)
const scrollProgress = ref(0)
const selectedPreset = ref(1)
const activeChapter = ref(0)
const currentYear = new Date().getFullYear()
const chapters = computed(() => [
  { id: 'top', label: zh.value ? '序幕' : 'Prologue' },
  { id: 'room', label: zh.value ? '进入包厢' : 'The room' },
  { id: 'control', label: zh.value ? '随手点歌' : 'Your control' },
  { id: 'sound', label: zh.value ? '声音空间' : 'Voice lab' },
  { id: 'join', label: zh.value ? '下一首' : 'Your next song' }
])
const issueUrl = computed(() => {
  const title = zh.value ? '申请加入 TsukiVox 测试' : 'TsukiVox test request'
  const body = zh.value ? '设备：Meta Quest 3\n想参与测试的原因：\n' : 'Device: Meta Quest 3\nWhy I would like to test TsukiVox:\n'
  return `https://github.com/RootLeeCoder/TsukiVox_OfficialWebsite/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
})
let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let oscillators: OscillatorNode[] = []
let lastFocus: HTMLElement | null = null
const navigate = async (index: number) => {
  menuOpen.value = false
  await nextTick()
  story.value?.goTo(index)
}
const toggleLocale = () => {
  locale.value = zh.value ? 'en' : 'zh'
  menuOpen.value = false
}
const toggleSound = async () => {
  try {
    if (!audioContext) {
      audioContext = new AudioContext()
      masterGain = audioContext.createGain()
      masterGain.gain.value = 0
      masterGain.connect(audioContext.destination)
      oscillators = [55, 82.41, 110].map(frequency => {
        const oscillator = audioContext!.createOscillator()
        oscillator.type = 'sine'
        oscillator.frequency.value = frequency
        oscillator.connect(masterGain!)
        oscillator.start()
        return oscillator
      })
    }
    await audioContext.resume()
    soundActive.value = !soundActive.value
    masterGain?.gain.setTargetAtTime(soundActive.value ? 0.012 : 0, audioContext.currentTime, 0.35)
  } catch {
    soundActive.value = false
  }
}
const selectPreset = (index: number) => {
  selectedPreset.value = index
  if (soundActive.value && audioContext && masterGain) masterGain.gain.setTargetAtTime(0.008 + t.value.audio.presets[index].glow * 0.008, audioContext.currentTime, 0.3)
}
const openJoin = () => {
  lastFocus = document.activeElement as HTMLElement
  menuOpen.value = false
  joinOpen.value = true
  joinDialog.value?.showModal()
}
const closeJoin = () => {
  joinDialog.value?.close()
  lastFocus?.focus()
}
const onDialogClick = (event: MouseEvent) => {
  if (!joinDialog.value || event.target !== joinDialog.value) return
  const box = joinDialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeJoin()
}
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false
}
watch(locale, value => { document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en' })
watch([menuOpen, joinOpen], ([menu, modal]) => { document.body.style.overflow = menu || modal ? 'hidden' : '' })
onMounted(() => { window.addEventListener('keydown', onKey) })
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  oscillators.forEach(oscillator => oscillator.stop())
  audioContext?.close()
  document.body.style.overflow = ''
})
</script>
