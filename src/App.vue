<template>
  <div class="site" :class="{ 'sound-active': soundActive, 'menu-open': menuOpen }">
    <SpaceCanvas />
    <div class="ambient-vignette" aria-hidden="true"></div>
    <div class="noise" aria-hidden="true"></div>
    <div class="pointer-aura" aria-hidden="true"></div>
    <div class="scroll-progress" :style="{ transform: `scaleX(${scrollProgress})` }" aria-hidden="true"></div>

    <header class="site-header" :class="{ condensed: headerCondensed }">
      <a class="brand" href="#top" aria-label="TsukiVox 首页" @click="menuOpen = false">
        <svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">
          <defs>
            <linearGradient id="brandMoon" x1="8" y1="8" x2="56" y2="56">
              <stop stop-color="#65e7ff" />
              <stop offset=".48" stop-color="#9875ff" />
              <stop offset="1" stop-color="#ff58da" />
            </linearGradient>
          </defs>
          <path d="M38.8 8.5c-10.6 2.8-18 12.5-18 23.5s7.4 20.7 18 23.5A25.2 25.2 0 1 1 38.8 8.5Z" fill="url(#brandMoon)" />
          <rect x="34.6" y="15.6" width="11.8" height="27.6" rx="5.9" fill="#070918" stroke="#f3c977" stroke-width="2.8" />
          <path d="M30.5 33.8a10 10 0 0 0 20 0M40.5 44v8M34.5 52h12" fill="none" stroke="#f3c977" stroke-linecap="round" stroke-width="2.8" />
        </svg>
        <span class="brand-word">Tsuki<span>Vox</span></span>
      </a>

      <nav class="desktop-nav" aria-label="主要导航">
        <a href="#experience">{{ t.nav.experience }}</a>
        <a href="#sound">{{ t.nav.sound }}</a>
        <a href="#room">{{ t.nav.room }}</a>
        <a href="#roadmap">{{ t.nav.roadmap }}</a>
      </nav>

      <div class="header-actions">
        <button
          class="icon-action sound-toggle"
          type="button"
          :aria-label="soundActive ? t.common.soundOff : t.common.soundOn"
          :aria-pressed="soundActive"
          @click="toggleSound"
        >
          <span class="sound-bars" aria-hidden="true">
            <i v-for="index in 4" :key="index"></i>
          </span>
        </button>
        <button class="locale-toggle" type="button" :aria-label="locale === 'zh' ? 'Switch to English' : '切换到中文'" @click="toggleLocale">
          {{ locale === 'zh' ? 'EN' : '中' }}
        </button>
        <button class="header-cta" type="button" @click="openJoin">
          {{ t.common.join }}
          <span aria-hidden="true">↗</span>
        </button>
        <button
          class="menu-toggle"
          type="button"
          :aria-label="t.common.menu"
          :aria-expanded="menuOpen"
          @click="menuOpen = !menuOpen"
        >
          <span></span><span></span>
        </button>
      </div>
    </header>

    <div class="mobile-menu" :aria-hidden="!menuOpen">
      <nav aria-label="移动端导航">
        <a href="#experience" @click="menuOpen = false"><span>01</span>{{ t.nav.experience }}</a>
        <a href="#sound" @click="menuOpen = false"><span>02</span>{{ t.nav.sound }}</a>
        <a href="#room" @click="menuOpen = false"><span>03</span>{{ t.nav.room }}</a>
        <a href="#roadmap" @click="menuOpen = false"><span>04</span>{{ t.nav.roadmap }}</a>
      </nav>
      <button class="primary-button mobile-join" type="button" @click="openJoin">
        <span>{{ t.common.join }}</span><i aria-hidden="true">↗</i>
      </button>
    </div>

    <main>
      <section id="top" class="hero" aria-labelledby="hero-title">
        <div class="hero-image-wrap" aria-hidden="true">
          <img class="hero-image" :src="heroUrl" alt="" fetchpriority="high" />
          <div class="hero-image-shade"></div>
          <div class="hero-scan"></div>
        </div>

        <div class="hero-architecture" aria-hidden="true">
          <div class="orbit orbit-a"></div>
          <div class="orbit orbit-b"></div>
          <div class="orbit orbit-c"></div>
          <div class="hero-coordinate">31.2304° N / 121.4737° E</div>
          <div class="hero-index">MOON ROOM / 001</div>
        </div>

        <div class="hero-content page-width">
          <p class="eyebrow hero-eyebrow"><span></span>{{ t.hero.eyebrow }}</p>
          <h1 id="hero-title" class="hero-title">
            <span class="hero-title-line">{{ t.hero.lineOne }}</span>
            <span class="hero-title-line luminous">{{ t.hero.lineTwo }}</span>
          </h1>
          <p class="hero-description">{{ t.hero.description }}</p>
          <div class="hero-actions">
            <button class="primary-button" type="button" @click="openJoin">
              <span>{{ t.common.join }}</span><i aria-hidden="true">↗</i>
            </button>
            <a class="text-button" href="#experience">
              <span class="play-orb" aria-hidden="true">▶</span>
              {{ t.common.explore }}
            </a>
          </div>
          <div class="hero-meta">
            <span class="status-dot"></span>
            <span>{{ t.hero.note }}</span>
          </div>
        </div>

        <a class="scroll-cue" href="#manifesto">
          <span>{{ t.hero.scroll }}</span>
          <i aria-hidden="true"></i>
        </a>

        <div class="hero-ticker" aria-hidden="true">
          <div class="ticker-track">
            <span v-for="index in 6" :key="index">VOICE IN ORBIT&nbsp;&nbsp;✦&nbsp;&nbsp; MOONLIT KARAOKE&nbsp;&nbsp;✦&nbsp;&nbsp;</span>
          </div>
        </div>
      </section>

      <section id="manifesto" class="manifesto section-shell">
        <div class="manifesto-orb" aria-hidden="true">
          <div class="moon-core"></div>
          <div class="moon-ring moon-ring-one"></div>
          <div class="moon-ring moon-ring-two"></div>
          <span class="moon-label">TSUKI / 月</span>
        </div>
        <div class="manifesto-copy" data-reveal>
          <p class="eyebrow">{{ t.manifesto.eyebrow }}</p>
          <h2>{{ t.manifesto.title }}</h2>
          <p>{{ t.manifesto.body }}</p>
        </div>
        <div class="manifesto-side" aria-hidden="true">
          <span>01</span>
          <i></i>
          <span>07</span>
        </div>
      </section>

      <section id="experience" class="experience section-shell">
        <div class="section-heading" data-reveal>
          <p class="eyebrow">{{ t.experience.eyebrow }}</p>
          <h2>{{ t.experience.title }}</h2>
          <p>{{ t.experience.description }}</p>
        </div>

        <div class="feature-grid">
          <article
            v-for="card in t.experience.cards"
            :key="card.index"
            class="feature-card"
            :class="`accent-${card.accent}`"
            data-reveal
          >
            <div class="card-topline">
              <span>{{ card.index }}</span>
              <span>{{ card.subtitle }}</span>
            </div>

            <div v-if="card.index === '01'" class="card-visual waveform-visual" aria-hidden="true">
              <div class="wave-ring"></div>
              <div class="wave-bars">
                <i v-for="index in 32" :key="index" :style="{ '--bar-index': index }"></i>
              </div>
              <span>12.4 ms</span>
            </div>

            <div v-else-if="card.index === '02'" class="card-visual search-visual" aria-hidden="true">
              <div class="search-shell">
                <span class="search-icon">⌕</span>
                <span class="search-copy">tsuki no uta</span>
                <i></i>
              </div>
              <div class="search-results">
                <span v-for="(width, index) in ['88%', '72%', '61%']" :key="width">
                  <i :style="{ width }"></i><b>{{ index + 1 }}</b>
                </span>
              </div>
            </div>

            <div v-else class="card-visual spatial-visual" aria-hidden="true">
              <div class="spatial-core">YOU</div>
              <span class="spatial-node node-mic">MIC</span>
              <span class="spatial-node node-screen">SCREEN</span>
              <span class="spatial-node node-pad">PAD</span>
              <svg viewBox="0 0 300 180">
                <path d="M150 88C96 74 74 58 44 34M150 88c44-25 78-26 108-12M150 88c-11 39-25 54-55 71" />
              </svg>
            </div>

            <div class="card-copy">
              <h3>{{ card.title }}</h3>
              <p>{{ card.body }}</p>
            </div>
            <div class="card-corner" aria-hidden="true"></div>
          </article>
        </div>
      </section>

      <section id="sound" class="voice-lab section-shell">
        <div class="voice-copy" data-reveal>
          <p class="eyebrow">{{ t.audio.eyebrow }}</p>
          <h2>{{ t.audio.title }}</h2>
          <p>{{ t.audio.description }}</p>
          <div class="preset-list" role="tablist" aria-label="人声预设">
            <button
              v-for="(preset, index) in t.audio.presets"
              :key="preset.code"
              type="button"
              role="tab"
              :aria-selected="selectedPreset === index"
              :class="{ active: selectedPreset === index }"
              @click="selectPreset(index)"
            >
              <span>0{{ index + 1 }}</span>
              <strong>{{ preset.name }}</strong>
              <i aria-hidden="true">{{ preset.code }}</i>
            </button>
          </div>
        </div>

        <div class="voice-console" :style="{ '--preset-glow': activePreset.glow }" data-reveal>
          <div class="console-frame">
            <div class="console-header">
              <div><span class="status-dot"></span>LIVE ENGINE</div>
              <div>48 KHZ / STEREO</div>
            </div>
            <div class="console-spectrum" aria-hidden="true">
              <div class="spectrum-grid"></div>
              <div class="spectrum-bars">
                <i v-for="index in 64" :key="index" :style="{ '--spectrum-index': index }"></i>
              </div>
              <svg viewBox="0 0 720 240" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="voiceLine" x1="0" x2="1">
                    <stop stop-color="#61e8ff" />
                    <stop offset=".5" stop-color="#a172ff" />
                    <stop offset="1" stop-color="#ff5bd8" />
                  </linearGradient>
                </defs>
                <path d="M0 126C38 121 51 149 82 134S118 62 148 120s42 68 70 9 39-79 67-7 45 58 71 0 40-85 68-4 43 58 72 3 43-55 67 2 42 58 67 4 43-34 69 0 52 10 101-2" />
              </svg>
              <div class="spectrum-cursor"></div>
            </div>
            <div class="console-readout">
              <div>
                <span>{{ t.audio.input }}</span>
                <strong>-12.8 <small>dB</small></strong>
              </div>
              <div class="preset-readout">
                <span>{{ activePreset.code }}</span>
                <strong>{{ activePreset.name }}</strong>
                <p>{{ activePreset.detail }}</p>
              </div>
              <div>
                <span>{{ t.audio.output }}</span>
                <strong>{{ activePreset.room }}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="direct-flow section-shell">
        <div class="direct-heading" data-reveal>
          <p class="eyebrow">{{ t.flow.eyebrow }}</p>
          <h2>{{ t.flow.title }}</h2>
          <p>{{ t.flow.description }}</p>
        </div>
        <div class="flow-track" data-reveal>
          <div class="flow-beam" aria-hidden="true"></div>
          <article v-for="step in t.flow.steps" :key="step.number" class="flow-step">
            <span>{{ step.number }}</span>
            <div class="flow-node"><i></i></div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.body }}</p>
          </article>
        </div>
        <div class="direct-badge" aria-hidden="true">
          <span>QUEST</span><i>→</i><span>LOCAL</span>
        </div>
      </section>

      <section id="room" class="room-section">
        <div class="room-image-wrap">
          <img :src="heroUrl" :alt="locale === 'zh' ? 'TsukiVox 月下未来 KTV 包厢概念图' : 'TsukiVox moonlit futuristic karaoke room concept'" loading="lazy" />
          <div class="room-image-overlay"></div>
          <div class="room-grid" aria-hidden="true"></div>
          <button
            v-for="(point, index) in t.room.points"
            :key="point.label"
            class="room-hotspot"
            type="button"
            :style="{ left: point.x, top: point.y }"
            :aria-label="`${point.label}：${point.detail}`"
          >
            <span>0{{ index + 1 }}</span>
            <i></i>
            <b><strong>{{ point.label }}</strong>{{ point.detail }}</b>
          </button>
        </div>
        <div class="room-copy page-width" data-reveal>
          <p class="eyebrow">{{ t.room.eyebrow }}</p>
          <h2>{{ t.room.title }}</h2>
          <p>{{ t.room.description }}</p>
        </div>
        <div class="room-point-list page-width">
          <article v-for="(point, index) in t.room.points" :key="point.label">
            <span>0{{ index + 1 }}</span>
            <div><strong>{{ point.label }}</strong><p>{{ point.detail }}</p></div>
          </article>
        </div>
      </section>

      <section id="roadmap" class="roadmap section-shell">
        <div class="roadmap-heading" data-reveal>
          <p class="eyebrow">{{ t.roadmap.eyebrow }}</p>
          <h2>{{ t.roadmap.title }}</h2>
        </div>
        <div class="roadmap-list">
          <article v-for="(item, index) in t.roadmap.items" :key="item.version" data-reveal>
            <span class="roadmap-index">0{{ index + 1 }}</span>
            <span class="roadmap-version">{{ item.version }}</span>
            <h3>{{ item.title }}</h3>
            <p>{{ item.body }}</p>
            <i aria-hidden="true">↗</i>
          </article>
        </div>
      </section>

      <section id="join" class="join-section section-shell">
        <div class="join-portal" aria-hidden="true">
          <div class="join-moon"></div>
          <div class="join-ring ring-one"></div>
          <div class="join-ring ring-two"></div>
          <div class="join-ring ring-three"></div>
          <div class="join-wave"></div>
        </div>
        <div class="join-copy" data-reveal>
          <p class="eyebrow">{{ t.join.eyebrow }}</p>
          <h2>{{ t.join.title }}</h2>
          <p>{{ t.join.description }}</p>
          <button class="primary-button primary-button-large" type="button" @click="openJoin">
            <span>{{ t.common.join }}</span><i aria-hidden="true">↗</i>
          </button>
          <small><span class="status-dot"></span>{{ t.join.availability }}</small>
        </div>
      </section>
    </main>

    <footer class="site-footer page-width">
      <div class="footer-brand">
        <span class="brand-word">Tsuki<span>Vox</span></span>
        <p>{{ t.footer.tagline }}</p>
      </div>
      <div class="footer-meta">
        <span>{{ t.footer.status }}</span>
        <a href="https://github.com/RootLeeCoder/TsukiVox_OfficialWebsite" target="_blank" rel="noreferrer">GITHUB ↗</a>
      </div>
      <p class="footer-disclaimer">{{ t.footer.disclaimer }}</p>
      <span class="footer-year">© {{ currentYear }} ROOTLEECODER</span>
    </footer>

    <Transition name="modal">
      <div v-if="joinOpen" class="modal-backdrop" role="presentation" @click.self="joinOpen = false">
        <section class="join-modal" role="dialog" aria-modal="true" :aria-labelledby="joinTitleId">
          <button class="modal-close" type="button" :aria-label="t.common.close" @click="joinOpen = false">×</button>
          <div class="modal-mark" aria-hidden="true">
            <span></span><i></i>
          </div>
          <p class="eyebrow">EARLY ACCESS / QUEST 3</p>
          <h2 :id="joinTitleId">{{ t.join.modalTitle }}</h2>
          <p>{{ t.join.modalBody }}</p>
          <a class="primary-button modal-primary" :href="issueUrl" target="_blank" rel="noreferrer">
            <span>{{ t.join.github }}</span><i aria-hidden="true">↗</i>
          </a>
          <button class="modal-secondary" type="button" @click="joinOpen = false">{{ t.join.later }}</button>
        </section>
      </div>
    </Transition>
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
const headerCondensed = ref(false)
const joinOpen = ref(false)
const selectedPreset = ref(1)
const scrollProgress = ref(0)
const currentYear = new Date().getFullYear()
const joinTitleId = 'join-modal-title'
const heroUrl = `${import.meta.env.BASE_URL}assets/tsukivox-hero.webp`
const t = computed(() => content[locale.value])
const activePreset = computed(() => t.value.audio.presets[selectedPreset.value])
const issueUrl = computed(() => {
  const title = locale.value === 'zh' ? '申请加入 TsukiVox 测试' : 'TsukiVox test request'
  const body = locale.value === 'zh'
    ? '设备：Meta Quest 3\n想参与测试的原因：\n'
    : 'Device: Meta Quest 3\nWhy I would like to test TsukiVox:\n'
  return `https://github.com/RootLeeCoder/TsukiVox_OfficialWebsite/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
})

let audioContext: AudioContext | null = null
let masterGain: GainNode | null = null
let oscillators: OscillatorNode[] = []
let lenis: Lenis | null = null
let tickerHandler: ((time: number) => void) | null = null
let gsapContext: gsap.Context | null = null

const createAmbientSound = async () => {
  if (!audioContext) {
    audioContext = new AudioContext()
    masterGain = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 620
    filter.Q.value = 0.8
    masterGain.gain.value = 0
    masterGain.connect(filter)
    filter.connect(audioContext.destination)

    const frequencies = [55, 82.41, 110]
    oscillators = frequencies.map((frequency, index) => {
      const oscillator = audioContext!.createOscillator()
      const gain = audioContext!.createGain()
      oscillator.type = index === 1 ? 'triangle' : 'sine'
      oscillator.frequency.value = frequency
      oscillator.detune.value = index === 2 ? -5 : index * 3
      gain.gain.value = index === 0 ? 0.2 : 0.08
      oscillator.connect(gain)
      gain.connect(masterGain!)
      oscillator.start()
      return oscillator
    })
  }

  if (audioContext.state === 'suspended') await audioContext.resume()
}

const toggleSound = async () => {
  if (!soundActive.value) {
    await createAmbientSound()
    soundActive.value = true
    masterGain?.gain.setTargetAtTime(0.045, audioContext!.currentTime, 0.55)
    return
  }

  soundActive.value = false
  masterGain?.gain.setTargetAtTime(0, audioContext!.currentTime, 0.25)
}

const toggleLocale = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh'
  menuOpen.value = false
}

const selectPreset = (index: number) => {
  selectedPreset.value = index
  if (soundActive.value && audioContext && masterGain) {
    const level = 0.032 + activePreset.value.glow * 0.02
    masterGain.gain.setTargetAtTime(level, audioContext.currentTime, 0.3)
  }
}

const openJoin = () => {
  menuOpen.value = false
  joinOpen.value = true
}

const updateScrollState = () => {
  const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
  scrollProgress.value = Math.min(window.scrollY / scrollable, 1)
  headerCondensed.value = window.scrollY > 72
}

const updatePointer = (event: PointerEvent) => {
  document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
  document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    joinOpen.value = false
    menuOpen.value = false
  }
}

watch(locale, (value) => {
  document.documentElement.lang = value === 'zh' ? 'zh-CN' : 'en'
})

watch([menuOpen, joinOpen], ([menuIsOpen, modalIsOpen]) => {
  document.body.style.overflow = menuIsOpen || modalIsOpen ? 'hidden' : ''
})

onMounted(async () => {
  await nextTick()
  gsap.registerPlugin(ScrollTrigger)

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reducedMotion) {
    lenis = new Lenis({
      duration: 1.08,
      smoothWheel: true,
      syncTouch: false
    })
    lenis.on('scroll', ScrollTrigger.update)
    tickerHandler = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(tickerHandler)
    gsap.ticker.lagSmoothing(0)

    gsapContext = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro
        .from('.hero-eyebrow', { opacity: 0, y: 18, duration: 0.7 }, 0.15)
        .from('.hero-title-line', { yPercent: 115, rotate: 2, stagger: 0.12, duration: 1.15 }, 0.22)
        .from('.hero-description', { opacity: 0, y: 24, duration: 0.9 }, 0.78)
        .from('.hero-actions, .hero-meta', { opacity: 0, y: 18, stagger: 0.1, duration: 0.72 }, 0.92)
        .from('.hero-image-wrap', { opacity: 0, scale: 1.08, duration: 1.8 }, 0)

      gsap.to('.hero-image', {
        scale: 1.1,
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      })

      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 84%',
        once: true,
        onEnter: (elements) => {
          gsap.fromTo(
            elements,
            { opacity: 0, y: 48 },
            { opacity: 1, y: 0, duration: 0.95, stagger: 0.1, ease: 'power3.out' }
          )
        }
      })

      gsap.to('.manifesto-orb', {
        rotation: 18,
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: '.manifesto',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2
        }
      })

      gsap.fromTo('.flow-beam',
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '.flow-track',
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 1
          }
        }
      )
    })
  }

  updateScrollState()
  window.addEventListener('scroll', updateScrollState, { passive: true })
  window.addEventListener('pointermove', updatePointer, { passive: true })
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScrollState)
  window.removeEventListener('pointermove', updatePointer)
  window.removeEventListener('keydown', handleKeydown)
  if (tickerHandler) gsap.ticker.remove(tickerHandler)
  lenis?.destroy()
  gsapContext?.revert()
  oscillators.forEach((oscillator) => oscillator.stop())
  audioContext?.close()
  document.body.style.overflow = ''
})
</script>
