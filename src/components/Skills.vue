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

      <div class="skills-orbit-item orbit-item-5">
        <p class="skills-item orbit-item-text orbit-item-text-regular">Understanding of many AI Models</p>
        <div class="skills-orbit-line" aria-hidden="true"></div>
      </div>

      <div class="skills-orbit-item orbit-item-6">
        <p class="skills-item orbit-item-text orbit-item-text-large">Boot2Root</p>
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
  left: 14%;
  top: 26%;
  width: 72%;
  height: 66%;
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

/* The label box is intentionally narrower than the orbit's horizontal radius:
   when it was wider, the label + underline swung past the stage edge and got
   clipped by `overflow: hidden`, so the line under some skills vanished. */
.skills-orbit-item {
  position: absolute;
  left: 0;
  top: 0;
  width: 26%;
  z-index: 1;
  offset-path: ellipse(36% 33% at 50% 59%);
  offset-anchor: 50% 50%;
  offset-rotate: 0deg;
  animation: skills-orbit-move 18s linear infinite;
}

.orbit-item-wide {
  width: 27%;
}

/* Six evenly spaced start phases around the 18s lap. */
.orbit-item-1 {
  animation-delay: 0s;
}

.orbit-item-2 {
  animation-delay: -3s;
}

.orbit-item-3 {
  animation-delay: -6s;
}

.orbit-item-4 {
  animation-delay: -9s;
}

.orbit-item-5 {
  animation-delay: -12s;
}

.orbit-item-6 {
  animation-delay: -15s;
}

.orbit-item-text {
  position: relative;
  width: 100%;
  margin: 0;
}

.orbit-item-text-regular {
  font-size: 2.2cqw;
}

.orbit-item-text-large {
  font-size: 2.35cqw;
}

.skills-orbit-line {
  margin-top: 0.55556%;
  border-top: 0.15625cqw solid #ffffff;
  box-shadow: 0 0 0.5cqw rgb(255 255 255 / 40%);
}

.skills-item-center {
  left: 32.96875%;
  top: 47.03704%;
  width: 34.0625%;
  padding: 1.2cqw 1.6cqw;
  background: #000000;
  font-size: 3.33333cqw;
  z-index: 3;
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

@media (orientation: portrait) {
  .skills-orbit {
    display: block;
    left: 20%;
    top: 25%;
    width: 60%;
    height: 54%;
    border-width: 0.32cqw;
  }

  .skills-intro {
    left: 17%;
    top: 12.5%;
    width: 66%;
    font-size: 4.5cqw;
  }

  /* Same principle as landscape: a narrower box keeps the label + underline
     from swinging past the stage edge and being clipped. */
  .skills-orbit-item {
    width: 29%;
    offset-path: ellipse(30% 27% at 50% 52%);
    offset-anchor: 50% 50%;
    offset-rotate: 0deg;
  }

  .orbit-item-wide {
    width: 30%;
  }

  .orbit-item-text-regular,
  .orbit-item-text-large {
    font-size: 2.55cqw;
  }

  .skills-item-center {
    left: 22%;
    top: 47%;
    width: 56%;
    font-size: 3.6cqw;
  }

  .skills-item-center {
    left: 24%;
    top: 49%;
    width: 52%;
    font-size: 4.1cqw;
  }

  .skills-line-center {
    left: 24%;
    top: 54.8%;
    width: 52%;
    border-top-width: 0.23cqw;
  }

  .skills-orbit-line {
    border-top-width: 0.23cqw;
  }
}
</style>
