<script setup>
import { ref } from 'vue'

import { useScrollReveal } from '../composables/useScrollReveal'
import writeups from '../data/writeups.json'

const rootEl = ref(null)

// Same replaying, direction-aware reveal the other sections use.
useScrollReveal(rootEl, '.writeups-item', {
  activeClass: 'is-in',
  seqVar: '--wu-index',
  stagger: 70,
  threshold: 0.2
})
</script>

<template>
  <section ref="rootEl" class="writeups" id="writeups-section">
    <div class="writeups-stage">
      <div class="writeups-badge" aria-hidden="true"></div>
      <p class="writeups-title">Writeup</p>
      <div class="writeups-rule" aria-hidden="true"></div>

      <div class="writeups-panel">
        <ul class="writeups-list">
          <li
            v-for="(item, index) in writeups"
            :key="item.slug"
            class="writeups-item"
            :style="{ '--wu-index': index }"
          >
          <article class="writeups-card">
            <a class="writeups-card-link" :href="`#/writeups/${item.slug}`">
              <span class="writeups-card-index">{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="writeups-card-title">{{ item.title }}</span>

              <span class="writeups-card-meta">
                <span
                  v-for="tag in item.tags"
                  :key="`${item.slug}-${tag}`"
                  class="writeups-tag"
                >{{ tag }}</span>
                <span v-if="item.challenges" class="writeups-count">
                  {{ item.challenges }} {{ item.challenges === 1 ? 'challenge' : 'challenges' }}
                </span>
              </span>

              <span class="writeups-card-blurb">{{ item.blurb }}</span>
            </a>

            <span class="writeups-card-foot">
              <a class="writeups-card-cta" :href="`#/writeups/${item.slug}`">READ →</a>
              <a
                class="writeups-card-source"
                :href="item.source"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`Open ${item.title} on HackMD`"
              >HackMD ↗</a>
            </span>
          </article>
        </li>
      </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.writeups {
  width: 100vw;
  height: 100vh;
  background: transparent;
  position: relative;
  overflow: hidden;
}

.writeups-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.writeups-title,
.writeups-card-index,
.writeups-card-title,
.writeups-tag,
.writeups-count,
.writeups-card-blurb,
.writeups-card-cta,
.writeups-card-source {
  margin: 0;
  font-family: 'VT323', monospace;
  line-height: 1;
}

.writeups-badge {
  position: absolute;
  left: 10%;
  top: 6.66667%;
  width: 30.02083%;
  height: 9.07407%;
  background: #ffffff;
}

.writeups-title {
  position: absolute;
  left: 10%;
  top: calc(11.2037% - 1.875cqw);
  width: 30.02083%;
  font-size: 3.75cqw;
  text-align: center;
  color: #000000;
}

.writeups-rule {
  position: absolute;
  left: 10%;
  top: 19.81481%;
  width: 80%;
  border-top: 0.15625cqw solid #ffffff;
}

.writeups-panel {
  position: absolute;
  left: 10%;
  top: 24.07407%;
  width: 80%;
}

.writeups-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-auto-rows: auto;
  gap: 1.3cqw;
}

.writeups-item {
  display: flex;

  opacity: 0;
  transform: translateY(1.2cqw);
  transition: opacity 0.45s ease, transform 0.45s ease;
  transition-delay: calc(var(--wu-index, 0) * 70ms);
}

.writeups-item.reveal-from-above {
  transform: translateY(-1.2cqw);
}

.writeups-item.is-in {
  opacity: 1;
  transform: none;
}

.writeups-card {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0.85cqw 1.05cqw;
  border: 0.15625cqw solid rgb(255 255 255 / 28%);
  border-radius: 0.5cqw;
  background: rgb(255 255 255 / 3%);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.writeups-card:hover,
.writeups-card:focus-within {
  border-color: #ffffff;
  background: rgb(255 255 255 / 8%);
}

.writeups-card-link {
  display: flex;
  flex-direction: column;
  gap: 0.35cqw;
  flex: 1;
  min-height: 0;
  color: inherit;
  text-decoration: none;
  border-radius: 0.3cqw;
}

.writeups-card-link:focus-visible {
  outline: 0.2cqw solid rgb(255 255 255 / 70%);
  outline-offset: 0.5cqw;
}

.writeups-card-index {
  font-size: 1cqw;
  color: rgb(255 255 255 / 45%);
  letter-spacing: 0.08em;
}

.writeups-card-title {
  font-size: 1.6cqw;
  color: #ffffff;
}

.writeups-card-link:hover .writeups-card-title {
  text-decoration: underline;
  text-underline-offset: 0.4cqw;
}

.writeups-card-meta {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.4cqw;
}

.writeups-tag {
  font-size: 0.92cqw;
  color: #ffffff;
  border: 0.15625cqw solid rgb(255 255 255 / 40%);
  border-radius: 0.3cqw;
  padding: 0.12cqw 0.5cqw;
  text-transform: lowercase;
}

.writeups-count {
  font-size: 0.92cqw;
  color: rgb(255 255 255 / 55%);
}

.writeups-card-blurb {
  font-size: 0.95cqw;
  line-height: 1.15;
  color: rgb(255 255 255 / 70%);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.writeups-card-cta {
  font-size: 1.05cqw;
  color: rgb(255 255 255 / 60%);
  text-decoration: none;
  transition: color 0.2s ease, transform 0.2s ease;
}

.writeups-card-link:hover .writeups-card-cta {
  color: #ffffff;
  transform: translateX(0.4cqw);
}

.writeups-card-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5cqw;
  margin-top: auto;
  padding-top: 0.45cqw;
}

.writeups-card-source {
  font-size: 0.92cqw;
  color: rgb(255 255 255 / 55%);
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.2s ease;
}

.writeups-card-source:hover,
.writeups-card-source:focus-visible {
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 0.3cqw;
}

@media (orientation: portrait) {
  /* Let the section grow so four stacked cards are never clipped. */
  .writeups {
    height: auto;
    min-height: 100vh;
    overflow: visible;
  }

  .writeups-stage {
    position: relative;
    inset: auto;
    width: 100%;
    height: auto;
    padding: 9vh 0 7vh;
    /* size containment would collapse this auto-height box to its padding,
       so switch to inline-size containment: cqw still resolves, but the
       stage now grows to fit the stacked cards and drives real scroll. */
    container-type: inline-size;
  }

  .writeups-badge {
    left: 9.66144%;
    top: 9vh;
    width: 55%;
    height: 3.72482%;
  }

  .writeups-title {
    left: 9.66144%;
    top: calc(9vh + 1.9vh);
    width: 55%;
    font-size: 5.4cqw;
    text-align: left;
  }

  .writeups-rule {
    left: 9.66144%;
    top: calc(9vh + 7vh);
    width: 80.67713%;
    border-top-width: 0.2cqw;
  }

  .writeups-panel {
    position: relative;
    left: auto;
    top: auto;
    width: 80.67713%;
    margin: 15vh auto 0;
  }

  .writeups-list {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    gap: 3.2cqw;
  }

  .writeups-card {
    padding: 3.4cqw 4cqw;
    border-width: 0.2cqw;
  }

  .writeups-card-link {
    gap: 1.8cqw;
  }

  .writeups-card-index {
    font-size: 3.2cqw;
  }

  .writeups-card-title {
    font-size: 5.2cqw;
  }

  .writeups-tag,
  .writeups-count {
    font-size: 3cqw;
  }

  .writeups-card-blurb {
    font-size: 3.3cqw;
  }

  .writeups-card-cta {
    font-size: 3.4cqw;
  }

  .writeups-card-foot {
    gap: 2cqw;
    padding-top: 1.6cqw;
  }

  .writeups-card-source {
    font-size: 3cqw;
  }
}

@media (prefers-reduced-motion: reduce) {
  .writeups-item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
