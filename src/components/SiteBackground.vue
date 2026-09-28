<script setup>
// Ambient, fixed backdrop for the whole site. It turns the plain black canvas
// into a subtle CRT / terminal screen: a faint drifting grid, a soft top glow,
// horizontal scanlines, a slow sweeping highlight, and a vignette. Everything
// here is decorative and sits behind the page content.
</script>

<template>
  <div class="site-bg" aria-hidden="true">
    <div class="site-bg-grid"></div>
    <div class="site-bg-glow"></div>
    <div class="site-bg-scan"></div>
    <div class="site-bg-sweep"></div>
    <div class="site-bg-vignette"></div>
  </div>
</template>

<style scoped>
.site-bg {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
  background:
    radial-gradient(85% 60% at 50% -12%, rgb(120 190 255 / 9%), transparent 68%),
    linear-gradient(180deg, #070910 0%, #05060a 45%, #06080f 100%);
}

/* Faint technical grid that slowly drifts, like a terminal backdrop. */
.site-bg-grid {
  position: absolute;
  inset: -12%;
  background-image:
    linear-gradient(to right, rgb(255 255 255 / 8%) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 8%) 1px, transparent 1px);
  background-size: 46px 46px;
  mask-image: radial-gradient(120% 100% at 50% 40%, #000 42%, transparent 88%);
  animation: bg-drift 46s linear infinite;
}

@keyframes bg-drift {
  to {
    transform: translate3d(46px, 46px, 0);
  }
}

/* Soft pools of light so the page never reads as flat black. */
.site-bg-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(42% 34% at 80% 10%, rgb(150 200 255 / 13%), transparent 70%),
    radial-gradient(38% 30% at 10% 90%, rgb(120 190 255 / 11%), transparent 72%),
    radial-gradient(55% 40% at 50% 48%, rgb(150 190 255 / 6%), transparent 75%);
}

/* Fine horizontal scanlines for the CRT feel. */
.site-bg-scan {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    rgb(255 255 255 / 5%) 0 1px,
    transparent 1px 3px
  );
  opacity: 0.85;
}

/* A single slow highlight drifting down the screen. */
.site-bg-sweep {
  position: absolute;
  left: 0;
  right: 0;
  top: -30%;
  height: 30%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(160 210 255 / 6%),
    transparent
  );
  animation: bg-sweep 12s linear infinite;
}

@keyframes bg-sweep {
  to {
    transform: translateY(430%);
  }
}

/* Darken the corners to draw the eye toward the centre. */
.site-bg-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(128% 98% at 50% 45%, transparent 55%, rgb(0 0 0 / 70%) 100%);
}

@media (prefers-reduced-motion: reduce) {
  .site-bg-grid,
  .site-bg-sweep {
    animation: none;
  }
}
</style>
