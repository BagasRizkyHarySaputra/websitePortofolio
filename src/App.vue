<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import Home from './components/Home.vue'
import Homepage from './components/Homepage.vue'
import AboutMe from './components/AboutMe.vue'
import Skills from './components/Skills.vue'
import Achievement from './components/Achievement.vue'
import Portofolio from './components/Portofolio.vue'
import Cv from './components/cv.vue'
import Logo from './components/Logo.vue'

const floatingNavbarPhase = ref('hidden')

const NAV_ITEM_COUNT = 6
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
const onClickAchievement = () => scrollToSection('achievement-section')
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
  <Achievement />
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
      <button class="floating-nav-button floating-nav-home" type="button" style="--nav-seq: 5" @click="onClickHome">HOME</button>
      <button class="floating-nav-button floating-nav-about" type="button" style="--nav-seq: 4" @click="onClickAbout">About Me</button>
      <button class="floating-nav-button floating-nav-skills" type="button" style="--nav-seq: 3" @click="onClickSkills">Skills</button>
      <button class="floating-nav-button floating-nav-achievement" type="button" style="--nav-seq: 2" @click="onClickAchievement">Achievement</button>
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
  border-radius: 50%;
  background: #ffffff;
  color: #000000;
  font-family: 'VT323', monospace;
  font-size: 13cqw;
  line-height: 0.98;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
  transition-property: opacity, transform;
  transition-duration: 240ms;
  transition-timing-function: ease;
  transition-delay: 0ms;
  /* Ring layout: every button sits on one circle around the logo. */
  --ring: 200cqw;
  width: 62cqw;
  height: 62cqw;
  overflow-wrap: anywhere;
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

/* Buttons fan out along a quarter-circle around the logo (the "ring").
   Each position is the precomputed cos/sin of its angle x --ring, so the
   whole fan keeps its proportions at any aspect ratio. */
.floating-nav-home {
  left: calc(50% + 0.174 * var(--ring));
  top: calc(50% - 0.985 * var(--ring));
}

.floating-nav-about {
  left: calc(50% - 0.174 * var(--ring));
  top: calc(50% - 0.985 * var(--ring));
}

.floating-nav-skills {
  left: calc(50% - 0.5 * var(--ring));
  top: calc(50% - 0.866 * var(--ring));
}

.floating-nav-achievement {
  left: calc(50% - 0.766 * var(--ring));
  top: calc(50% - 0.643 * var(--ring));
}

.floating-nav-portofolio {
  left: calc(50% - 0.94 * var(--ring));
  top: calc(50% - 0.342 * var(--ring));
}

.floating-nav-cv {
  left: calc(50% - var(--ring));
  top: 50%;
}

@media (orientation: portrait) {
  .floating-logo-wrapper {
    right: 4%;
    bottom: 6%;
    width: 20vw;
    height: 20vw;
    min-width: 76px;
    min-height: 76px;
  }

  .floating-logo {
    font-size: 5.8cqw;
  }

  .floating-nav-button {
    --ring: 175cqw;
    width: 54cqw;
    height: 54cqw;
    font-size: 11cqw;
  }
}
</style>