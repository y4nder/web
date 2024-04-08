<template>
  <div
    class="bg-surface-variant dark:bg-surface-container-high flex-grow h-full w-full -z-[0] absolute"
  >
    <img
      class="object-cover relative h-full w-full opacity-30"
      src="../../assets/img/tatakpics/POSTER-BG.png"
      alt="dawd"
    />
    <div
      class="absolute items-center justify-center flex lg:top-28 sm:top-5 custom-sm:top-[3%] md:top-[15%] custom-sm:my-[10%] flex-col"
    >
      <div
        class="flex justify-center items-center graphic"
        data-sal="zoom-in"
        data-sal-repeat
      >
        <div class="flex justify-center rounded-3xl graphic">
          <div class="absolute gradient rounded-3xl" />
          <img
            :src="graphic"
            class="lg:w-[25%] lg:h-[15%] md:w-[50%] md:h-[15%] sm:w-[10%] sm:h-[13%] custom-sm:w-[75%] custom-sm:h-[18%] select-none float-anim"
            alt="ICT Congress Graphics"
          />
        </div>
      </div>

      <div
        class="flex flex-col gap-10 items-center justify-center tracking-wide"
      >
        <h1
          class="font-bold lg:text-xl md:text-xl sm:text-lg custom-sm:text-lg text-center sm:w-[40%] md:w-[80%] custom-sm:w-[90%]"
        >
          Theme: Championing Divergence Through Fortifying Unity & Camaraderie
        </h1>
        <p
          class="lg:w-[40%] md:w-[70%] sm:w-[40%] custom-sm:w-[80%] lg:text-md md:text-md sm:text-md custom-sm:text-sm font-medium text-center tracking-widest"
        >
          University of Cebu Days is an annual celebration of our academic
          excellence by fostering a spirit of innovation and strengthening our
          sense of unity and camaraderie - this time around, we unite together
          with all the UC campuses!
        </p>

        <p
          class="lg:text-md font-medium tracking-wider text-center md:text-md custom-sm:text-sm sm:text-sm custom-sm:w-[80%]"
        >
          This website is developed and managed by
          <span class="font-bold">CSPS Organization</span>
        </p>
      </div>
      <div class="flex items-center justify-center gap-2 mt-10">
        <router-link to="/tatakforms/register">
          <md-filled-button>Register</md-filled-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@material/web/button/filled-button";
import graphic from "../../assets/img/tatakpics/UC-DAYS LOGO V2.png";
import VanillaTilt from "vanilla-tilt";
import { onMounted } from "vue";
import sal from "sal.js";

onMounted(() => {
  // Bind fancybox
  setTimeout(() => {
    // Bind tilting effect
    for (const image of document.querySelectorAll(".graphic")) {
      VanillaTilt.init(image as HTMLElement, {
        reverse: true,
        reset: true,
        perspective: 500,
      });
    }

    // Start sal.js animation
    sal();
  }, 0);
});
</script>

<style lang="scss" scoped></style>
