<script setup>
import Logo from "./Logo.vue"

const scrollToHomepage = () => {
  document.getElementById("homepage-section")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}

const scrollToAboutMe = () => {
  document.getElementById("about-me-section")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}

const scrollToSkills = () => {
  document.getElementById("skills-section")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  })
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-stage">
      <Logo class="hero-logo" />

      <h1 class="hero-title">BAGAS RIZKY HARY SAPUTRA</h1>

      <button class="hero-nav-item hero-nav-home" type="button" @click="scrollToHomepage">HOME</button>
      <button class="hero-nav-item hero-nav-about" type="button" @click="scrollToAboutMe">About Me</button>
      <button class="hero-nav-item hero-nav-skills" type="button" @click="scrollToSkills">Skills</button>

      <p class="hero-scroll-text">scroll down!</p>
      <div class="hero-chevron hero-chevron-top"></div>
      <div class="hero-chevron hero-chevron-bottom"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  width: 100vw;
  height: 100vh;
  background-color: #000000;
  position: relative;
  overflow: hidden;
}

.hero-stage {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(100vw, calc(100vh * 16 / 9));
  aspect-ratio: 16 / 9;
  container-type: size;
}

.hero-logo {
  position: absolute;
  left: 48.90625%;
  top: 22.03704%;
  width: 23.54167%;
  height: 42.22222%;
}

.hero-title,
.hero-scroll-text {
  position: absolute;
  margin: 0;
  font-family: 'VT323', monospace;
  font-weight: 400;
  line-height: 1;
}

.hero-title {
  left: 34.32292%;
  top: 71.2963%;
  width: 52.65625%;
  height: 6.66667%;
  font-size: 3.75cqw;
  color: #ffffff;
  text-align: center;
}

.hero-nav-item {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  font-family: 'VT323', monospace;
  font-weight: 400;
  line-height: 1;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
  z-index: 1;
  transition: color 0.18s ease;
}

.hero-nav-item::before {
  content: "";
  position: absolute;
  inset: 0;
  background: #ffffff;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.18s ease;
}

.hero-nav-item:hover {
  color: #000000;
}

.hero-nav-item:hover::before {
  opacity: 1;
}

.hero-nav-item.is-active {
  color: #000000;
}

.hero-nav-item.is-active::before {
  opacity: 1;
}

.hero-nav-home {
  left: 6.5625%;
  top: 34.44444%;
  width: 15.15625%;
  height: 9.07407%;
  font-size: 3.75cqw;
}

.hero-nav-about {
  left: 7.1875%;
  top: 45.46296%;
  width: 13.90625%;
  height: 9.07407%;
  font-size: 3.75cqw;
}

.hero-nav-skills {
  left: 7.1875%;
  top: 56.48148%;
  width: 13.90625%;
  height: 9.07407%;
  font-size: 3.75cqw;
}

.hero-scroll-text {
  left: 34.32292%;
  top: 85%;
  width: 52.65625%;
  height: 4.16667%;
  font-size: 2.34375cqw;
  color: #ffffff;
  text-align: center;
}

.hero-chevron {
  position: absolute;
  width: 1.04167%;
  height: 1.11111%;
  background: #ffffff;
  clip-path: polygon(0 0, 15% 0, 50% 62%, 85% 0, 100% 0, 50% 100%);
}

.hero-chevron-top {
  left: 60.10417%;
  top: 91.38889%;
}

.hero-chevron-bottom {
  left: 60.10417%;
  top: 92.77778%;
}

:deep(.hero-logo .logo-container) {
  width: 100%;
  height: 100%;
}

:deep(.hero-logo .eyes-container) {
  width: 100%;
  height: 100%;
}

:deep(.hero-logo .ascii-art) {
  font-size: 1.25cqw;
  line-height: 1;
}
</style>
