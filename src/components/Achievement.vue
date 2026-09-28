<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

const achievements = [
  { rank: '2nd Place', name: 'SCTF 2026', org: 'DCSC' },
  { rank: '2nd Place', name: 'WRECKIT7.0 Junior CTF 2026', org: '' },
  { rank: 'Best Writeup', name: 'WRECKIT7.0 Junior CTF 2026', org: 'BSSN' },
  { rank: '1st Place', name: 'CYBREAK 2026', org: 'ITS' }
]

const rootEl = ref(null)
let observer = null

onMounted(() => {
  const items = rootEl.value?.querySelectorAll('.achievement-item') ?? []

  const revealAll = () => {
    items.forEach((el) => el.classList.add('is-in'))
  }

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
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      })
    },
    { threshold: 0.25 }
  )

  items.forEach((el) => observer.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
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
          <span class="achievement-rank">{{ item.rank }}</span>
          <span class="achievement-body">
            <span class="achievement-name">{{ item.name }}</span>
            <span v-if="item.org" class="achievement-org">· {{ item.org }}</span>
          </span>
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
  background: #000000;
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
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 2.4cqw;
  padding-bottom: 1.6cqw;
  border-bottom: 0.15625cqw solid rgb(255 255 255 / 32%);

  opacity: 0;
  transform: translateY(1.6cqw);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: calc(var(--ach-index, 0) * 70ms);
}

.achievement-item.is-in {
  opacity: 1;
  transform: none;
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
  grid-template-columns: 1fr;
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
    inset: auto;
    left: 50%;
    top: 50%;
    height: 100%;
    width: auto;
    max-width: 100%;
    aspect-ratio: 1211 / 2631;
    transform: translate(-50%, -50%);
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
