<script setup>
import { ref } from 'vue'

import catBwGif from '../assets/cat-bw.gif'

const cvDocUrl = 'https://docs.google.com/document/d/1wSJJufLlM2opbgSjh-2srDn4PmTjkMBm0oJuj7yqCKs/edit?usp=sharing'
const cvPreviewUrl = 'https://docs.google.com/document/d/1wSJJufLlM2opbgSjh-2srDn4PmTjkMBm0oJuj7yqCKs/preview'

const isCvPopupOpen = ref(false)

const onOpenCvPopup = () => {
  isCvPopupOpen.value = true
}

const onCloseCvPopup = () => {
  isCvPopupOpen.value = false
}

const onDownloadCv = () => {
  window.open(cvDocUrl, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <section class="cv" id="cv-section">
    <div class="cv-stage">
      <img class="cv-cat" :src="catBwGif" alt="Cat black and white" draggable="false" />
      <button class="cv-button" type="button" @click="onOpenCvPopup">My CV</button>
    </div>

    <div v-if="isCvPopupOpen" class="cv-popup-overlay" @click.self="onCloseCvPopup">
      <div class="cv-popup" role="dialog" aria-modal="true" aria-label="CV Preview">
        <button class="cv-popup-close" type="button" @click="onCloseCvPopup">×</button>
        <div class="cv-popup-view">
          <iframe
            class="cv-popup-iframe"
            :src="cvPreviewUrl"
            title="CV Document Preview"
            loading="lazy"
            referrerpolicy="no-referrer"
          ></iframe>
        </div>
        <button class="cv-download" type="button" @click="onDownloadCv">Download</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cv {
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
  container-type: size;
}

.cv-stage {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.cv-cat {
  width: 70cqw;
  height: auto;
  display: block;
  pointer-events: none;
  image-rendering: pixelated;
}

.cv-button {
  border: none;
  /* margin-bottom: -30%; */
  border-radius: 0.63cqw;
  background: #eceef2;
  color: #10131a;
  font-family: 'VT323', monospace;
  font-size: 1.7cqw;
  line-height: 1;
  padding: 1.1cqh 2.2cqw;
  cursor: pointer;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.42);
  transition: transform 120ms ease, filter 120ms ease;
}

.cv-button:hover {
  transform: translateY(-1px);
  filter: brightness(1.03);
}

.cv-button:active {
  transform: translateY(1px);
}

.cv-popup-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 12;
}

.cv-popup {
  width: 72cqw;
  height: 82cqh;
  background: #0f1117;
  border: 0.13cqw solid #eceef2;
  border-radius: 1cqw;
  padding: 1.4cqh 1.2cqw 1.2cqh;
  display: flex;
  flex-direction: column;
  gap: 1.2cqh;
  position: relative;
}

.cv-popup-close {
  position: absolute;
  top: 0.6cqh;
  right: 0.7cqw;
  border: none;
  background: transparent;
  color: #eceef2;
  font-size: 2.3cqw;
  line-height: 1;
  cursor: pointer;
}

.cv-popup-view {
  margin-top: 3.8cqh;
  flex: 1;
  border: 0.08cqw solid #eceef2;
  border-radius: 0.5cqw;
  overflow: hidden;
  background: #ffffff;
}

.cv-popup-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.cv-download {
  align-self: center;
  border: none;
  border-radius: 0.63cqw;
  background: #eceef2;
  color: #10131a;
  font-family: 'VT323', monospace;
  font-size: 1.6cqw;
  line-height: 1;
  padding: 0.95cqh 2.6cqw;
  cursor: pointer;
}

</style>