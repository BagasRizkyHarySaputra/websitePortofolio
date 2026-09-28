<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue"

import profileImage from "../assets/homepage-profile.png"
import profileImageHpTall from "../assets/homepage-profile-hp-tall.png"
import profileImageHpWide from "../assets/homepage-profile-hp-wide.png"

const DESCRIPTION_TEXT =
  "Hi, my name is Bagas Rizky Hary Saputra, also known as “debugging”. I’m 16 years old and passionate about cybersecurity. I have participated in several Capture The Flag (CTF) competitions, with a focus on binary exploitation. I enjoy analyzing binaries, finding vulnerabilities, and developing exploits. I also practice through platforms like TryHackMe and use tools such as GDB and other debugging tools."

// One element per character so the scroll-driven wipe advances in reading
// order (left to right, then onto the next line) instead of all at once.
const characters = computed(() => Array.from(DESCRIPTION_TEXT))
const characterCount = computed(() => characters.value.length)

const descriptionEl = ref(null)

let revealFrame = null

const clamp01 = (value) => Math.min(1, Math.max(0, value))

const updateReveal = () => {
  revealFrame = null

  const el = descriptionEl.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0

  if (viewportHeight === 0) return

  // Reveal starts as the paragraph enters the viewport and finishes
  // once it has settled into the upper half of the screen.
  const revealStart = viewportHeight * 0.92
  const revealEnd = viewportHeight * 0.35
  const travel = revealStart - revealEnd

  const progress = travel > 0 ? clamp01((revealStart - rect.top) / travel) : 1

  // Hand the wipe a character cursor: each glyph lights up once the cursor
  // has passed it, so the paint runs left-to-right and then wraps.
  el.style.setProperty("--reveal-chars", (progress * characterCount.value).toFixed(2))
}

const scheduleReveal = () => {
  if (revealFrame !== null) return
  revealFrame = window.requestAnimationFrame(updateReveal)
}

onMounted(() => {
  updateReveal()
  window.addEventListener("scroll", scheduleReveal, { passive: true })
  window.addEventListener("resize", scheduleReveal, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener("scroll", scheduleReveal)
  window.removeEventListener("resize", scheduleReveal)

  if (revealFrame !== null) {
    window.cancelAnimationFrame(revealFrame)
    revealFrame = null
  }
})
</script>

<template>
  <section class="homepage">
    <div class="homepage-stage">
      <div class="profile-backdrop" aria-hidden="true"></div>
      <img class="profile-image profile-image-landscape" :src="profileImage" alt="Bagas profile" />
      <img class="profile-image profile-image-portrait-tall" :src="profileImageHpTall" alt="" aria-hidden="true" />
      <img class="profile-image profile-image-portrait-wide" :src="profileImageHpWide" alt="" aria-hidden="true" />

      <h1 class="profile-name">Bagas Rizky Hary Saputra</h1>
      <p class="profile-role">cyber security Enthusiast</p>
      <div class="profile-divider" aria-hidden="true"></div>

      <p ref="descriptionEl" class="profile-description">
        <span
          v-for="(char, index) in characters"
          :key="index"
          class="profile-character"
          :style="{ '--i': index }"
        >{{ char }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.homepage {
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
}

.homepage-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.profile-backdrop {
  position: absolute;
  left: 10.15625%;
  top: 16.2963%;
  width: 19.01042%;
  height: 39.62963%;
  background: transparent;
  border: 0.12cqw solid #d9d9d9;
}

.profile-image {
  position: absolute;
}

.profile-image-landscape {
  left: 7.65625%;
  top: 11.2037%;
  width: 20.83333%;
  height: 43.51852%;
  object-fit: cover;
}

.profile-image-portrait-tall,
.profile-image-portrait-wide {
  display: none;
}

.profile-name,
.profile-role,
.profile-description {
  margin: 0;
  position: absolute;
  font-family: 'VT323', monospace;
  color: #ffffff;
}

.profile-name {
  left: 31.51042%;
  top: 19.07407%;
  width: 52%;
  height: 7.96296%;
  font-size: 4.47917cqw;
  line-height: 1;
  white-space: nowrap;
}

.profile-role {
  left: 31.71875%;
  top: 28.24074%;
  width: 29.21875%;
  height: 5.18519%;
  font-size: 2.91667cqw;
  line-height: 1;
}

.profile-divider {
  position: absolute;
  left: 31.61456%;
  top: 27.91953%;
  width: 31.61462%;
  border-top: 0.12cqw solid #ffffff;
}

.profile-description {
  left: 10.15625%;
  top: 58.14815%;
  width: 84.21875%;
  height: 30.64815%;
  font-size: 2.5cqw;
  line-height: 1.05;
  text-align: justify;

  /* Scroll-linked reveal: --reveal-chars (0 -> characterCount) is a cursor
     driven from script. Each character brightens once the cursor passes it,
     so the paint sweeps left-to-right and then wraps onto the next line. */
  --reveal-chars: 0;
  --profile-dim: 0.22;
  --reveal-softness: 3;
}

.profile-character {
  font-style: inherit;
  opacity: max(
    calc((var(--reveal-chars) - var(--i)) / var(--reveal-softness)),
    var(--profile-dim)
  );
  transition: opacity 0.06s linear;
}

@media (prefers-reduced-motion: reduce) {
  .profile-description {
    --reveal-chars: 9999;
  }

  .profile-character {
    transition: none;
  }
}

@media (orientation: portrait) {
  .homepage-stage {
    inset: 0;
    width: 100%;
    height: 100%;
    transform: none;
  }

  .profile-image-landscape {
    display: none;
  }

  .profile-image-portrait-tall,
  .profile-image-portrait-wide {
    display: block;
    left: 5.9455%;
    top: 16.57165%;
    object-fit: cover;
    object-position: left top;
  }

  .profile-image-portrait-tall {
    width: 27.00248%;
    height: 55.79628%;
    z-index: 1;
  }

  .profile-image-portrait-wide {
    width: 34.35178%;
    height: 44.05169%;
    z-index: 2;
  }

  .profile-backdrop {
    left: 7.01899%;
    top: 21.24667%;
    width: 28.07597%;
    height: 52.07146%;
    border-width: 0.22cqw;
  }

  .profile-name {
    left: 40.32453%;
    top: 20.94261%;
    width: 56.23452%;
    height: auto;
    font-size: 4.9cqw;
    line-height: 1;
    text-align: left;
    white-space: normal;
  }

  .profile-role {
    left: 40.57225%;
    top: 24.17345%;
    width: 53.8378%;
    height: auto;
    font-size: 3.6cqw;
    line-height: 1;
    text-align: left;
  }

  .profile-divider {
    left: 40.44045%;
    top: 24.04105%;
    width: 35.19075%;
    border-top-width: 0.22cqw;
  }

  .profile-description {
    left: 40.48968%;
    top: 27.54694%;
    width: 53.92238%;
    height: 34.96769%;
    font-size: 5cqw;
    line-height: 1.06;
    text-align: justify;
  }
}

@media (orientation: portrait) and (min-width: 700px) {
  .homepage-stage {
    inset: auto;
    left: 50%;
    top: 50%;
    height: 100%;
    width: auto;
    max-width: 100%;
    aspect-ratio: 1211 / 2631;
    transform: translate(-50%, -50%);
  }

  .profile-image-portrait-tall,
  .profile-image-portrait-wide {
    left: 5.9455%;
    top: 14.8%;
  }

  .profile-image-portrait-tall {
    width: 23.8%;
    height: 60.4%;
  }

  .profile-image-portrait-wide {
    width: 34.35178%;
    height: 44.05169%;
    object-position: right top;
  }

  .profile-backdrop {
    left: 6.9%;
    top: 20.5%;
    width: 24.8%;
    height: 58.5%;
  }
}
</style>
