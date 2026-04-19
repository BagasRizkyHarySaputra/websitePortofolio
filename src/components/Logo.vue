<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const pupilX = ref(0)
const pupilY = ref(0)
const MAX_OFFSET = 8

const moveEye = (e) => {
  // Mencari titik tengah layar (berlaku di manapun logo diletakkan)
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  
  // Menghitung rasio posisi mouse dari titik tengah (-1 sampai 1)
  const ratioX = (e.clientX - centerX) / centerX
  const ratioY = (e.clientY - centerY) / centerY
  
  // Menerapkan posisi baru (tambah batas maksimal supaya tidak keluar dari kurung)
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