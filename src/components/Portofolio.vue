<script setup>
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import cosmicJourneyPreview from '../assets/portfolio-previews/the-cosmic-journey.png'
import webAdminPreview from '../assets/portfolio-previews/web-admin-gilt.png'
import webSiswaPreview from '../assets/portfolio-previews/web-siswa-ten.png'

const previews = [
  {
    src: cosmicJourneyPreview,
    alt: 'The Cosmic Journey preview',
    url: 'https://the-cosmic-journey.vercel.app/',
    description:
      'The Cosmic Journey. Sebuah website static hasil karya saya, ini adalah salah satu tugas project dari sekolah pada saat kelas 11. Mengambil tema luar angkasa, disini saya membahas tentang planet, proyek luar angkasa, dan event-event antariksa. Di design menggunakan font dengan aksen yang elegant. Website ini berfokus pada visual yang menarik. Saya menggunakan framework ReactJS untuk membuat website ini. Masih kurang efficient dalam coding, sehingga agak berat jika di akses dan harus menunggu beberapa detik untuk loading semua asset nya.'
  },
  {
    src: webAdminPreview,
    alt: 'Web Admin preview',
    url: 'https://web-admin-gilt.vercel.app/',
    description:
      'Web Admin RFID. Sebuah Dynamic Web. Website ini saya buat pada saat project IoT di kelas 10. Berisi monitoring untuk abseni para siswa. Mengambil tema simple dan easy to use. Saya menggunakan framework NextJS untuk membuat ini, untuk generation code nya masih sangat kacau, lebih parah daripada The Cosmic Journey.'
  },
  {
    src: webSiswaPreview,
    alt: 'Web Siswa preview',
    url: 'https://web-siswa-ten.vercel.app/',
    description:
      'Web Siswa. Sebuah Dynamic Web. Website ini saya buat pada saat project IoT di kelas 10. Bervisi monitoring untuk abseni para siswa. Sama seperti Web Admin, bedanya hanya khusus untuk siswa dan memiliki Authorize yang lebih minim mengakses data. Mengambil tema Clean Web dan Eye Catching. Saya Saya menggunakan framework NextJS untuk membuat ini, untuk generation code nya masih sangat kacau, lebih parah daripada The Cosmic Journey.'
  }
]

const activeSlide = ref(0)
const descriptionScrollProgress = ref(0)
const descriptionScrollRef = ref(null)
let autoplayId = null
let dragStartX = 0
let dragDeltaX = 0
let hasDragged = false
let isDragging = false

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

const getPointerX = (event) => {
  if ('touches' in event && event.touches.length > 0) {
    return event.touches[0].clientX
  }

  if ('changedTouches' in event && event.changedTouches.length > 0) {
    return event.changedTouches[0].clientX
  }

  return event.clientX
}

const onDragStart = (event) => {
  isDragging = true
  dragStartX = getPointerX(event)
  dragDeltaX = 0
  hasDragged = false
  stopAutoplay()
}

const onDragMove = (event) => {
  if (!isDragging) {
    return
  }

  dragDeltaX = getPointerX(event) - dragStartX
  if (Math.abs(dragDeltaX) > 8) {
    hasDragged = true
  }
}

const onDragEnd = () => {
  if (!isDragging) {
    return
  }

  isDragging = false

  if (Math.abs(dragDeltaX) >= 40) {
    if (dragDeltaX < 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }

  dragDeltaX = 0
  startAutoplay()
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
        class="portofolio-preview"
        aria-label="Project preview area"
        @click="onPreviewClick"
        @mousedown="onDragStart"
        @mousemove="onDragMove"
        @mouseup="onDragEnd"
        @mouseleave="onDragEnd"
        @touchstart="onDragStart"
        @touchmove="onDragMove"
        @touchend="onDragEnd"
      >
        <div class="portofolio-preview-track" :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
          <img
            v-for="(item, index) in previews"
            :key="item.alt"
            class="portofolio-preview-image"
            :src="item.src"
            :alt="item.alt"
            :loading="index === 0 ? 'eager' : 'lazy'"
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
  background: #000000;
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
}

.portofolio-preview-track {
  width: 100%;
  height: 100%;
  display: flex;
  transition: transform 0.55s ease;
}

.portofolio-preview-image {
  width: 100%;
  flex: 0 0 100%;
  height: 100%;
  display: block;
  object-fit: cover;
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
  gap: 3.125%;
}

.portofolio-slider-indicator {
  width: 15%;
  height: 10%;
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
    inset: auto;
    left: 50%;
    top: 50%;
    height: 100%;
    width: auto;
    max-width: 100%;
    aspect-ratio: 1211 / 2631;
    transform: translate(-50%, -50%);
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
