<template>
  <section class="skills" id="skills-section">
    <div class="skills-stage">
      <div class="skills-orbit" aria-hidden="true"></div>

      <p class="skills-intro">Things I've learned so far.</p>

      <div class="skills-orbit-item orbit-item-1">
        <p class="skills-item orbit-item-text orbit-item-text-regular">Binary Exploitation</p>
        <div class="skills-orbit-line" aria-hidden="true"></div>
      </div>

      <div class="skills-orbit-item orbit-item-2">
        <p class="skills-item orbit-item-text orbit-item-text-regular">Linux command-line proficiency</p>
        <div class="skills-orbit-line" aria-hidden="true"></div>
      </div>

      <div class="skills-orbit-item orbit-item-3">
        <p class="skills-item orbit-item-text orbit-item-text-large">Networking fundamentals</p>
        <div class="skills-orbit-line" aria-hidden="true"></div>
      </div>

      <div class="skills-orbit-item orbit-item-4 orbit-item-wide">
        <p class="skills-item orbit-item-text orbit-item-text-large">Data decoding and encoding using tools like CyberChef</p>
        <div class="skills-orbit-line" aria-hidden="true"></div>
      </div>

      <p class="skills-item skills-item-center">HTML, CSS, Javascript</p>
      <div class="skills-line skills-line-center" aria-hidden="true"></div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
}

.skills-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.skills-orbit {
  position: absolute;
  left: 1%;
  top: 25%;
  width: 98%;
  height: 68%;
  border: 0.2vw solid #ffffff4c;
  border-radius: 50%;
  background: transparent;
  box-sizing: border-box;
}

.skills-intro,
.skills-item {
  margin: 0;
  position: absolute;
  font-family: 'VT323', monospace;
  color: #ffffff;
  text-align: center;
  line-height: 1;
}

.skills-intro {
  left: 34.21875%;
  top: 11.2037%;
  width: 31.5625%;
  font-size: 2.91667cqw;
}

.skills-item {
  width: 34.0625%;
}

.skills-orbit-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 34.0625%;
  offset-path: ellipse(49% 34% at 50% 59%);
  offset-anchor: 50% 50%;
  offset-rotate: 0deg;
  animation: skills-orbit-move 18s linear infinite;
}

.orbit-item-wide {
  width: 35.52083%;
}

.orbit-item-1 {
  animation-delay: 0s;
}

.orbit-item-2 {
  animation-delay: -4.5s;
}

.orbit-item-3 {
  animation-delay: -9s;
}

.orbit-item-4 {
  animation-delay: -13.5s;
}

.orbit-item-text {
  position: relative;
  width: 100%;
  margin: 0;
}

.orbit-item-text-regular {
  font-size: 2.5cqw;
}

.orbit-item-text-large {
  font-size: 2.70833cqw;
}

.skills-orbit-line {
  margin-top: 0.55556%;
  border-top: 0.15625cqw solid #ffffff;
}

.skills-item-center {
  left: 32.96875%;
  top: 47.03704%;
  font-size: 3.33333cqw;
}

.skills-line {
  position: absolute;
  border-top: 0.15625cqw solid #ffffff;
}

.skills-line-center {
  left: 34.21875%;
  top: 53.7037%;
  width: 31.5625%;
}

@keyframes skills-orbit-move {
  from {
    offset-distance: 0%;
  }

  to {
    offset-distance: 100%;
  }
}
</style>
