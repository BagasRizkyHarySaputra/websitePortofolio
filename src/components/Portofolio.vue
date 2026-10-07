<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import cosmicJourneyPreview from '../assets/portfolio-previews/the-cosmic-journey.png'
import webAdminPreview from '../assets/portfolio-previews/web-admin-gilt.png'
import webSiswaPreview from '../assets/portfolio-previews/web-siswa-ten.png'
import mlbbPreview from '../assets/portfolio-previews/mlbb-waydroid.jpg'
import siapinPreview from '../assets/portfolio-previews/siapin-soal.png'
import vibeinPreview from '../assets/portfolio-previews/vibein-dashboard.png'

const previews = [
  {
    src: cosmicJourneyPreview,
    alt: 'The Cosmic Journey preview',
    url: 'https://the-cosmic-journey.vercel.app/',
    description:
      'The Cosmic Journey. A static website I built as a school project in 11th grade. With a space theme, it explores planets, space missions, and astronomy events. It uses an elegant, accented typeface and focuses on strong visuals. I built it with ReactJS. The code is not very efficient, so it feels a bit heavy and takes a few seconds to load all of its assets.'
  },
  {
    src: webAdminPreview,
    alt: 'Web Admin preview',
    url: 'https://web-admin-gilt.vercel.app/',
    description:
      'Web Admin RFID. A dynamic web app I built during an IoT project in 10th grade. It monitors student attendance. It uses a simple, easy-to-use theme. I built it with Next.js, and the generated code is still messy — even rougher than The Cosmic Journey.'
  },
  {
    src: webSiswaPreview,
    alt: 'Web Siswa preview',
    url: 'https://web-siswa-ten.vercel.app/',
    description:
      'Web Siswa. A dynamic web app I built during an IoT project in 10th grade. It monitors student attendance. It is similar to Web Admin, but aimed specifically at students and grants more limited data access. It uses a clean and eye-catching theme. I built it with Next.js, and the generated code is still messy — even rougher than The Cosmic Journey.'
  },
  {
    src: vibeinPreview,
    alt: 'Vibein preview',
    url: 'https://vibein.work.gd/',
    description:
      'Vibein. A dynamic web app built with React + Vite: a marketplace dashboard for API keys. It has register/login, a marketplace, API key management, tutorials, a profile, and settings. Built as one of my school projects.'
  },
  {
    src: siapinPreview,
    alt: 'SIAPIN preview',
    url: 'https://github.com/BagasRizkyHarySaputra/SIAPIN',
    description:
      'SIAPIN (Siap Taklukkan PTN Impianmu / "Ready to Conquer Your Dream University"). A dynamic web app: a digital tutoring platform for SNBT and TKA (high-school) exam prep, built with a team for a Digital Innovation Competition. It features a bank of 2,158 original questions, admission-chance estimates for 75 universities, an AI diagnostic (ability radar), a leaderboard, plus tutoring and mentors. Built with Next.js, React, TypeScript, Tailwind, Prisma, and SQLite. The live site is no longer active; the documentation and code are available on GitHub.'
  },
  {
    src: mlbbPreview,
    alt: 'MLBB Waydroid preview',
    url: 'https://github.com/BagasRizkyHarySaputra/MLBB-waydroid-LinuxCloudMLBB',
    description:
      'MLBB on Waydroid (Linux Cloud Gaming). A tools & automation project, not a website. A collection of scripts and configs for running Mobile Legends: Bang Bang on Linux via Waydroid (Android 13), complete with a cloud-gaming mode using Sunshine + Artemis/Moonlight so your phone only has to receive the stream. Supports multi-touch, Intel VAAPI encoding, and a one-command launcher. Built with Bash and tested on Kali Linux + Hyprland.'
  }
]

const activeSlide = ref(0)
const dragOffset = ref(0)
const isDragging = ref(false)
const previewRef = ref(null)
const descriptionScrollProgress = ref(0)
const descriptionScrollRef = ref(null)
let autoplayId = null
let dragPointerId = null
let dragStartX = 0
let dragStartY = 0
let dragAxis = null
let hasDragged = false

const goToSlide = (index) => {
  activeSlide.value = (index + previews.length) % previews.length
}

const nextSlide = () => {
  goToSlide(activeSlide.value + 1)
}

const prevSlide = () => {
  goToSlide(activeSlide.value - 1)
}

const stopAutoplay = () => {
  if (autoplayId !== null) {
    window.clearInterval(autoplayId)
    autoplayId = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  autoplayId = window.setInterval(() => {
    nextSlide()
  }, 3200)
}

// Swipe/drag with Pointer Events (covers mouse + touch + pen in one path).
// The track follows the pointer live, then snaps to the previous/next slide
// on release. `draggable="false"` on the images plus `touch-action: pan-y`
// on the viewport stop the browser from hijacking the gesture as an
// image drag (mouse) or a horizontal page pan (touch).
const onPointerDown = (event) => {
  if (event.pointerType === 'mouse' && event.button !== 0) {
    return
  }

  if (event.target instanceof Element && event.target.closest('.portofolio-slider-bar')) {
    return
  }

  isDragging.value = true
  dragPointerId = event.pointerId
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragAxis = null
  dragOffset.value = 0
  hasDragged = false
  stopAutoplay()

  // Capture so the swipe keeps tracking even if the pointer leaves the box.
  // Guarded: synthetic/edge-case events can throw here, and a failed capture
  // must never abort the drag setup.
  try {
    event.currentTarget.setPointerCapture?.(event.pointerId)
  } catch {
    /* pointer capture unavailable — dragging still works via the element events */
  }
}

const onPointerMove = (event) => {
  if (!isDragging.value || event.pointerId !== dragPointerId) {
    return
  }

  const deltaX = event.clientX - dragStartX
  const deltaY = event.clientY - dragStartY

  // Lock to an axis on first movement so a mostly-vertical gesture scrolls
  // the page instead of nudging the slider.
  if (dragAxis === null) {
    if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
      return
    }
    dragAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? 'x' : 'y'
  }

  if (dragAxis !== 'x') {
    return
  }

  dragOffset.value = deltaX
  if (Math.abs(deltaX) > 8) {
    hasDragged = true
  }
}

const endDrag = (event) => {
  if (!isDragging.value) {
    return
  }

  if (event && dragPointerId !== null && event.pointerId !== dragPointerId) {
    return
  }

  const wasHorizontal = dragAxis === 'x'
  isDragging.value = false

  if (wasHorizontal) {
    const width = previewRef.value?.clientWidth || 0
    const threshold = Math.max(40, width * 0.12)

    if (dragOffset.value <= -threshold) {
      nextSlide()
    } else if (dragOffset.value >= threshold) {
      prevSlide()
    }
  }

  dragOffset.value = 0
  dragAxis = null
  dragPointerId = null

  if (wasHorizontal) {
    startAutoplay()
  }
}

const onPreviewClick = (event) => {
  if (hasDragged) {
    hasDragged = false
    return
  }

  if (event.target instanceof Element && event.target.closest('.portofolio-slider-bar')) {
    return
  }

  const currentUrl = previews[activeSlide.value]?.url
  if (!currentUrl) {
    return
  }

  window.open(currentUrl, '_blank', 'noopener,noreferrer')
}

const onSliderBarClick = (event) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const ratio = (event.clientX - rect.left) / rect.width
  const targetIndex = Math.min(previews.length - 1, Math.max(0, Math.floor(ratio * previews.length)))
  goToSlide(targetIndex)
  startAutoplay()
}

const updateDescriptionScrollProgress = () => {
  const element = descriptionScrollRef.value
  if (!element) {
    descriptionScrollProgress.value = 0
    return
  }

  const maxScroll = element.scrollHeight - element.clientHeight
  if (maxScroll <= 0) {
    descriptionScrollProgress.value = 0
    return
  }

  descriptionScrollProgress.value = element.scrollTop / maxScroll
}

const onDescriptionScroll = () => {
  updateDescriptionScrollProgress()
}

watch(activeSlide, async () => {
  await nextTick()
  if (descriptionScrollRef.value) {
    descriptionScrollRef.value.scrollTop = 0
  }
  descriptionScrollProgress.value = 0
})

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="portofolio" id="portofolio-section">
    <div class="portofolio-stage">
      <div class="portofolio-badge" aria-hidden="true"></div>
      <p class="portofolio-title">Past Project</p>

      <div
        ref="previewRef"
        class="portofolio-preview"
        aria-label="Project preview area"
        @click="onPreviewClick"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="endDrag"
        @pointercancel="endDrag"
      >
        <div class="portofolio-preview-track" :class="{ 'is-dragging': isDragging }" :style="{ transform: `translateX(calc(-${activeSlide * 100}% + ${dragOffset}px))` }">
          <img
            v-for="(item, index) in previews"
            :key="item.alt"
            class="portofolio-preview-image"
            :src="item.src"
            :alt="item.alt"
            :loading="index === 0 ? 'eager' : 'lazy'"
            draggable="false"
          />
        </div>

        <div class="portofolio-slider-bar" @click.stop="onSliderBarClick">
          <button
            v-for="(item, index) in previews"
            :key="`indicator-${item.alt}`"
            class="portofolio-slider-indicator"
            :class="{ 'is-active': index === activeSlide }"
            type="button"
            @click.stop="goToSlide(index); startAutoplay()"
          ></button>
        </div>
      </div>

      <p class="portofolio-description-label">Description</p>
      <div
        ref="descriptionScrollRef"
        class="portofolio-description-scroll"
        @scroll="onDescriptionScroll"
      >
        <p class="portofolio-description-text">
        {{ previews[activeSlide].description }}
        </p>
      </div>
      <div class="portofolio-description-progress" aria-hidden="true">
        <span
          class="portofolio-description-progress-fill"
          :style="{ height: `calc(14% + ${descriptionScrollProgress * 86}%)` }"
        ></span>
      </div>
      <div class="portofolio-description-line portofolio-description-line-top" aria-hidden="true"></div>
      <div class="portofolio-description-line portofolio-description-line-bottom" aria-hidden="true"></div>
    </div>
  </section>
</template>

<style scoped>
.portofolio {
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.portofolio-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.portofolio-title,
.portofolio-description-label {
  margin: 0;
  position: absolute;
  font-family: 'VT323', monospace;
  line-height: 1;
}
.portofolio-description-label {
    color: #ffffff;
}
.portofolio-title{
    color: #000000;
}

.portofolio-badge {
  position: absolute;
  left: 10%;
  top: 6.66667%;
  width: 23.02083%;
  height: 9.07407%;
  background: #ffffff;
}

.portofolio-title {
  left: 12.39583%;
  top: 7.87037%;
  width: 18.75%;
  font-size: 3.75cqw;
  text-align: center;
}

.portofolio-preview {
  position: absolute;
  left: 4.94792%;
  top: 19.81481%;
  width: 60.88542%;
  height: 62.5%;
  background: #d9d9d9;
  overflow: hidden;
  border-radius: 0.4cqw;
  cursor: pointer;
  /* Let the browser handle vertical page scroll, we own horizontal swipes. */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.portofolio-preview:active {
  cursor: grabbing;
}

.portofolio-preview-track {
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.55s ease;
  will-change: transform;
}

/* While dragging, follow the pointer 1:1 with no easing. */
.portofolio-preview-track.is-dragging {
  transition: none;
}

.portofolio-preview-image {
  width: 100%;
  flex: 0 0 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  /* Block the native HTML5 image drag that otherwise eats mouse swipes. */
  -webkit-user-drag: none;
  user-select: none;
}

.portofolio-slider-bar {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 11.11111%;
  background: rgb(0 0 0 / 44%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2.2%;
  padding-inline: 6%;
}

/* Fixed-width dashes stay neatly centred no matter how many slides there
   are — six slides now read as a calm dot row instead of a full-width bar. */
.portofolio-slider-indicator {
  flex: 0 0 auto;
  width: 7%;
  height: 11%;
  min-height: 0.4cqw;
  border-radius: 9999px;
  background: rgb(255 255 255 / 36%);
  border: none;
  padding: 0;
  cursor: pointer;
}

.portofolio-slider-indicator.is-active {
  background: rgb(255 255 255 / 78%);
}

.portofolio-description-label {
  left: 67.55208%;
  top: 19.81481%;
  width: 18.75%;
  font-size: 2.5cqw;
  text-align: left;
}

.portofolio-description-scroll {
  position: absolute;
  left: 67.55208%;
  top: 27.31481%;
  width: 25.05208%;
  height: 52.77778%;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.8cqw;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.portofolio-description-scroll::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.portofolio-description-text {
  margin: 0;
  font-family: 'VT323', monospace;
  font-size: 1.9cqw;
  line-height: 1.1;
  color: rgb(255 255 255 / 74%);
  white-space: pre-wrap;
}

.portofolio-description-progress {
  position: absolute;
  left: 93.07292%;
  top: 27.31481%;
  width: 0.22cqw;
  height: 52.77778%;
  border-radius: 9999px;
  background: rgb(255 255 255 / 22%);
  overflow: hidden;
}

.portofolio-description-progress-fill {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 14%;
  border-radius: 9999px;
  background: #ffffff;
}

.portofolio-description-line {
  position: absolute;
  left: 66.82292%;
  width: 28.80208%;
  border-top: 0.15625cqw solid #ffffff;
}

.portofolio-description-line-top {
  top: 24.72222%;
}

.portofolio-description-line-bottom {
  top: 82.03704%;
}

@media (orientation: portrait) {
  .portofolio-stage {
    inset: 0;
    left: auto;
    top: auto;
    width: 100%;
    height: 100%;
    max-width: none;
    aspect-ratio: auto;
    transform: none;
  }

  .portofolio-badge {
    left: 9.66144%;
    top: 5.13113%;
    width: 36.49876%;
    height: 3.72482%;
  }

  .portofolio-title {
    left: 13.45995%;
    top: 5.62524%;
    width: 29.7275%;
    font-size: 5.4cqw;
  }

  .portofolio-preview {
    left: 5.11974%;
    top: 14.06309%;
    width: 89.76053%;
    height: 23.86925%;
    border-radius: 1cqw;
  }

  .portofolio-slider-bar {
    height: 15%;
  }

  .portofolio-description-label {
    left: 13.45995%;
    top: 40.59293%;
    width: 29.7275%;
    font-size: 4.8cqw;
  }

  .portofolio-description-line {
    left: 9.66144%;
    width: 80.67713%;
    border-top-width: 0.2cqw;
  }

  .portofolio-description-line-top {
    top: 44.39377%;
  }

  .portofolio-description-line-bottom {
    top: 67.19878%;
  }

  .portofolio-description-scroll {
    left: 13.45995%;
    top: 46.18016%;
    width: 73.5673%;
    height: 19.57344%;
    padding-right: 1.2cqw;
  }

  .portofolio-description-text {
    font-size: 3.2cqw;
  }

  .portofolio-description-progress {
    left: 88.43931%;
    top: 46.18016%;
    width: 0.55cqw;
    height: 19.57344%;
  }
}
</style>
