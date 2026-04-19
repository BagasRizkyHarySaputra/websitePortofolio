<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import Home from './components/Home.vue'
import Homepage from './components/Homepage.vue'
import AboutMe from './components/AboutMe.vue'
import Skills from './components/Skills.vue'
import Portofolio from './components/Portofolio.vue'
import Cv from './components/cv.vue'
import Logo from './components/Logo.vue'

const floatingNavbarPhase = ref('hidden')

const NAV_ITEM_COUNT = 5
const NAV_STAGGER_MS = 80
const NAV_TRANSITION_MS = 240
const NAV_PHASE_MS = NAV_TRANSITION_MS + NAV_STAGGER_MS * (NAV_ITEM_COUNT - 1)

let navPhaseTimer = null

const clearNavPhaseTimer = () => {
  if (navPhaseTimer !== null) {
    window.clearTimeout(navPhaseTimer)
    navPhaseTimer = null
  }
}

const openFloatingNav = () => {
  clearNavPhaseTimer()
  floatingNavbarPhase.value = 'showing'
  navPhaseTimer = window.setTimeout(() => {
    floatingNavbarPhase.value = 'visible'
    navPhaseTimer = null
  }, NAV_PHASE_MS)
}

const closeFloatingNav = () => {
  if (floatingNavbarPhase.value === 'hidden' || floatingNavbarPhase.value === 'hiding') {
    return
  }

  clearNavPhaseTimer()
  floatingNavbarPhase.value = 'hiding'
  navPhaseTimer = window.setTimeout(() => {
    floatingNavbarPhase.value = 'hidden'
    navPhaseTimer = null
  }, NAV_PHASE_MS)
}

const toggleFloatingNav = () => {
  if (floatingNavbarPhase.value === 'hidden') {
    openFloatingNav()
    return
  }

  closeFloatingNav()
}

const onGlobalPointerDown = (event) => {
  if (floatingNavbarPhase.value === 'hidden') {
    return
  }

  const target = event.target
  if (!(target instanceof Element)) {
    return
  }

  if (target.closest('.floating-nav-button')) {
    return
  }

  if (target.closest('.floating-logo')) {
    return
  }

  closeFloatingNav()
}

const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const onClickHome = () => scrollToSection('homepage-section')
const onClickAbout = () => scrollToSection('about-me-section')
const onClickSkills = () => scrollToSection('skills-section')
const onClickPortofolio = () => scrollToSection('portofolio-section')
const onClickCv = () => scrollToSection('cv-section')

onMounted(() => {
  window.addEventListener('pointerdown', onGlobalPointerDown)
})

onUnmounted(() => {
  window.removeEventListener('pointerdown', onGlobalPointerDown)
  clearNavPhaseTimer()
})
</script>

<template>
  <Home />
  <div class="section-gap" aria-hidden="true"></div>
  <Homepage id="homepage-section" />
  <div class="section-gap" aria-hidden="true"></div>
  <AboutMe />
  <div class="section-gap" aria-hidden="true"></div>
  <Skills />
  <div class="section-gap" aria-hidden="true"></div>
  <Portofolio />
  <div class="section-gap" aria-hidden="true"></div>
  <Cv />
  <div class="floating-logo-wrapper">
    <Logo class="floating-logo" aria-hidden="true" @click.stop="toggleFloatingNav" />
    <div
      class="floating-logo-navbar"
      :class="{
        'is-showing': floatingNavbarPhase === 'showing',
        'is-visible': floatingNavbarPhase === 'visible',
        'is-hiding': floatingNavbarPhase === 'hiding'
      }"
      aria-label="Navbar"
    >
      <button class="floating-nav-button floating-nav-home" type="button" style="--nav-seq: 4" @click="onClickHome">HOME</button>
      <button class="floating-nav-button floating-nav-about" type="button" style="--nav-seq: 3" @click="onClickAbout">About Me</button>
      <button class="floating-nav-button floating-nav-skills" type="button" style="--nav-seq: 2" @click="onClickSkills">Skills</button>
      <button class="floating-nav-button floating-nav-portofolio" type="button" style="--nav-seq: 1" @click="onClickPortofolio">Portofolio</button>
      <button class="floating-nav-button floating-nav-cv" type="button" style="--nav-seq: 0" @click="onClickCv">CV</button>
    </div>
  </div>
</template>

<style scoped>
.section-gap {
  height: clamp(10rem, 30vh, 20rem);
  background-color: black;
}

.floating-logo-wrapper {
  position: fixed;
  right: 3.22916%;
  bottom: 5.74074%;
  width: 6.125vw;
  height: 13.625vh;
  z-index: 30;
  container-type: size;
}

.floating-logo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-size: 5.8cqw;
  line-height: 1;
  pointer-events: auto;
  overflow: hidden;
  cursor: pointer;
}

.floating-logo-navbar {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-nav-button {
  position: absolute;
  margin: 0;
  border: none;
  border-radius: 8.2cqw;
  background: #ffffff;
  color: #000000;
  font-family: 'VT323', monospace;
  font-size: 28cqw;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  transition-property: opacity, transform;
  transition-duration: 240ms;
  transition-timing-function: ease;
  transition-delay: 0ms;
  width: fit-content;
  height: auto;
  padding-inline: 60cqw;
  padding-block: 20cqw;
  white-space: nowrap;
}

.floating-logo-navbar.is-showing .floating-nav-button,
.floating-logo-navbar.is-visible .floating-nav-button {
  opacity: 1;
  transform: translate(-50%, -50%);
  pointer-events: auto;
  transition-delay: calc(var(--nav-seq) * 80ms);
}

.floating-logo-navbar.is-hiding .floating-nav-button {
  opacity: 0;
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition-delay: calc(var(--nav-seq) * 80ms);
}

.floating-nav-home {
  padding-inline: 40cqw;
  left: 70%;
  top: -70%;
  width: 35.5%;
  height: 22%;
}

.floating-nav-about {
  padding-inline: 60cqw;
  left: -40%;
  top: -40%;
  width: 58%;
  height: 22%;
}

.floating-nav-skills {
  padding-inline: 60cqw;
  left: -90%;
  top: 5%;
  width: 60%;
  height: 22%;
}

.floating-nav-portofolio {
  padding-inline: 70cqw;
  left: -90%;
  top: 55%;
  width: 64%;
  height: 22%;
}

.floating-nav-cv {
  padding-inline: 20cqw;
  left: -30%;
  top: 105%;
  width: 25%;
  height: 20%;
}

@media (orientation: portrait) {
  .floating-logo-wrapper {
    right: -5%;
    bottom: 12%;
    width: 22vw;
    height: 12vw;
    min-width: 88px;
    min-height: 48px;
  }

  .floating-logo {
    font-size: 3cqw;
  }

  .floating-nav-button {
    font-size: 22cqw;
    border-radius: 6.5cqw;
    padding-inline: 48cqw;
    padding-block: 18cqw;
  }

  .floating-nav-home {
    padding-inline: 28cqw;
    left: 30%;
    top: -110%;
    width: 47%;
    height: 26%;
  }

  .floating-nav-about {
    padding-inline: 48cqw;
    left: -50%;
    top: -80%;
    width: 76%;
    height: 26%;
  }

  .floating-nav-skills {
    padding-inline: 40cqw;
    left: -70%;
    top: 0%;
    width: 66%;
    height: 25%;
  }

  .floating-nav-portofolio {
    padding-inline: 50cqw;
    left: -70%;
    top: 80%;
    width: 82%;
    height: 25%;
  }

  .floating-nav-cv {
    padding-inline: 20cqw;
    left: -20%;
    top: 160%;
    width: 30%;
    height: 22%;
  }
}
</style>