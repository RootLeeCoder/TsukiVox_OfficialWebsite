<template><canvas ref="canvas" class="signal-canvas" aria-hidden="true"></canvas></template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{ progress: number, fold: number, strength: number }>()
const canvas = ref<HTMLCanvasElement | null>(null)
let observer: ResizeObserver | null = null
let frame = 0
const draw = () => {
  const element = canvas.value
  if (!element) return
  const context = element.getContext('2d')
  if (!context) return
  const width = element.clientWidth
  const height = element.clientHeight
  const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
  if (element.width !== Math.round(width * ratio) || element.height !== Math.round(height * ratio)) {
    element.width = Math.round(width * ratio)
    element.height = Math.round(height * ratio)
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0)
  context.clearRect(0, 0, width, height)
  const fold = props.fold
  const phase = props.progress * 70
  const count = width < 600 ? 23 : 36
  const radius = Math.min(width, height) * 0.31
  for (let line = 0; line < count; line++) {
    context.beginPath()
    const offset = line / (count - 1)
    for (let point = 0; point <= 150; point++) {
      const t = point / 150
      const envelope = Math.sin(t * Math.PI) ** 1.2
      const waveX = width * (t * 1.16 - 0.08)
      const waveY = height * 0.52 + Math.sin(t * 13 + phase + offset * 2.5) * height * (0.09 + props.strength * 0.13) * envelope + (offset - 0.5) * height * 0.29 * Math.cos(t * 6 + phase * 0.2)
      const angle = t * Math.PI * 2 + phase * 0.13 + offset * 0.06
      const ringRadius = radius * (0.6 + offset * 0.8)
      const ringX = width * 0.5 + Math.cos(angle) * ringRadius
      const ringY = height * 0.52 + Math.sin(angle) * ringRadius * (0.7 + offset * 0.28)
      const x = waveX + (ringX - waveX) * fold
      const y = waveY + (ringY - waveY) * fold
      if (point === 0) context.moveTo(x, y)
      else context.lineTo(x, y)
    }
    const gradient = context.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, `rgba(142,193,249,${0.25 + offset * 0.3})`)
    gradient.addColorStop(0.5, `rgba(236,228,192,${0.4 + offset * 0.5})`)
    gradient.addColorStop(1, `rgba(171,183,236,${0.15 + offset * 0.4})`)
    context.strokeStyle = gradient
    context.lineWidth = line % 4 === 0 ? 1.25 : 0.65
    context.stroke()
  }
}
const schedule = () => {
  if (frame) return
  frame = requestAnimationFrame(() => {
    frame = 0
    draw()
  })
}
watch(() => [props.progress, props.fold, props.strength], schedule)
onMounted(() => {
  observer = new ResizeObserver(schedule)
  if (canvas.value) observer.observe(canvas.value)
  schedule()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  cancelAnimationFrame(frame)
})
</script>
