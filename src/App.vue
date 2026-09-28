<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

import Home from './components/Home.vue'
import SiteBackground from './components/SiteBackground.vue'
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
  <SiteBackground />
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
      <button class="floating-nav-button floating-nav-home" type="button" style="--nav-seq: 5" aria-label="Home" title="HOME" @click="onClickHome">
        <svg class="floating-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11.2 12 4l8 7.2" />
          <path d="M6.5 10v9h11v-9" />
          <path d="M10 19v-5h4v5" />
        </svg>
      </button>
      <button class="floating-nav-button floating-nav-about" type="button" style="--nav-seq: 4" aria-label="About Me" title="About Me" @click="onClickAbout">
        <svg class="floating-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="3.4" />
          <path d="M5.5 20c0-3.6 2.9-6.2 6.5-6.2s6.5 2.6 6.5 6.2" />
        </svg>
      </button>
      <button class="floating-nav-button floating-nav-skills" type="button" style="--nav-seq: 3" aria-label="Skills" title="Skills" @click="onClickSkills">
        <svg class="floating-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="m8 8-4 4 4 4" />
          <path d="m16 8 4 4-4 4" />
          <path d="M13.5 5.5 10.5 18.5" />
        </svg>
      </button>
      <button class="floating-nav-button floating-nav-achievement" type="button" style="--nav-seq: 2" aria-label="Achievement" title="Achievement" @click="onClickAchievement">
        <svg class="floating-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9" r="5" />
          <path d="M8.6 13.2 7 21l5-2.6L17 21l-1.6-7.8" />
        </svg>
      </button>
      <button class="floating-nav-button floating-nav-portofolio" type="button" style="--nav-seq: 1" aria-label="Portfolio" title="Portfolio" @click="onClickPortofolio">
        <svg class="floating-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="7.5" width="17" height="12" rx="1.6" />
          <path d="M9 7.5V6.2A1.7 1.7 0 0 1 10.7 4.5h2.6A1.7 1.7 0 0 1 15 6.2v1.3" />
          <path d="M3.5 12.5h17" />
          <path d="M11 12.5h2v2h-2z" />
        </svg>
      </button>
      <button class="floating-nav-button floating-nav-cv" type="button" style="--nav-seq: 0" aria-label="CV" title="CV" @click="onClickCv">
        <svg class="floating-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.5 3.5h7l4 4v13h-11z" />
          <path d="M13.5 3.5v4h4" />
          <path d="M9 12h6M9 15.2h6M9 8.6h2.4" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.section-gap {
  height: clamp(10rem, 30vh, 20rem);
  background-color: transparent;
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
  /* Ring layout: every button sits on one circle around the logo. */
  --ring: 200cqw;
  width: 62cqw;
  height: 62cqw;
}

/* Minimal line-art icons that match the terminal / monospace theme. */
.floating-nav-icon {
  width: 62%;
  height: 62%;
  fill: none;
  stroke: #000000;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.floating-nav-button:hover .floating-nav-icon,
.floating-nav-button:focus-visible .floating-nav-icon {
  stroke: #000000;
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
  }
}
</style>