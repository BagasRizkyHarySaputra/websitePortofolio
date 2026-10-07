import { readonly, ref } from 'vue'

// Minimal hash router — the site is a single page plus a full-page writeup
// reader, so a dependency-free router beats pulling in vue-router.
// Routes: '' (home) · '#/writeups' (index) · '#/writeups/<slug>' (reader)
const parse = () => {
  const raw = window.location.hash.replace(/^#\/?/, '')
  if (!raw) return { name: 'home' }

  const [head, slug] = raw.split('/')
  if (head === 'writeups') return slug ? { name: 'writeup', slug } : { name: 'writeups' }

  return { name: 'home' }
}

const route = ref(parse())

window.addEventListener('hashchange', () => {
  route.value = parse()
})

export function useRoute() {
  return { route: readonly(route) }
}

export function navigate(to) {
  if (!to || to.name === 'home') window.location.hash = '#/'
  else if (to.name === 'writeups') window.location.hash = '#/writeups'
  else if (to.name === 'writeup') window.location.hash = `#/writeups/${to.slug}`
}
