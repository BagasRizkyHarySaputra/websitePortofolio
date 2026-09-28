<script setup>
import { ref } from 'vue'

import { useScrollReveal } from '../composables/useScrollReveal'

const achievements = [
  {
    rank: '1st Place',
    name: 'CYBREAK 2026',
    org: 'ITS',
    link: 'https://sijastembase.blogspot.com/2026/09/berprestasi-pada-ajang-cybersecurity.html',
    hint: 'View proof on the school blog'
  },
  {
    rank: '2nd Place',
    name: 'SCTF 2026',
    org: 'DCSC',
    link: 'https://www.instagram.com/p/Dabv4QrtCQE/',
    hint: 'View proof on Instagram'
  },
  {
    rank: '2nd Place',
    name: 'WRECKIT7.0 Junior CTF 2026',
    org: '',
    link: 'https://sijastembase.blogspot.com/2026/08/berprestasi-pada-ajang-ctf-junior.html',
    hint: 'View proof on the school blog'
  },
  {
    rank: 'Best Writeup',
    name: 'WRECKIT7.0 Junior CTF 2026',
    org: 'BSSN',
    link: 'https://sijastembase.blogspot.com/2026/08/berprestasi-pada-ajang-ctf-junior.html',
    hint: 'View proof on the school blog'
  }
]

const openAchievement = (item) => {
  if (!item?.link) return
  window.open(item.link, '_blank', 'noopener,noreferrer')
}

const rootEl = ref(null)

// Replays on every pass: each award fades + slides in from the side the
// content is travelling from, then resets when it leaves the viewport.
useScrollReveal(rootEl, '.achievement-item', {
  activeClass: 'is-in',
  seqVar: '--ach-index',
  stagger: 70,
  threshold: 0.25
})
</script>

<template>
  <section ref="rootEl" class="achievement" id="achievement-section">
    <div class="achievement-stage">
      <div class="achievement-badge" aria-hidden="true"></div>
      <p class="achievement-title">Achievement</p>
      <div class="achievement-rule" aria-hidden="true"></div>

      <ul class="achievement-list">
        <li
          v-for="(item, index) in achievements"
          :key="`achievement-${index}`"
          class="achievement-item"
          :style="{ '--ach-index': index }"
        >
          <button
            type="button"
            class="achievement-link"
            :title="item.hint"
            :aria-label="`View proof: ${item.rank} ${item.name}${item.org ? ' (' + item.org + ')' : ''}`"
            @click="openAchievement(item)"
          >
            <span class="achievement-rank">{{ item.rank }}</span>
            <span class="achievement-body">
              <span class="achievement-name">{{ item.name }}</span>
              <span v-if="item.org" class="achievement-org">· {{ item.org }}</span>
            </span>
            <span class="achievement-cta" aria-hidden="true">↗</span>
          </button>
        </li>

        <li
          class="achievement-item achievement-item-next"
          :style="{ '--ach-index': achievements.length }"
        >
          <span class="achievement-flag">NEXT{C0m1ng_5oon}</span><span class="achievement-cursor" aria-hidden="true"></span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.achievement {
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.achievement-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.achievement-title,
.achievement-rank,
.achievement-name,
.achievement-org,
.achievement-flag {
  margin: 0;
  font-family: 'VT323', monospace;
  line-height: 1;
}

.achievement-badge {
  position: absolute;
  left: 10%;
  top: 6.66667%;
  width: 30.02083%;
  height: 9.07407%;
  background: #ffffff;
}

.achievement-title {
  position: absolute;
  left: 10%;
  top: calc(11.2037% - 1.875cqw);
  width: 30.02083%;
  font-size: 3.75cqw;
  text-align: center;
  color: #000000;
}

.achievement-rule {
  position: absolute;
  left: 10%;
  top: 19.81481%;
  width: 80%;
  border-top: 0.15625cqw solid #ffffff;
}

.achievement-list {
  position: absolute;
  left: 10%;
  top: 24.07407%;
  width: 80%;
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.77778cqw;
}

.achievement-item {
  display: block;
  padding-bottom: 1.6cqw;
  border-bottom: 0.15625cqw solid rgb(255 255 255 / 32%);

  opacity: 0;
  transform: translateY(1.6cqw);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: calc(var(--ach-index, 0) * 70ms);
}

.achievement-item.reveal-from-above {
  transform: translateY(-1.6cqw);
}

.achievement-item.is-in {
  opacity: 1;
  transform: none;
}

/* The whole row is one button that opens the proof of the award. */
.achievement-link {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 2.4cqw;
  width: 100%;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;
  border-radius: 0.6cqw;
}

.achievement-link:focus-visible {
  outline: 0.2cqw solid rgb(255 255 255 / 70%);
  outline-offset: 0.6cqw;
}

.achievement-link:hover .achievement-name,
.achievement-link:focus-visible .achievement-name {
  text-decoration: underline;
  text-underline-offset: 0.5cqw;
}

.achievement-link:hover .achievement-rank,
.achievement-link:focus-visible .achievement-rank {
  border-color: #ffffff;
  background: rgb(255 255 255 / 12%);
}

.achievement-cta {
  font-family: 'VT323', monospace;
  font-size: 2.4cqw;
  line-height: 1;
  color: rgb(255 255 255 / 45%);
  transition: color 0.2s ease, transform 0.2s ease;
}

.achievement-link:hover .achievement-cta,
.achievement-link:focus-visible .achievement-cta {
  color: #ffffff;
  transform: translate(0.3cqw, -0.3cqw);
}

.achievement-rank {
  display: inline-block;
  padding: 0.5cqw 1.1cqw;
  font-size: 2.2cqw;
  color: #ffffff;
  border: 0.15625cqw solid rgb(255 255 255 / 55%);
  border-radius: 0.4cqw;
  white-space: nowrap;
}

.achievement-body {
  display: inline-flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0 1.2cqw;
}

.achievement-name {
  font-size: 2.91667cqw;
  color: #ffffff;
}

.achievement-org {
  font-size: 2.2cqw;
  color: rgb(255 255 255 / 55%);
}

.achievement-item-next {
  border-bottom: none;
  padding-bottom: 0;
}

.achievement-flag {
  font-size: 2.91667cqw;
  letter-spacing: 0.06em;
  color: rgb(255 255 255 / 78%);
}

.achievement-cursor {
  display: inline-block;
  width: 1.1cqw;
  height: 2.91667cqw;
  margin-left: 0.4cqw;
  vertical-align: text-bottom;
  background: #ffffff;
  animation: achievement-blink 1.05s steps(1, end) infinite;
}

@keyframes achievement-blink {
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
}

@media (orientation: portrait) {
  .achievement-stage {
    inset: 0;
    left: auto;
    top: auto;
    width: 100%;
    height: 100%;
    max-width: none;
    aspect-ratio: auto;
    transform: none;
  }

  .achievement-badge {
    left: 9.66144%;
    top: 5.13113%;
    width: 55%;
    height: 3.72482%;
  }

  .achievement-title {
    left: 9.66144%;
    top: calc(6.99354% - 2.7cqw);
    width: 55%;
    font-size: 5.4cqw;
  }

  .achievement-rule {
    left: 9.66144%;
    top: 11.74192%;
    width: 80.67713%;
    border-top-width: 0.2cqw;
  }

  .achievement-list {
    left: 9.66144%;
    top: 24%;
    width: 80.67713%;
    height: 62%;
    gap: 0;
    justify-content: space-between;
  }

  .achievement-item {
    gap: 2.6cqw;
    padding-bottom: 1.9cqw;
    border-bottom-width: 0.2cqw;
  }

  .achievement-link {
    gap: 2.6cqw;
  }

  .achievement-cta {
    font-size: 3.4cqw;
  }

  .achievement-rank {
    padding: 0.7cqw 1.5cqw;
    font-size: 3.3cqw;
    border-width: 0.2cqw;
    border-radius: 0.7cqw;
  }

  .achievement-name {
    font-size: 4.2cqw;
  }

  .achievement-org {
    font-size: 3.2cqw;
  }

  .achievement-flag {
    font-size: 4.2cqw;
  }

  .achievement-cursor {
    width: 1.6cqw;
    height: 4.2cqw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .achievement-item {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .achievement-cursor {
    animation: none;
  }
}
</style>
