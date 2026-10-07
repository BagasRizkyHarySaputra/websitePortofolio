<script setup>
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

import { navigate, useRoute } from '../composables/useRoute'
import writeups from '../data/writeups.json'

// Pre-rendered at build time by scripts/gen-writeups.mjs, so the runtime
// stays dependency-free (no markdown parser shipped to the browser).
const htmlModules = import.meta.glob('../data/writeups/*.html', {
  query: '?raw',
  import: 'default',
  eager: true
})

const htmlFor = (slug) => htmlModules[`../data/writeups/${slug}.html`] || ''

const { route } = useRoute()

const scrollEl = ref(null)
const activeId = ref('')

const currentMeta = () => writeups.find((w) => w.slug === route.value.slug)

const goBack = () => {
  navigate(route.value.name === 'writeup' ? { name: 'writeups' } : { name: 'home' })
}

// The page is its own scroll container (the window is locked), so the
// browser's native `#id` jump does nothing. Intercept in-page anchor clicks
// and scroll the container to the matching heading ourselves.
const onReaderClick = (event) => {
  const target = event.target
  if (!(target instanceof Element)) return

  const link = target.closest('a[href^="#"]')
  if (!link) return

  const id = decodeURIComponent(link.getAttribute('href').slice(1))
  const heading = id ? scrollEl.value?.querySelector(`#${CSS.escape(id)}`) : null
  if (!heading) return

  event.preventDefault()
  heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeId.value = id

  // Keep the address bar shareable without triggering a container-less jump.
  history.replaceState(null, '', `#/writeups/${route.value.slug}`)
}

const stopSpy = () => {
  scrollEl.value?.removeEventListener('scroll', updateActiveHeading)
}

// Highlight the ToC entry for whichever heading last crossed the top of the
// reading band. A scroll-position check is deterministic (unlike
// IntersectionObserver, which reports only *changed* targets per callback).
const updateActiveHeading = () => {
  const container = scrollEl.value
  if (!container || route.value.name !== 'writeup') return

  const band = container.getBoundingClientRect().top + 96
  let current = ''
  for (const heading of container.querySelectorAll('.wu-article :is(h1, h2, h3)[id]')) {
    if (heading.getBoundingClientRect().top <= band) current = heading.id
    else break
  }
  activeId.value = current
}

const startSpy = async () => {
  await nextTick()
  const container = scrollEl.value
  if (!container) return

  stopSpy()
  activeId.value = ''
  if (route.value.name === 'writeup') {
    container.addEventListener('scroll', updateActiveHeading, { passive: true })
    updateActiveHeading()
  }
}

// The ToC markup is injected HTML, not reactive, so mirror the active
// heading id back onto it by hand.
const applyActiveClass = (id) => {
  const container = scrollEl.value
  if (!container) return
  container.querySelectorAll('.wu-toc-link.is-active').forEach((el) => el.classList.remove('is-active'))
  if (!id) return
  container.querySelector(`.wu-toc-link[href="#${CSS.escape(id)}"]`)?.classList.add('is-active')
}

watch(activeId, applyActiveClass)

watch(
  () => [route.value.name, route.value.slug],
  async () => {
    await nextTick()
    scrollEl.value?.scrollTo({ top: 0 })
    startSpy()
  },
  { immediate: true }
)

onBeforeUnmount(stopSpy)
</script>

<template>
  <div ref="scrollEl" class="wu-page" @click="onReaderClick">
    <header class="wu-bar">
      <button class="wu-back" type="button" @click="goBack">
        {{ route.name === 'writeup' ? '← All writeups' : '← Back to site' }}
      </button>

      <span class="wu-bar-title">
        {{ route.name === 'writeup' ? (currentMeta()?.title || 'Writeup') : 'Writeups' }}
      </span>

      <a
        v-if="route.name === 'writeup' && currentMeta()?.source"
        class="wu-bar-source"
        :href="currentMeta().source"
        target="_blank"
        rel="noopener noreferrer"
      >HackMD ↗</a>
      <span v-else class="wu-bar-source wu-bar-source-ghost" aria-hidden="true"></span>
    </header>

    <!-- Index -->
    <div v-if="route.name === 'writeups'" class="wu-index">
      <p class="wu-index-lede">CTF &amp; pwn writeups — mirrored from my HackMD notebooks.</p>

      <ul class="wu-index-list">
        <li v-for="(item, index) in writeups" :key="item.slug" class="wu-index-item">
          <a class="wu-index-card" :href="`#/writeups/${item.slug}`">
            <span class="wu-index-num">{{ String(index + 1).padStart(2, '0') }}</span>
            <span class="wu-index-body">
              <span class="wu-index-title">{{ item.title }}</span>
              <span class="wu-index-meta">
                <span v-for="tag in item.tags" :key="tag" class="wu-tag">{{ tag }}</span>
                <span v-if="item.challenges" class="wu-count">
                  {{ item.challenges }} {{ item.challenges === 1 ? 'challenge' : 'challenges' }}
                </span>
              </span>
              <span class="wu-index-blurb">{{ item.blurb }}</span>
            </span>
            <span class="wu-index-cta" aria-hidden="true">READ →</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- Reader -->
    <div v-else class="wu-reader">
      <div class="wu-layout" v-html="htmlFor(route.slug)"></div>
      <p v-if="!htmlFor(route.slug)" class="wu-missing">
        Writeup not found. <button class="wu-back-inline" type="button" @click="navigate({ name: 'writeups' })">Back to writeups</button>
      </p>
    </div>
  </div>
</template>

<style scoped>
.wu-page {
  position: fixed;
  inset: 0;
  z-index: 40;
  overflow-y: auto;
  overflow-x: hidden;
  background: #05060a;
  color: #ffffff;
  font-family: 'VT323', monospace;
  -webkit-overflow-scrolling: touch;
}

.wu-bar {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem clamp(1rem, 5vw, 4rem);
  background: rgb(5 6 10 / 92%);
  border-bottom: 1px solid rgb(255 255 255 / 18%);
  backdrop-filter: blur(6px);
}

.wu-back,
.wu-back-inline,
.wu-bar-source {
  font-family: 'VT323', monospace;
  font-size: 1.35rem;
  line-height: 1;
  color: #ffffff;
}

.wu-back,
.wu-back-inline {
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  transition: color 0.18s ease;
}

.wu-back:hover,
.wu-back:focus-visible,
.wu-back-inline:hover {
  color: rgb(255 255 255 / 65%);
}

.wu-bar-title {
  font-size: 1.5rem;
  letter-spacing: 0.04em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wu-bar-source {
  text-decoration: none;
  white-space: nowrap;
  transition: color 0.18s ease;
}

.wu-bar-source:hover,
.wu-bar-source:focus-visible {
  color: rgb(255 255 255 / 65%);
}

.wu-bar-source-ghost {
  pointer-events: none;
}

/* Index */
.wu-index {
  max-width: 62rem;
  margin: 0 auto;
  padding: clamp(1.4rem, 4vw, 3rem) clamp(1rem, 5vw, 3rem) 5rem;
}

.wu-index-lede {
  margin: 0 0 1.8rem;
  font-size: 1.35rem;
  color: rgb(255 255 255 / 62%);
}

.wu-index-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.wu-index-card {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.4rem;
  padding: 1.1rem 1.4rem;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 0.5rem;
  background: rgb(255 255 255 / 3%);
  color: inherit;
  text-decoration: none;
  transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease;
}

.wu-index-card:hover,
.wu-index-card:focus-visible {
  border-color: #ffffff;
  background: rgb(255 255 255 / 8%);
  transform: translateX(0.35rem);
}

.wu-index-card:focus-visible {
  outline: 2px solid rgb(255 255 255 / 70%);
  outline-offset: 3px;
}

.wu-index-num {
  font-size: 1.4rem;
  color: rgb(255 255 255 / 45%);
  letter-spacing: 0.08em;
}

.wu-index-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}

.wu-index-title {
  font-size: 1.9rem;
  line-height: 1.05;
}

.wu-index-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.5rem;
}

.wu-tag {
  font-size: 1.05rem;
  padding: 0.05rem 0.5rem;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 0.25rem;
}

.wu-count {
  font-size: 1.05rem;
  color: rgb(255 255 255 / 55%);
}

.wu-index-blurb {
  font-size: 1.15rem;
  line-height: 1.25;
  color: rgb(255 255 255 / 68%);
}

.wu-index-cta {
  font-size: 1.2rem;
  color: rgb(255 255 255 / 55%);
  white-space: nowrap;
  transition: color 0.18s ease;
}

.wu-index-card:hover .wu-index-cta {
  color: #ffffff;
}

/* Reader */
.wu-reader {
  max-width: 78rem;
  margin: 0 auto;
  padding: clamp(1.2rem, 3vw, 2.4rem) clamp(1rem, 5vw, 3rem) 6rem;
}

.wu-layout {
  display: grid;
  grid-template-columns: minmax(190px, 240px) minmax(0, 1fr);
  gap: clamp(1.6rem, 4vw, 4rem);
  align-items: start;
}

.wu-missing {
  margin-top: 2rem;
  font-size: 1.3rem;
  color: rgb(255 255 255 / 70%);
}

/* ToC (generated) */
:deep(.wu-toc) {
  position: sticky;
  top: 5.2rem;
  align-self: start;
  max-height: calc(100vh - 7rem);
  overflow-y: auto;
  padding-right: 0.6rem;
  border-right: 1px solid rgb(255 255 255 / 16%);
}

:deep(.wu-toc-title) {
  margin: 0 0 0.8rem;
  font-size: 1.35rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 60%);
}

:deep(.wu-toc-list) {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

:deep(.wu-toc-item) {
  display: block;
}

:deep(.wu-toc-list .wu-toc-list) {
  margin: 0.2rem 0 0.5rem 0.9rem;
  border-left: 1px solid rgb(255 255 255 / 14%);
  padding-left: 0.8rem;
}

:deep(.wu-toc-link) {
  display: block;
  padding: 0.2rem 0;
  font-size: 1.2rem;
  line-height: 1.15;
  color: rgb(255 255 255 / 58%);
  text-decoration: none;
  transition: color 0.15s ease, padding-left 0.15s ease;
}

:deep(.wu-toc-link:hover),
:deep(.wu-toc-link:focus-visible) {
  color: #ffffff;
  padding-left: 0.25rem;
}

:deep(.wu-toc-link.is-active) {
  color: #ffffff;
}

:deep(.wu-toc-link.is-active::before) {
  content: '▸ ';
}

/* Article (generated) */
:deep(.wu-article) {
  min-width: 0;
  max-width: 74ch;
  font-size: 1.28rem;
  line-height: 1.5;
  color: rgb(255 255 255 / 86%);
}

:deep(.wu-article :is(h1, h2, h3, h4, h5, h6)) {
  scroll-margin-top: 5.2rem;
  color: #ffffff;
  line-height: 1.1;
}

:deep(.wu-article h1) {
  font-size: 2.4rem;
  margin: 0 0 1.2rem;
}

:deep(.wu-article h2) {
  font-size: 2rem;
  margin: 2.6rem 0 1rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid rgb(255 255 255 / 30%);
}

:deep(.wu-article h2::before) {
  content: '';
  display: inline-block;
  width: 0.7rem;
  height: 0.7rem;
  margin-right: 0.6rem;
  background: #ffffff;
  vertical-align: middle;
}

:deep(.wu-article h3) {
  font-size: 1.6rem;
  margin: 1.8rem 0 0.7rem;
}

:deep(.wu-article p) {
  margin: 0 0 1rem;
}

:deep(.wu-article a) {
  color: #ffffff;
  text-decoration: underline;
  text-underline-offset: 0.2em;
  text-decoration-color: rgb(255 255 255 / 45%);
}

:deep(.wu-article a:hover) {
  text-decoration-color: #ffffff;
}

:deep(.wu-article ul),
:deep(.wu-article ol) {
  margin: 0 0 1rem;
  padding-left: 1.6rem;
}

:deep(.wu-article li) {
  margin: 0.25rem 0;
}

:deep(.wu-article blockquote) {
  margin: 0 0 1rem;
  padding: 0.4rem 1rem;
  border-left: 3px solid rgb(255 255 255 / 45%);
  color: rgb(255 255 255 / 72%);
}

:deep(.wu-article hr) {
  border: none;
  border-top: 1px solid rgb(255 255 255 / 22%);
  margin: 2rem 0;
}

:deep(.wu-article code) {
  font-family: 'VT323', monospace;
  font-size: 1.15rem;
  padding: 0.05rem 0.35rem;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 0.25rem;
  background: rgb(255 255 255 / 6%);
}

:deep(.wu-article pre) {
  margin: 0 0 1.2rem;
  padding: 1rem 1.1rem;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 0.5rem;
  background: #0b0d14;
  overflow: auto;
}

:deep(.wu-article pre code) {
  display: block;
  padding: 0;
  border: none;
  background: none;
  font-size: 1.08rem;
  line-height: 1.35;
  white-space: pre;
  color: rgb(255 255 255 / 90%);
}

:deep(.wu-article img) {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 1rem 0 1.4rem;
  border: 1px solid rgb(255 255 255 / 22%);
  border-radius: 0.4rem;
  background: rgb(255 255 255 / 4%);
}

@media (max-width: 820px), (orientation: portrait) {
  .wu-layout {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }

  :deep(.wu-toc) {
    position: static;
    max-height: none;
    overflow: visible;
    border-right: none;
    border-bottom: 1px solid rgb(255 255 255 / 16%);
    padding: 0 0 1rem;
    margin-bottom: 0.6rem;
  }

  .wu-index-card {
    grid-template-columns: auto 1fr;
    row-gap: 0.5rem;
  }

  .wu-index-cta {
    grid-column: 2;
  }

  :deep(.wu-article) {
    font-size: 1.22rem;
  }
}
</style>
