<template>
  <div class="site" :class="{ 'sound-active': soundActive }">
    <a class="skip-link" href="#experience">{{ locale === 'zh' ? '跳到产品介绍' : 'Skip to experience' }}</a>
    <div class="grain" aria-hidden="true"></div>
    <div class="progress" :style="{ transform: `scaleX(${scrollProgress})` }"></div>
    <header class="site-header" :class="{ condensed: headerCondensed }">
      <a href="#top" class="brand" aria-label="TsukiVox" @click="menuOpen = false">TsukiVox</a>
      <nav class="desktop-nav" aria-label="主要导航">
        <a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`"><small>0{{ index + 1 }}</small>{{ chapter.label }}</a>
      </nav>
      <div class="header-actions">
        <button class="sound-toggle" :aria-label="soundActive ? t.common.soundOff : t.common.soundOn" :aria-pressed="soundActive" @click="toggleSound"><span class="sound-bars" aria-hidden="true"><i v-for="n in 4" :key="n"></i></span></button>
        <button class="locale-toggle" :aria-label="locale === 'zh' ? 'Switch to English' : '切换到中文'" @click="toggleLocale">{{ locale === 'zh' ? 'EN' : '中' }}</button>
        <button class="header-cta" @click="openJoin">{{ t.common.join }} <span>↗</span></button>
        <button class="menu-toggle" :aria-label="t.common.menu" :aria-expanded="menuOpen" @click="menuOpen = !menuOpen">{{ menuOpen ? '×' : '☰' }}</button>
      </div>
    </header>
    <nav class="chapter-rail" aria-label="章节导航">
      <a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`" :class="{ active: activeChapter === index }" :aria-current="activeChapter === index ? 'location' : undefined"><i></i><span>CH. 0{{ index + 1 }} / {{ chapter.short }}</span></a>
    </nav>
    <nav v-if="menuOpen" class="mobile-menu" aria-label="移动端导航">
      <a v-for="(chapter, index) in chapters" :key="chapter.id" :href="`#${chapter.id}`" @click="menuOpen = false"><small>CH. 0{{ index + 1 }}</small>{{ chapter.label }}<span>↗</span></a>
      <button class="button" @click="openJoin">{{ t.common.join }} <span>↗</span></button>
    </nav>
    <main :inert="joinOpen || menuOpen">
      <section id="top" class="hero">
        <div class="hero-art" aria-hidden="true"><img :src="moonUrl" alt="" fetchpriority="high" /><div class="hero-shade"></div></div>
        <SpaceCanvas />
        <div class="editorial-grid" aria-hidden="true"><i></i><i></i><i></i><b>+</b><b>+</b></div>
        <div class="hero-body">
          <p class="eyebrow hero-enter">TSUKI / 月 &nbsp; — &nbsp; VOX / 声</p>
          <h1 :class="{ english: locale === 'en' }"><span class="line-mask"><span class="hero-line">{{ locale === 'zh' ? '让你的声音，' : 'A universe' }}</span></span><span class="line-mask"><span class="hero-line italic">{{ locale === 'zh' ? '拥有一整个宇宙。' : 'for your voice.' }}</span></span></h1>
          <div class="hero-bottom hero-enter"><span class="edition">IMMERSIVE<br />VR KARAOKE / 001</span><div><p>{{ locale === 'zh' ? '戴上头显。把世界留在外面。' : 'Headset on. Outside world off.' }}<br />{{ locale === 'zh' ? '这一刻，舞台只属于你。' : 'This moment. This stage. All yours.' }}</p><button class="button" @click="openJoin">{{ t.common.join }}<span>↗</span></button></div></div>
        </div>
        <div class="hero-foot"><span>META QUEST 3 · SOLO EXPERIENCE</span><a href="#experience">{{ locale === 'zh' ? '向下滚动，进入另一种现实' : 'SCROLL INTO ANOTHER REALITY' }}<span>↓</span></a><span>01 — 04</span></div>
      </section>
      <section id="experience" class="manifesto paper chapter">
        <div class="section-label"><span>CH. 01 / THE EXPERIENCE</span><span>从现实，进入歌声 / INTO THE SOUND</span></div>
        <div class="manifesto-layout">
          <div class="margin-note"><span class="tiny-mark">✳</span><p>LESS DISTANCE.<br />MORE FEELING.</p></div>
          <div><h2 class="statement"><span v-for="(line, index) in statement" :key="index" class="statement-line">{{ line }}</span></h2><div class="manifesto-description"><span>(01 — 03)</span><p>{{ t.manifesto.body }}</p></div></div>
        </div>
        <div class="feature-list">
          <article v-for="card in t.experience.cards" :key="card.index" data-reveal><span class="feature-number">{{ card.index }}</span><h3>{{ card.title }}<small>{{ card.subtitle }}</small></h3><p>{{ card.body }}</p><span class="feature-symbol" aria-hidden="true">{{ card.index === '01' ? '∿' : card.index === '02' ? '⌕' : '↗' }}</span></article>
        </div>
      </section>
      <section id="room" class="room chapter">
        <div class="room-sticky">
          <div class="room-image"><img :src="heroUrl" :alt="locale === 'zh' ? 'TsukiVox 月下演唱厅概念图' : 'TsukiVox moonlit karaoke room concept artwork'" loading="lazy" /></div>
          <div class="room-overlay"></div>
          <div class="section-label"><span>CH. 02 / THE ROOM</span><span>{{ locale === 'zh' ? '空间概念视觉' : 'CONCEPT VISUAL' }}</span></div>
          <div class="room-title" data-reveal><p class="eyebrow">YOUR PRIVATE STAGE</p><h2>{{ locale === 'zh' ? '世界很大。' : 'A big world.' }}<br /><em>{{ locale === 'zh' ? '此刻，只听见你。' : 'Just your voice.' }}</em></h2></div>
          <div class="room-hotspots">
            <button v-for="(point, index) in t.room.points" :key="index" :style="{ left: point.x, top: point.y }" :class="{ selected: selectedPoint === index }" :aria-label="point.label" :aria-pressed="selectedPoint === index" @click="selectedPoint = index">0{{ index + 1 }}</button>
          </div>
          <div class="room-caption"><span>0{{ selectedPoint + 1 }} / 03</span><div :key="selectedPoint"><h3>{{ t.room.points[selectedPoint].label }}</h3><p>{{ t.room.points[selectedPoint].detail }}</p></div><div class="room-switch"><button :aria-label="locale === 'zh' ? '上一个热点' : 'Previous point'" @click="selectedPoint = (selectedPoint + 2) % 3">←</button><button :aria-label="locale === 'zh' ? '下一个热点' : 'Next point'" @click="selectedPoint = (selectedPoint + 1) % 3">→</button></div></div>
        </div>
      </section>
      <section id="sound" class="sound chapter">
        <div class="section-label"><span>CH. 03 / VOICE LAB</span><span>01 MIC. 04 PERSONALITIES.</span></div>
        <div class="sound-layout"><div class="sound-copy" data-reveal><p class="eyebrow">FIND YOUR RESONANCE</p><h2>{{ locale === 'zh' ? '同一个你。' : 'One voice.' }}<br /><em>{{ locale === 'zh' ? '不同的回响。' : 'Infinite feeling.' }}</em></h2><p>{{ t.audio.description }}</p><small class="simulation-note">{{ locale === 'zh' ? '网页展示为视觉模拟；声音开关播放环境音。' : 'Visual simulation. The sound toggle plays an ambient tone.' }}</small></div>
          <div class="voice-visual" :style="{ '--intensity': activePreset.glow }"><div class="signal-orbits" aria-hidden="true"><i v-for="n in 12" :key="n" :style="{ '--i': n }"></i></div><div class="voice-readout"><span>VOCAL SPACE / {{ activePreset.code }}</span><strong>{{ activePreset.room }}</strong><p>{{ activePreset.name }}</p></div></div>
        </div>
        <div class="preset-list" role="group" :aria-label="locale === 'zh' ? '人声预设' : 'Voice presets'"><button v-for="(preset, index) in t.audio.presets" :key="preset.code" :aria-pressed="selectedPreset === index" :class="{ active: selectedPreset === index }" @click="selectPreset(index)"><span>0{{ index + 1 }} / {{ preset.code }}</span><strong>{{ preset.name }}</strong><i>↗</i></button></div>
        <p class="preset-detail" aria-live="polite">{{ activePreset.detail }}</p>
      </section>
      <section class="flow paper">
        <div class="section-label"><span>HEADSET ON. WORLD OFF.</span><span>SEARCH → SING</span></div>
        <div class="flow-heading" data-reveal><h2>{{ locale === 'zh' ? '从「想唱」，' : 'From a thought,' }}<br /><em>{{ locale === 'zh' ? '到第一句。' : 'to the first note.' }}</em></h2><p>{{ t.flow.description }}</p></div>
        <div class="flow-steps"><article v-for="step in t.flow.steps" :key="step.number" data-reveal><span>{{ step.number }}</span><h3>{{ step.title }}</h3><p>{{ step.body }}</p></article></div>
      </section>
      <section id="roadmap" class="roadmap paper chapter">
        <div class="section-label"><span>CH. 04 / NEXT CHAPTER</span><span>WORK IN PROGRESS</span></div>
        <h2 data-reveal>{{ locale === 'zh' ? '好声音，' : 'Good things' }}<em>{{ locale === 'zh' ? '还在生长。' : 'keep growing.' }}</em></h2>
        <details v-for="(item, index) in t.roadmap.items" :key="item.version" :open="index === 0"><summary><span>{{ item.version }}</span><h3>{{ item.title }}</h3><i>+</i></summary><p>{{ item.body }}</p></details>
      </section>
      <section id="join" class="join-section">
        <div class="join-art" aria-hidden="true"><img :src="moonUrl" alt="" loading="lazy" /></div>
        <div class="join-content" data-reveal><p class="eyebrow">THE NEXT SONG IS YOURS</p><h2>{{ locale === 'zh' ? '下一首，' : 'Your stage.' }}<br /><em>{{ locale === 'zh' ? '留给你。' : 'Your next song.' }}</em></h2><button class="button" @click="openJoin">{{ t.common.join }}<span>↗</span></button><p>{{ t.join.availability }}</p></div>
        <footer><a href="#top" class="footer-wordmark">TsukiVox</a><div class="footer-line"><span>© {{ currentYear }} ROOTLEECODER</span><span>{{ t.footer.tagline }}</span><a href="https://github.com/RootLeeCoder/TsukiVox_OfficialWebsite" target="_blank" rel="noreferrer">GITHUB ↗</a></div><p class="disclaimer">{{ t.footer.disclaimer }}</p></footer>
      </section>
    </main>
    <dialog ref="joinDialog" class="join-modal" aria-labelledby="join-title" @close="joinOpen = false" @click="onDialogClick"><button class="modal-close" :aria-label="t.common.close" @click="closeJoin">×</button><p class="eyebrow">EARLY ACCESS / META QUEST 3</p><h2 id="join-title">{{ t.join.modalTitle }}</h2><p>{{ t.join.modalBody }}</p><a class="button" :href="issueUrl" target="_blank" rel="noreferrer"><span>{{ t.join.github }}</span><span>↗</span></a><button class="modal-secondary" @click="closeJoin">{{ t.join.later }}</button></dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { content, type Locale } from './content'

const SpaceCanvas = defineAsyncComponent(() => import('./components/SpaceCanvas.vue'))
const locale = ref<Locale>('zh')
const soundActive = ref(false)
const menuOpen = ref(false)
const joinOpen = ref(false)
const joinDialog = ref<HTMLDialogElement | null>(null)
const headerCondensed = ref(false)
const scrollProgress = ref(0)
const selectedPreset = ref(1)
const selectedPoint = ref(0)
const activeChapter = ref(0)
const currentYear = new Date().getFullYear()
const heroUrl = `${import.meta.env.BASE_URL}assets/tsukivox-hero.webp`
const moonUrl = `${import.meta.env.BASE_URL}assets/tsukivox-moon.webp`
const t = computed(() => content[locale.value])
const activePreset = computed(() => t.value.audio.presets[selectedPreset.value])
const statement = computed(() => locale.value === 'zh' ? ['不止听见。', '置身其中。', '尽情开唱。'] : ['Don’t just listen.', 'Step inside.', 'Sing it all out.'])
const chapters = computed(() => [
  { id: 'experience', label: t.value.nav.experience, short: 'EXPERIENCE' },
  { id: 'room', label: t.value.nav.room, short: 'THE ROOM' },
  { id: 'sound', label: t.value.nav.sound, short: 'VOICE LAB' },
  { id: 'roadmap', label: t.value.nav.roadmap, short: 'WHAT’S NEXT' }
])
const issueUrl = computed(() => {
  const title = locale.value === 'zh' ? '申请加入 TsukiVox 测试' : 'TsukiVox test request'
  const body = locale.value === 'zh' ? '设备：Meta Quest 3\n想参与测试的原因：\n' : 'Device: Meta Quest 3\nWhy I would like to test TsukiVox:\n'
  return `https://github.com/RootLeeCoder/TsukiVox_OfficialWebsite/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
})
let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let oscillators: OscillatorNode[] = []
let lenis: Lenis | null = null
let tickerHandler: ((time: number) => void) | null = null
let gsapContext: gsap.Context | null = null
let observer: IntersectionObserver | null = null
let lastFocus: HTMLElement | null = null

const toggleSound = async () => {
  try {
    if (!audioContext) {
      audioContext = new AudioContext()
      masterGain = audioContext.createGain()
      masterGain.gain.value = 0
      masterGain.connect(audioContext.destination)
      oscillators = [55, 82.41, 110].map((frequency) => {
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
const toggleLocale = async () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  menuOpen.value = false
  await nextTick()
  ScrollTrigger.refresh()
}
const selectPreset = (index: number) => {
  selectedPreset.value = index
  if (soundActive.value && audioContext && masterGain) masterGain.gain.setTargetAtTime(0.008 + activePreset.value.glow * 0.008, audioContext.currentTime, 0.3)
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
  if (event.target !== joinDialog.value) return
  const box = joinDialog.value.getBoundingClientRect()
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeJoin()
}
const updateScroll = () => {
  scrollProgress.value = Math.min(window.scrollY / Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), 1)
  headerCondensed.value = window.scrollY > 60
}
const onKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false
}
watch(locale, value => { document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en' })
watch([menuOpen, joinOpen], ([menu, modal]) => {
  document.body.style.overflow = menu || modal ? 'hidden' : ''
  if (menu || modal) lenis?.stop()
  else lenis?.start()
})
onMounted(async () => {
  gsap.registerPlugin(ScrollTrigger)
  await nextTick()
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true, syncTouch: false, anchors: true })
    lenis.on('scroll', ScrollTrigger.update)
    tickerHandler = time => lenis?.raf(time * 1000)
    gsap.ticker.add(tickerHandler)
    gsapContext = gsap.context(() => {
      gsap.from('.hero-line', { yPercent: 110, rotate: 3, duration: 1.5, stagger: 0.15, ease: 'power4.out', clearProps: 'all' })
      gsap.from('.hero-enter', { y: 24, opacity: 0, duration: 1, stagger: 0.15, delay: 0.5, clearProps: 'all' })
      gsap.to('.hero-art img', { scale: 1.18, yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      gsap.utils.toArray<HTMLElement>('.statement-line').forEach(line => {
        gsap.fromTo(line, { opacity: 0.2 }, { opacity: 1, scrollTrigger: { trigger: line, start: 'top 85%', end: 'top 50%', scrub: true } })
      })
      gsap.fromTo('.room-image', { clipPath: 'inset(12% 16% 12% 16%)', scale: 0.93 }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, ease: 'none', scrollTrigger: { trigger: '.room', start: 'top 70%', end: 'top top', scrub: 1 } })
      gsap.to('.room-image img', { scale: 1.16, ease: 'none', scrollTrigger: { trigger: '.room', start: 'top top', end: 'bottom bottom', scrub: true } })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => {
        gsap.from(element, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 92%', once: true }, clearProps: 'all' })
      })
    })
  }
  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const index = chapters.value.findIndex(chapter => chapter.id === entry.target.id)
        if (index >= 0) activeChapter.value = index
      }
    })
  }, { rootMargin: '-20% 0px -40% 0px' })
  document.querySelectorAll('.chapter').forEach(section => observer?.observe(section))
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  updateScroll()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('keydown', onKey)
  if (tickerHandler) gsap.ticker.remove(tickerHandler)
  lenis?.destroy()
  gsapContext?.revert()
  oscillators.forEach(oscillator => oscillator.stop())
  audioContext?.close()
  document.body.style.overflow = ''
})
</script>
