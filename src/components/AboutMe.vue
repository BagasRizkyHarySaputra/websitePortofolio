<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import group38103 from '../assets/aboutme/group-38-103.svg'
import group41257 from '../assets/aboutme/group-41-257.svg'
import group39106 from '../assets/aboutme/group-39-106.svg'
import group41330 from '../assets/aboutme/group-41-330.svg'
import group41477 from '../assets/aboutme/group-41-477.svg'
import group41626 from '../assets/aboutme/group-41-626.svg'
import group41404 from '../assets/aboutme/group-41-404.svg'
import group39179 from '../assets/aboutme/group-39-179.svg'
import group41551 from '../assets/aboutme/group-41-551.svg'
import group41701 from '../assets/aboutme/group-41-701.svg'
import group41702 from '../assets/aboutme/group-41-702.svg'
import group41705 from '../assets/aboutme/group-41-705.svg'
import group41709 from '../assets/aboutme/group-41-709.svg'

// Grouped so every heading reads as a chapter: a title, a leading chevron,
// and the ribbon facts that belong to it. Landscape keeps each item's
// original absolute placement (see `.about-me-body { display: contents }`).
const aboutGroups = [
  {
    key: 'background',
    heading: 'Background',
    headingClass: 'about-heading-background',
    arrow: group41705,
    items: [
      {
        src: group38103,
        text: 'Student on SMK Negeri 7 Semarang',
        textClass: 'item',
        left: '6.71875%',
        top: '12.40741%',
        width: '42.35784%',
        height: '6.68968%'
      },
      {
        src: group39106,
        text: 'Elder Brother',
        textClass: 'item',
        left: '6.71875%',
        top: '21.11111%',
        width: '42.35784%',
        height: '6.68968%'
      },
      {
        src: group39179,
        text: 'Interested in IT and cybersecurity from 10th grade',
        textClass: 'item-small',
        left: '6.71875%',
        top: '29.81481%',
        width: '42.35784%',
        height: '6.68968%'
      }
    ]
  },
  {
    key: 'advantages',
    heading: 'Advantages',
    headingClass: 'about-heading-advantages',
    arrow: group41709,
    items: [
      {
        src: group41257,
        text: 'Basic Programming',
        textClass: 'item',
        left: '52.44792%',
        top: '12.40741%',
        width: '42.35784%',
        height: '6.68968%'
      },
      {
        src: group41330,
        text: 'Cybersecurity Basic',
        textClass: 'item',
        left: '52.44792%',
        top: '21.11111%',
        width: '42.35784%',
        height: '6.68968%'
      },
      {
        src: group41477,
        text: 'Public Speaking',
        textClass: 'item',
        left: '52.60417%',
        top: '29.81481%',
        width: '42.35784%',
        height: '6.68968%'
      },
      {
        src: group41626,
        text: 'Persistence and consistency',
        textClass: 'item',
        left: '52.76042%',
        top: '38.51852%',
        width: '42.35784%',
        height: '6.68968%'
      }
    ]
  },
  {
    key: 'hobbies',
    heading: 'Interest & Hobbies',
    headingClass: 'about-heading-hobbies',
    arrow: group41702,
    items: [
      {
        src: group41551,
        text: 'Joining CTF Event',
        textClass: 'item',
        left: '6.875%',
        top: '52.68519%',
        width: '42.35784%',
        height: '6.68968%'
      }
    ]
  },
  {
    key: 'career',
    heading: 'Career Goals',
    headingClass: 'about-heading-career',
    arrow: group41701,
    items: [
      {
        src: group41404,
        text: 'To Become Cybersecurity Professional',
        textClass: 'item-goal',
        left: '7.03125%',
        top: '77.5%',
        width: '42.35784%',
        height: '6.68968%'
      }
    ]
  }
]

const rootEl = ref(null)
let observer = null

// Stagger every heading / ribbon as the section scrolls in, mirroring the
// Achievement section so the two chapters share one motion language.
onMounted(() => {
  const targets = rootEl.value?.querySelectorAll('.about-group-heading, .about-item-group') ?? []
  const list = Array.from(targets)
  list.forEach((el, index) => el.style.setProperty('--about-seq', index))

  const revealAll = () => list.forEach((el) => el.classList.add('is-visible'))

  const prefersReducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealAll()
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.2 }
  )

  list.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <section ref="rootEl" class="about-me" id="about-me-section">
    <div class="about-me-stage">
      <p class="about-text glitch">Ȁ̶ͅB̷̭̹̆̅͝O̸̝̞͆̌̽Ű̵̩͕̇̐̐Ţ̶̅͐̏̊ ̸͎̫̝̠͍͒̄͛M̸̧͍̝̜̒͠Ḛ̵̦̉̃̅!̴͖̭̓̏͜͠</p>

      <div class="about-me-body">
        <div v-for="group in aboutGroups" :key="group.key" class="about-group">
          <p class="about-text about-group-heading" :class="group.headingClass">
            <img class="about-group-arrow" :src="group.arrow" alt="" aria-hidden="true" />
            <span>{{ group.heading }}</span>
          </p>

          <div class="about-group-items">
            <div
              v-for="(item, index) in group.items"
              :key="index"
              class="about-item-group"
              :style="{ left: item.left, top: item.top, width: item.width, height: item.height }"
            >
              <img class="about-item-decoration" :src="item.src" alt="" aria-hidden="true" />
              <p class="about-text about-item-label" :class="item.textClass">{{ item.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-me {
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
}

.about-me-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.about-text {
  margin: 0;
  position: absolute;
  font-family: 'VT323', monospace;
  color: #ffffff;
  line-height: 1;
}

/* Landscape: the wrappers dissolve so every heading / ribbon keeps its own
   absolute placement on the stage (pixel-identical to the previous layout). */
.about-me-body,
.about-group,
.about-group-items {
  display: contents;
}

/* ---------- Headings: a small chevron followed by the title ---------- */
.about-group-heading {
  display: flex;
  align-items: center;
  gap: 0.55cqw;
  font-size: 2.5cqw;
  white-space: nowrap;
}

.about-group-arrow {
  width: 1.37845cqw;
  aspect-ratio: 27 / 46;
  flex: 0 0 auto;
}

.about-heading-background {
  left: 6.19792%;
  top: 5.27778%;
}

.about-heading-advantages {
  left: 50.36458%;
  top: 5.27778%;
}

.about-heading-hobbies {
  left: 6.19792%;
  top: 44.53704%;
}

.about-heading-career {
  left: 6.35417%;
  top: 69.35185%;
}

/* ---------- Ribbon items ---------- */
.about-item-group {
  position: absolute;
}

.about-item-decoration {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.about-item-label {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.item {
  font-size: 2.5cqw;
}

.item-small {
  font-size: 1.61458cqw;
}

.item-goal {
  font-size: 2.24375cqw;
}

/* Staggered reveal — each heading / ribbon fades up in reading order. */
.about-group-heading,
.about-item-group {
  opacity: 0;
  transform: translateY(1.6cqw);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: calc(var(--about-seq, 0) * 60ms);
}

.about-group-heading.is-visible,
.about-item-group.is-visible {
  opacity: 1;
  transform: none;
}

/* ---------- Big glitchy "ABOUT ME!" title ---------- */
.glitch {
  left: 56.97917%;
  top: 68.42593%;
  width: 34.0625%;
  font-size: 3.75cqw;
  text-align: center;
}

@media (orientation: portrait) {
  .about-me-stage {
    inset: auto;
    left: 50%;
    top: 50%;
    height: 100%;
    width: auto;
    max-width: 100%;
    aspect-ratio: 1211 / 2631;
    transform: translate(-50%, -50%);
  }

  .glitch {
    left: 50%;
    top: 4.5%;
    width: 80%;
    transform: translateX(-50%);
    font-size: 5.6cqw;
  }

  /* One column: chapters spread top-to-bottom so nothing is left dangling. */
  .about-me-body {
    position: absolute;
    inset: 14% 6% 6% 6%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 2cqw;
  }

  .about-group {
    display: flex;
    flex-direction: column;
    gap: 1.4cqw;
  }

  .about-group-items {
    display: flex;
    flex-direction: column;
    gap: 1.3cqw;
  }

  .about-group-heading {
    position: static;
    font-size: 4cqw;
    gap: 1.4cqw;
  }

  .about-group-arrow {
    width: 2.6cqw;
  }

  /* Ribbons become full-width rows that keep their native 814:73 shape. */
  .about-item-group {
    position: relative;
    left: auto !important;
    top: auto !important;
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 814 / 73;
  }

  .item {
    font-size: 2.7cqw;
  }

  .item-small {
    font-size: 2.5cqw;
  }

  .item-goal {
    font-size: 2.5cqw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-group-heading,
  .about-item-group {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
