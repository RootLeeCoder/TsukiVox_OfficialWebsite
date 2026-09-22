<template>
  <canvas ref="canvas" class="space-canvas" aria-hidden="true"></canvas>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import * as THREE from 'three'

const canvas = ref<HTMLCanvasElement | null>(null)
let disposeScene = () => {}

onMounted(() => {
  if (!canvas.value) return

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const compact = window.matchMedia('(max-width: 760px)').matches
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 80)
  const context = canvas.value.getContext('webgl2', { alpha: true, antialias: !compact, powerPreference: 'low-power' })
  if (!context) {
    canvas.value.hidden = true
    return
  }
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: canvas.value,
      context,
      alpha: true,
      antialias: !compact,
      powerPreference: 'low-power'
    })
  } catch {
    canvas.value.hidden = true
    return
  }
  const clock = new THREE.Clock()
  const world = new THREE.Group()
  const rings = new THREE.Group()
  const waveGroup = new THREE.Group()
  const disposables: Array<THREE.BufferGeometry | THREE.Material | THREE.Texture> = []
  const pointer = new THREE.Vector2()
  const pointerTarget = new THREE.Vector2()
  const waveLines: THREE.Line[] = []
  let animationFrame = 0
  let scrollRatio = 0

  scene.add(world)
  world.add(rings, waveGroup)
  camera.position.set(0, 0, compact ? 9.6 : 8.2)

  const createStars = (count: number, color: number, spread: number, size: number) => {
    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(count * 3)

    for (let index = 0; index < count; index += 1) {
      const radius = 2.5 + Math.random() * spread
      const angle = Math.random() * Math.PI * 2
      const height = (Math.random() - 0.5) * spread * 0.72
      positions[index * 3] = Math.cos(angle) * radius
      positions[index * 3 + 1] = height
      positions[index * 3 + 2] = Math.sin(angle) * radius - 4
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({
      color,
      size,
      transparent: true,
      opacity: 0.68,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })
    const points = new THREE.Points(geometry, material)
    disposables.push(geometry, material)
    world.add(points)
    return points
  }

  const cyanStars = createStars(compact ? 520 : 1200, 0xc9daf4, 16, compact ? 0.025 : 0.019)
  const pinkStars = createStars(compact ? 150 : 420, 0xd7ddb9, 11, compact ? 0.032 : 0.024)

  const ringPalette = [0x86a5d9, 0xc0cddd, 0xede5cc, 0xc6ca99]
  ringPalette.forEach((color, index) => {
    const points = Array.from({ length: 180 }, (_, pointIndex) => {
      const angle = (pointIndex / 179) * Math.PI * 2
      const radius = 3.5 + index * 0.62
      return new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * (0.22 + index * 0.025),
        -3.4 - index * 0.32
      )
    })
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.12 - index * 0.015,
      blending: THREE.AdditiveBlending
    })
    const line = new THREE.LineLoop(geometry, material)
    line.rotation.z = index % 2 ? 0.17 : -0.12
    rings.add(line)
    disposables.push(geometry, material)
  })

  const waveColors = [0xc8d9ee, 0xcbd6bd, 0x779ddd]
  waveColors.forEach((color, waveIndex) => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(220 * 3), 3))
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.28 - waveIndex * 0.045,
      blending: THREE.AdditiveBlending
    })
    const line = new THREE.Line(geometry, material)
    line.position.y = -2.2 + waveIndex * 0.18
    line.position.z = -1.5 - waveIndex * 0.25
    waveGroup.add(line)
    waveLines.push(line)
    disposables.push(geometry, material)
  })

  const updateWave = (line: THREE.Line, waveIndex: number, elapsed: number) => {
    const positions = line.geometry.getAttribute('position') as THREE.BufferAttribute

    for (let pointIndex = 0; pointIndex < positions.count; pointIndex += 1) {
      const progress = pointIndex / (positions.count - 1)
      const x = (progress - 0.5) * 13
      const envelope = Math.pow(Math.sin(progress * Math.PI), 1.35)
      const y =
        Math.sin(progress * 23 + elapsed * (0.72 + waveIndex * 0.16)) * 0.22 * envelope +
        Math.sin(progress * 51 - elapsed * 0.44) * 0.055 * envelope
      positions.setXYZ(pointIndex, x, y, 0)
    }

    positions.needsUpdate = true
  }

  const resize = () => {
    const width = window.innerWidth
    const height = canvas.value?.parentElement?.clientHeight || window.innerHeight
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, compact ? 1.25 : 1.7))
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  const onPointerMove = (event: PointerEvent) => {
    pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2
    pointerTarget.y = (event.clientY / window.innerHeight - 0.5) * 2
  }

  const onScroll = () => {
    const scrollable = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
    scrollRatio = window.scrollY / scrollable
  }

  const render = () => {
    if (document.hidden || window.scrollY > window.innerHeight * 1.4) {
      animationFrame = window.requestAnimationFrame(render)
      return
    }
    const elapsed = clock.getElapsedTime()
    pointer.lerp(pointerTarget, reducedMotion ? 0.025 : 0.045)

    if (!reducedMotion) {
      world.rotation.y = elapsed * 0.012 + scrollRatio * 0.72 + pointer.x * 0.045
      world.rotation.x = pointer.y * 0.025 - scrollRatio * 0.08
      rings.rotation.z = elapsed * 0.018 - scrollRatio * 0.36
      cyanStars.rotation.y = elapsed * 0.006
      pinkStars.rotation.y = -elapsed * 0.009
      waveLines.forEach((line, index) => updateWave(line, index, elapsed))
    }

    camera.position.x += (pointer.x * 0.16 - camera.position.x) * 0.025
    camera.position.y += (-pointer.y * 0.1 - camera.position.y) * 0.025
    renderer.render(scene, camera)
    if (!reducedMotion) animationFrame = window.requestAnimationFrame(render)
  }

  resize()
  onScroll()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })
  render()

  disposeScene = () => {
    window.cancelAnimationFrame(animationFrame)
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('scroll', onScroll)
    disposables.forEach((item) => item.dispose())
    renderer.dispose()
  }
})

onBeforeUnmount(() => disposeScene())
</script>
