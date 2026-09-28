<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const pupilX = ref(0)
const pupilY = ref(0)
const MAX_OFFSET = 8

const moveEye = (e) => {
  // Find the centre of the screen (works wherever the logo is placed)
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  // Map the mouse position to a ratio from the centre (-1 to 1)
  const ratioX = (e.clientX - centerX) / centerX
  const ratioY = (e.clientY - centerY) / centerY
  
  // Apply the new position, clamped by a max offset so pupils stay inside
  pupilX.value = ratioX * MAX_OFFSET
  pupilY.value = ratioY * MAX_OFFSET
}

onMounted(() => {
  window.addEventListener('mousemove', moveEye)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', moveEye)
})
</script>

<template>
  <div class="logo-container">
    <div class="eyes-container">
      <pre class="ascii-art">
NO!                          MNO!
       MNO!!                        MNNOO!
      MMNO!                         MNNOO!!
     MNOONNOO!   MMMMMMMMMMMMPPPOII@   MNNO!!!!
     !O! NNO! MMMMMMMMMMMMMMPPPPOOOOII!! NO!
         ! MMMMMMMMMMMMMPPPPPOOOOIII! !
          MMMMMMMMMMMMPPPPPOOOOOOII!!
          MMMMMOOOOOOPPPPPPPPPOOOOMII!
          MMMM..      OPPMMP      .,OMI!
          MMMM::    <span class="pupil" :style="{ transform: `translate(${pupilX}px, ${pupilY}px)` }">o</span>.,OPMP,.<span class="pupil" :style="{ transform: `translate(${pupilX}px, ${pupilY}px)` }">o</span>    ::I!!
            NNM:::.,,OOPM!P,.::::!!
            MMNNNNNOOOOPMO!!IIPPO!!O!
            MMMMMNNNNOO:!!:!!IPPPPOO!
             MMMMMNNNOOMMNNIIIPPPOO!!
               MMMONNMMNNNIIIOO!
              MN MOMMMNNNIIIIIO!OOO
              MNO! iiiiiiiiiiiI OOOO
          MNNNNO!      PPPPPPPPPP      MMNON!
           OO!                          ON!
      </pre>
    </div>
  </div>
</template>

<style scoped>
.logo-container {
  display: block;
  width: 100%;
  height: 100%;
  background-color: transparent;
}

.eyes-container {
  width: 100%;
  height: 100%;
  user-select: none;
}

.ascii-art {
  font-family: 'VT323', monospace;
  font-size: 1em;
  line-height: 1;
  margin: 0;
  color: #c4c4c4;
  white-space: pre;
  /* Shrink the block to the picture's own width and centre it, so the cat
     stays optically centred even when the container is wider than the art
     (e.g. tall / portrait-ish windows where left-aligning shifted it). */
  width: max-content;
  margin-inline: auto;
}

.pupil {
  display: inline-block;
  transition: transform 0.05s ease-out;
  color: #ffffff;
  text-shadow: 
    0 0 0.2vw #ffffff, 
    0 0 0.5vw #ffffff, 
    0 0 1vw #ffffff, 
    0 0 2vw #ffffff, 
    0 0 4vw #ffffff, 
    0 0 6vw #ffffff;
}


</style>