<template>
  <div ref="track" class="story-track" :class="{ 'reduced-story': reducedMotion }" :data-progress="progress.toFixed(4)">
    <div ref="stage" class="story-stage" :data-scene="scene">
      <div class="stage-base"></div>
      <div class="opening-world" aria-hidden="true"><img :src="moonUrl" alt="" fetchpriority="high" /><div></div></div>
      <div class="blue-world" aria-hidden="true"></div>
      <div class="portal-mask" aria-hidden="true">
        <div class="room-card"><img :src="roomUrl" alt="" /><div class="room-shadow"></div><div class="card-edge"></div></div>
      </div>
      <div class="portal-ring" aria-hidden="true"><i></i><i></i><i></i></div>
      <div class="signal-object" aria-hidden="true"><SignalField :progress="progress" :fold="signalFold" :strength="activePreset.glow" /></div>
      <div class="closing-iris" aria-hidden="true"></div>
      <div class="stage-rules" aria-hidden="true"><i></i><i></i><i></i><b>+</b><b>+</b></div>

      <section class="film-copy opening-copy" :inert="scene !== 0" :aria-hidden="scene !== 0">
        <p class="eyebrow">TSUKI / 月 — VOX / 声</p>
        <h1><span class="word-line">{{ zh ? '把世界，' : 'Leave the' }}</span><span class="word-line"><em>{{ zh ? '留在外面。' : 'world outside.' }}</em></span></h1>
        <p class="film-description">{{ zh ? '戴上头显。下一刻，只有你和你的声音。' : 'Headset on. Just you, and everything you want to sing.' }}</p>
        <button class="button" @click="emit('join')">{{ t.common.join }}<span>↗</span></button>
      </section>
      <div class="threshold-copy" aria-hidden="true"><span>{{ zh ? '现实退场。' : 'Reality fades.' }}</span><em>{{ zh ? '你的舞台入场。' : 'Your stage begins.' }}</em></div>
      <section class="film-copy room-copy" :inert="scene !== 1" :aria-hidden="scene !== 1">
        <p class="eyebrow">01 / STEP INSIDE</p><h2><span class="word-line">{{ zh ? '这一整个房间，' : 'The whole room.' }}</span><span class="word-line"><em>{{ zh ? '只为你亮灯。' : 'Just for you.' }}</em></span></h2>
        <p class="film-description">{{ t.room.description }}</p>
      </section>
      <div class="room-interaction" :inert="scene !== 1" :aria-hidden="scene !== 1">
        <div class="film-hotspots"><button v-for="(point, index) in t.room.points" :key="index" :style="{ left: point.x, top: point.y }" :aria-label="point.label" :aria-pressed="selectedPoint === index" @click="selectedPoint = index">0{{ index + 1 }}</button></div>
        <div class="film-caption"><span>0{{ selectedPoint + 1 }} / 03</span><p><strong>{{ t.room.points[selectedPoint].label }}</strong>{{ t.room.points[selectedPoint].detail }}</p><small>{{ zh ? '空间概念视觉' : 'CONCEPT VISUAL' }}</small></div>
      </div>
      <section class="film-copy control-copy" :inert="scene !== 2" :aria-hidden="scene !== 2">
        <p class="eyebrow">02 / FROM SEARCH TO SING</p><h2><span class="word-line">{{ zh ? '伸手。点歌。' : 'Reach. Choose.' }}</span><span class="word-line"><em>{{ zh ? '轮到你开唱。' : 'Make it yours.' }}</em></span></h2>
        <p class="film-description">{{ zh ? '搜索、下载、排队、播放。所有动作，都在头显内发生。' : 'Search, download, queue and play. Everything happens inside the headset.' }}</p>
        <div class="film-flow"><div v-for="step in t.flow.steps" :key="step.number"><span>{{ step.number }}</span><strong>{{ step.title }}</strong></div></div>
      </section>
      <div class="screen-caption" aria-hidden="true"><span>TSUKIVOX / YOUR CONTROL ROOM</span><span>QUEST → LOCAL</span></div>
      <section class="film-copy voice-copy" :inert="scene !== 3" :aria-hidden="scene !== 3">
        <p class="eyebrow">03 / FEEL YOUR VOICE</p><h2><span class="word-line">{{ zh ? '声音，' : 'Your voice,' }}</span><span class="word-line"><em>{{ zh ? '让空间有了形状。' : 'shapes the room.' }}</em></span></h2>
      </section>
      <div class="voice-controls" :inert="scene !== 3" :aria-hidden="scene !== 3">
        <div class="film-presets" role="group" :aria-label="zh ? '人声预设' : 'Voice presets'"><button v-for="(preset, index) in t.audio.presets" :key="preset.code" :aria-pressed="selectedPreset === index" @click="emit('preset', index)"><span>0{{ index + 1 }} / {{ preset.code }}</span><strong>{{ preset.name }}</strong></button></div>
        <p aria-live="polite">{{ activePreset.detail }}<small>{{ zh ? '视觉模拟 · 环境音需主动开启' : 'VISUAL SIMULATION · SOUND OFF BY DEFAULT' }}</small></p>
      </div>
      <div class="gather-copy" aria-hidden="true"><span>{{ zh ? '每一道回响，' : 'Every echo.' }}</span><em>{{ zh ? '最后都成为你。' : 'Entirely you.' }}</em></div>
      <section class="final-copy" :inert="scene !== 4" :aria-hidden="scene !== 4">
        <p class="eyebrow">04 / THE NEXT SONG IS YOURS</p><div class="final-word" aria-label="TsukiVox"><span>TsukiV</span><i>o</i><span>x</span></div>
        <h2>{{ zh ? '下一首，留给你。' : 'The next song is yours.' }}</h2><button class="button" @click="emit('join')">{{ t.common.join }}<span>↗</span></button><p class="final-note">{{ t.join.availability }}</p>
      </section>
      <div class="film-hud"><span>{{ labels[scene] }}</span><div class="film-hud-line"><i :style="{ transform: `scaleX(${progress})` }"></i></div><span>{{ String(Math.round(progress * 100)).padStart(3, '0') }} / 100</span></div>
      <button v-if="progress < 0.04" class="scroll-invitation" @click="goTo(1)">{{ zh ? '滚动，让舞台展开' : 'SCROLL TO UNFOLD' }}<span>↓</span></button>
    </div>
    <div v-if="reducedMotion" class="reduced-nav" aria-label="场景选择"><button v-for="(label, index) in labels" :key="index" :aria-pressed="scene === index" @click="goTo(index)">{{ label }}</button></div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SignalField from './SignalField.vue'
import { content, type Locale } from '../content'

const props = defineProps<{ locale: Locale, selectedPreset: number }>()
const emit = defineEmits<{ join: [], preset: [index: number], progress: [value: number], scene: [index: number] }>()
const track = ref<HTMLDivElement | null>(null)
const stage = ref<HTMLDivElement | null>(null)
const progress = ref(0)
const selectedPoint = ref(0)
const scene = ref(0)
const signalFold = ref(0)
const reducedMotion = ref(false)
const zh = computed(() => props.locale === 'zh')
const t = computed(() => content[props.locale as Locale])
const activePreset = computed(() => t.value.audio.presets[props.selectedPreset])
const labels = ['PROLOGUE', 'THE ROOM', 'YOUR CONTROL', 'VOICE LAB', 'YOUR NEXT SONG']
const stops = [0, 0.33, 0.46, 0.645, 0.96]
const moonUrl = `${import.meta.env.BASE_URL}assets/tsukivox-moon.webp`
const roomUrl = `${import.meta.env.BASE_URL}assets/tsukivox-hero.webp`
let context: gsap.Context | null = null
let timeline: gsap.core.Timeline | null = null
let trigger: ScrollTrigger | null = null
let resizeFrame = 0
let motionQuery: MediaQueryList | null = null
const state = { fold: 0 }

const sync = () => {
  if (!timeline) return
  progress.value = timeline.progress()
  signalFold.value = state.fold
  const p = progress.value
  scene.value = p < 0.23 ? 0 : p < 0.385 ? 1 : p < 0.535 ? 2 : p < 0.785 ? 3 : 4
  emit('progress', p)
  emit('scene', scene.value)
}
const goTo = (index: number) => {
  if (!track.value) return
  const p = stops[Math.max(0, Math.min(index, 4))]
  if (reducedMotion.value) {
    timeline?.progress(p)
    sync()
    track.value.scrollIntoView({ behavior: 'auto', block: 'start' })
    return
  }
  const top = window.scrollY + track.value.getBoundingClientRect().top
  const distance = track.value.offsetHeight - (stage.value?.offsetHeight || window.innerHeight)
  window.scrollTo({ top: top + distance * p, behavior: 'smooth' })
}
defineExpose({ goTo })

const setup = () => {
  const selectedScene = scene.value
  context?.revert()
  trigger = null
  reducedMotion.value = motionQuery?.matches || false
  const compact = window.innerWidth <= 760
  context = gsap.context(() => {
    gsap.set('.room-copy, .room-interaction, .control-copy, .screen-caption, .voice-copy, .voice-controls, .threshold-copy, .gather-copy, .final-copy', { autoAlpha: 0 })
    gsap.set('.portal-mask', { clipPath: 'circle(0vmax at 73% 42%)' })
    gsap.set('.portal-ring', { xPercent: -50, yPercent: -50, left: '73%', top: '42%', width: '0vmin', height: '0vmin', autoAlpha: 0 })
    gsap.set('.signal-object', { autoAlpha: 0, scaleY: 0.005 })
    gsap.set('.closing-iris', { clipPath: 'circle(0vmax at 50% 50%)' })
    gsap.set('.blue-world', { opacity: 0 })
    state.fold = 0
    const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' }, onUpdate: sync })
    timeline = tl
    tl.to('.opening-world img', { scale: 1.13, xPercent: -3, duration: 20, ease: 'none' }, 0)
      .to('.opening-copy .word-line', { yPercent: -140, x: -45, rotate: -4, opacity: 0, stagger: 1.1, duration: 9 }, 6)
      .to('.opening-copy .eyebrow, .opening-copy .film-description, .opening-copy .button', { y: -30, opacity: 0, duration: 6, stagger: 0.7 }, 7)
      .to('.stage-rules i:nth-child(1)', { yPercent: -80, scaleX: 0.6, duration: 14 }, 8)
      .to('.portal-ring', { autoAlpha: 1, width: compact ? '48vmin' : '36vmin', height: compact ? '48vmin' : '36vmin', duration: 5 }, 10)
      .to('.portal-mask', { clipPath: compact ? 'circle(24vmin at 73% 42%)' : 'circle(18vmin at 73% 42%)', duration: 5 }, 10)
      .to('.portal-ring', { left: '50%', top: '50%', rotation: 80, duration: 7 }, 15)
      .to('.portal-mask', { clipPath: compact ? 'circle(24vmin at 50% 50%)' : 'circle(18vmin at 50% 50%)', duration: 7 }, 15)
      .to('.opening-world', { opacity: 0.22, duration: 10 }, 10)
      .fromTo('.threshold-copy', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 4 }, 14)
      .to('.threshold-copy', { y: -50, autoAlpha: 0, duration: 4 }, 21)
      .to('.portal-ring', { width: '210vmax', height: '210vmax', rotation: 170, duration: 8 }, 22)
      .to('.portal-mask', { clipPath: 'circle(105vmax at 50% 50%)', duration: 8 }, 22)
      .to('.opening-world', { opacity: 0, duration: 4 }, 26)
      .fromTo('.room-copy', { y: 75, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 5 }, 25)
      .to('.room-interaction', { autoAlpha: 1, duration: 4 }, 29)
      .to('.room-card img', { scale: 1.1, duration: 10, ease: 'none' }, 29)
      .to('.room-copy', { xPercent: -45, rotate: -5, autoAlpha: 0, duration: 6 }, 35)
      .to('.room-interaction', { autoAlpha: 0, duration: 4 }, 35)
      .to('.blue-world', { opacity: 1, duration: 8 }, 35)
      .to('.room-card', { scaleX: compact ? 0.84 : 0.52, scaleY: compact ? 0.30 : 0.54, xPercent: compact ? 0 : 22, yPercent: compact ? 20 : 2, rotationY: compact ? -7 : -22, rotationZ: compact ? -5 : -7, borderRadius: 22, duration: 9 }, 35)
      .to('.room-card img', { scale: 1, duration: 8 }, 35)
      .fromTo('.control-copy', { x: -90, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 5 }, 39)
      .fromTo('.film-flow > div', { y: 35, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.7, duration: 2 }, 40)
      .to('.screen-caption', { autoAlpha: 1, duration: 3 }, 41)
      .to('.room-card', { scaleX: 0.83, scaleY: 0.003, xPercent: 0, yPercent: 7, rotationY: 0, rotationZ: 0, borderRadius: 0, duration: 7 }, 47)
      .to('.control-copy', { y: -90, autoAlpha: 0, duration: 5 }, 48)
      .to('.screen-caption', { autoAlpha: 0, duration: 3 }, 48)
      .to('.signal-object', { autoAlpha: 1, scaleY: 1, duration: 7 }, 51)
      .to('.portal-mask', { autoAlpha: 0, duration: 2 }, 54)
      .fromTo('.voice-copy', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 5 }, 55)
      .fromTo('.voice-controls', { y: 80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 5 }, 58)
      .to('.voice-copy', { xPercent: -25, autoAlpha: 0, duration: 6 }, 68)
      .to('.voice-controls', { y: 85, autoAlpha: 0, duration: 5 }, 68)
      .to(state, { fold: 1, duration: 11, ease: 'power2.inOut' }, 68)
      .to('.signal-object', { rotation: 90, scale: 1.2, duration: 11 }, 68)
      .fromTo('.gather-copy', { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 4 }, 72)
      .to('.gather-copy', { y: -45, autoAlpha: 0, duration: 4 }, 80)
      .to('.signal-object', { scale: 3.8, rotation: 180, duration: 8 }, 79)
      .to('.closing-iris', { clipPath: 'circle(110vmax at 50% 50%)', duration: 8 }, 80)
      .to('.signal-object', { autoAlpha: 0, duration: 3 }, 85)
      .fromTo('.final-copy', { autoAlpha: 0 }, { autoAlpha: 1, duration: 2 }, 86)
      .fromTo('.final-word i', { scale: 8, rotate: -90, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 6 }, 86)
      .fromTo('.final-word > span:first-child', { xPercent: -80, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 6 }, 86)
      .fromTo('.final-word > span:last-child', { xPercent: 200, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 6 }, 86)
      .fromTo('.final-copy > .eyebrow, .final-copy h2, .final-copy .button, .final-note', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 4, stagger: 0.7 }, 89)
      .to({}, { duration: 6 }, 94)
    if (!reducedMotion.value) {
      trigger = ScrollTrigger.create({ trigger: track.value, start: 'top top', end: () => `+=${(track.value?.offsetHeight || 0) - (stage.value?.offsetHeight || window.innerHeight)}`, animation: tl, scrub: 0.7, invalidateOnRefresh: true })
    } else {
      tl.progress(stops[selectedScene] || 0)
    }
  }, stage.value!)
}
const refreshLayout = () => {
  cancelAnimationFrame(resizeFrame)
  resizeFrame = requestAnimationFrame(() => { setup(); ScrollTrigger.refresh() })
}
watch(() => props.locale, async () => { await nextTick(); ScrollTrigger.refresh() })
onMounted(() => {
  gsap.registerPlugin(ScrollTrigger)
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
  motionQuery.addEventListener('change', refreshLayout)
  setup()
  window.addEventListener('resize', refreshLayout)
})
onBeforeUnmount(() => {
  context?.revert()
  trigger?.kill()
  cancelAnimationFrame(resizeFrame)
  motionQuery?.removeEventListener('change', refreshLayout)
  window.removeEventListener('resize', refreshLayout)
})
</script>
