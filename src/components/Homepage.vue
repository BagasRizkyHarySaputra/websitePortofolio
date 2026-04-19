<script setup>
import profileImage from "../assets/homepage-profile.png"
</script>

<template>
  <section class="homepage">
    <div class="homepage-stage">
      <div class="profile-backdrop" aria-hidden="true"></div>
      <img class="profile-image" :src="profileImage" alt="Bagas profile" />

      <h1 class="profile-name">Bagas Rizky Hary Saputra</h1>
      <p class="profile-role">cyber security Enthusiast</p>
      <div class="profile-divider" aria-hidden="true"></div>

      <p class="profile-description">
        <span class="profile-description-strong">Hi, my name is</span>
        <span>
          Bagas Rizky Hary Saputra, also known as “debugging”. I’m 16 years old and passionate about cybersecurity. I
          have participated in several Capture The Flag (CTF) competitions, with a focus on binary exploitation. I
          enjoy analyzing binaries, finding vulnerabilities, and developing exploits. I also practice through
          platforms like TryHackMe and use tools such as GDB and other debugging tools.
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.homepage {
  width: 100vw;
  height: 100vh;
  background: #000000;
  position: relative;
  overflow: hidden;
}

.homepage-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  container-type: size;
}

.profile-backdrop {
  position: absolute;
  left: 10.15625%;
  top: 16.2963%;
  width: 19.01042%;
  height: 39.62963%;
  background: transparent;
  border: 0.12cqw solid #d9d9d9;
}

.profile-image {
  position: absolute;
  left: 7.65625%;
  top: 11.2037%;
  width: 20.83333%;
  height: 43.51852%;
  object-fit: cover;
}

.profile-name,
.profile-role,
.profile-description {
  margin: 0;
  position: absolute;
  font-family: 'VT323', monospace;
  color: #ffffff;
}

.profile-name {
  left: 31.51042%;
  top: 19.07407%;
  width: 52%;
  height: 7.96296%;
  font-size: 4.47917cqw;
  line-height: 1;
  white-space: nowrap;
}

.profile-role {
  left: 31.71875%;
  top: 28.24074%;
  width: 29.21875%;
  height: 5.18519%;
  font-size: 2.91667cqw;
  line-height: 1;
}

.profile-divider {
  position: absolute;
  left: 31.61456%;
  top: 27.91953%;
  width: 31.61462%;
  border-top: 0.12cqw solid #ffffff;
}

.profile-description {
  left: 10.15625%;
  top: 58.14815%;
  width: 84.21875%;
  height: 30.64815%;
  font-size: 2.5cqw;
  line-height: 1.05;
  text-align: justify;
  color: rgb(255 255 255 / 44%);
}

.profile-description-strong {
  color: #ffffff;
}
</style>
