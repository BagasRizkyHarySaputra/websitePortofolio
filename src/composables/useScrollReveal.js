import { onBeforeUnmount, onMounted } from 'vue'

/**
 * Replays a staggered reveal every time a section is scrolled through, and
 * flips the travel direction so it always feels tied to the scroll:
 *
 *   - entered from below (element was under the viewport) → travels up
 *   - entered from above (element was over the viewport)  → travels down
 *
 * The `activeClass` is added while an element sits inside the viewport and
 * removed once it leaves, so the transition replays on the next pass instead
 * of firing only the first time. The entrance side is derived purely from
 * where the element sits when it leaves, which follows the scroll direction
 * automatically.
 *
 * CSS hooks the caller is expected to style:
 *   .reveal-from-below  → start offset below the resting position (default)
 *   .reveal-from-above  → start offset above the resting position
 *   .is-visible (activeClass) → resting position
 *
 * Elements are staggered in DOM order via the `seqVar` custom property.
 */
export function useScrollReveal(
  rootRef,
  selector,
  {
    activeClass = 'is-visible',
    seqVar = '--reveal-seq',
    stagger = 60,
    threshold = 0.2,
    rootMargin = '0px 0px -10% 0px'
  } = {}
) {
  let observer = null

  onMounted(() => {
    const list = Array.from(rootRef.value?.querySelectorAll(selector) ?? [])
    if (!list.length) return

    list.forEach((el, index) => el.style.setProperty(seqVar, String(index)))

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduced || !('IntersectionObserver' in window)) {
      list.forEach((el) => el.classList.add(activeClass))
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          if (entry.isIntersecting) {
            // The travel side was stamped while the element was hidden; just
            // release it toward its resting position.
            el.classList.add(activeClass)
          } else {
            // Record which side the element now sits on. Re-entering from the
            // top means the page is scrolling up, and vice versa.
            const above = entry.boundingClientRect.top < 0
            el.classList.remove(activeClass)
            el.classList.toggle('reveal-from-above', above)
            el.classList.toggle('reveal-from-below', !above)
          }
        })
      },
      { threshold, rootMargin }
    )

    list.forEach((el) => observer.observe(el))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })
}
