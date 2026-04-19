<script setup>
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

const groupedItems = [
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
    src: group41257,
    text: 'Basic Programming',
    textClass: 'item',
    left: '52.44792%',
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
  },
  {
    src: group39179,
    text: 'Interested in IT and cybersecurity from 10th grade',
    textClass: 'item-small',
    left: '6.71875%',
    top: '29.81481%',
    width: '42.35784%',
    height: '6.68968%'
  },
  {
    src: group41551,
    text: 'Joining CTF Event',
    textClass: 'item',
    left: '6.875%',
    top: '52.68519%',
    width: '42.35784%',
    height: '6.68968%'
  },
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

const smallDecorations = [
  { src: group41705, left: '6.19792%', top: '5.37037%', width: '1.37845%', height: '4.18945%' },
  { src: group41709, left: '50.36458%', top: '5.37037%', width: '1.37845%', height: '4.18945%' },
  { src: group41702, left: '6.19792%', top: '44.62963%', width: '1.37845%', height: '4.18945%' },
  { src: group41701, left: '6.35417%', top: '69.62963%', width: '1.37845%', height: '4.18945%' }
]
</script>

<template>
  <section class="about-me" id="about-me-section">
    <div class="about-me-stage">
      <div v-for="(item, index) in groupedItems" :key="`grouped-${index}`" class="about-item-group" :style="item">
        <img class="about-item-decoration" :src="item.src" alt="" aria-hidden="true" />
        <p class="about-text about-item-label" :class="item.textClass">{{ item.text }}</p>
      </div>

      <img
        v-for="(item, index) in smallDecorations"
        :key="`small-${index}`"
        class="about-decoration"
        :src="item.src"
        alt=""
        aria-hidden="true"
        :style="item"
      />

      <p class="about-text heading heading-background">Background</p>
      <p class="about-text heading heading-advantages">Advantages</p>
      <p class="about-text heading heading-hobbies">Interest &amp; Hobbies</p>
      <p class="about-text heading heading-career">Career Goals</p>

      <p class="about-text glitch">Ȁ̶ͅB̷̭̹̆̅͝O̸̝̞͆̌̽Ű̵̩͕̇̐̐Ţ̶̅͐̏̊ ̸͎̫̝̠͍͒̄͛M̸̧͍̝̜̒͠Ḛ̵̦̉̃̅!̴͖̭̓̏͜͠</p>
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

.about-decoration {
  position: absolute;
}

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

.about-text {
  margin: 0;
  position: absolute;
  font-family: 'VT323', monospace;
  color: #ffffff;
  line-height: 1;
}

.heading {
  font-size: 2.5cqw;
  text-align: justify;
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

.glitch {
  left: 56.97917%;
  top: 68.42593%;
  width: 34.0625%;
  font-size: 3.75cqw;
  text-align: center;
}

.heading-background {
  left: 8.17708%;
  top: 5.27778%;
  width: 13.59375%;
}

.heading-advantages {
  left: 52.44792%;
  top: 5.27778%;
  width: 18.90625%;
}

.heading-hobbies {
  left: 8.17708%;
  top: 44.53704%;
  width: 18.90625%;
}

.heading-career {
  left: 8.4375%;
  top: 69.35185%;
  width: 18.90625%;
}

</style>
