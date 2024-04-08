<template>
  <div
    class="bg-surface-variant dark:bg-surface-container-high flex-grow h-screen w-full -z-[0]"
  >
    <img
      class="object-cover relative h-full w-full opacity-30"
      src="../../assets/img/tatakpics/POSTER-BG.png"
      alt="dawd"
    />
    <div
      class="absolute items-center justify-center flex sm:top-[15%] custom-sm:top-[10%] md:top-[20%] lg:top-[14%] custom-sm:my-[10%] flex-col"
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
            class="lg:w-[30%] lg:h-[15%] md:w-[70%] md:h-[15%] sm:w-[75%] sm:h-[18%] custom-sm:w-[75%] custom-sm:h-[18%] select-none float-anim"
            alt="ICT Congress Graphics"
          />
        </div>
      </div>

      <div
        class="flex flex-col lg:gap-10 md:gap-10 sm:gap-10 custom-sm:gap-8 items-center justify-center tracking-wider"
      >
        <h1
          class="font-semibold lg:text-2xl md:text-2xl sm:text-lg custom-sm:text-base text-center sm:w-[90%] lg:w-[90%] md:w-[90%] custom-sm:w-[90%]"
        >
          Theme:
          <span class="text-primary">
            Championing Divergence Through Fortifying Unity & Camaraderie</span
          >
        </h1>
        <p
          class="lg:w-[45%] md:w-[80%] custom-sm:text-justify sm:w-[80%] custom-sm:w-[90%] lg:text-md md:text-lg sm:text-md custom-sm:text-sm font-normal text-center custom-sm:tracking-wide sm:tracking-widest md:tracking-widest lg:tracking-wider"
        >
          University of Cebu Days is an annual celebration of our academic
          excellence by fostering a spirit of innovation and strengthening our
          sense of unity and camaraderie - this time around, we unite together
          with all the UC campuses!
        </p>

        <p
          class="lg:text-md font-normal lg:tracking-widest md:tracking-widest sm:tracking-wider custom-sm:tracking-wide text-center md:text-lg custom-sm:text-sm sm:text-md custom-sm:w-[80%]"
        >
          This website is developed and managed by
          <span class="font-semibold">
            <router-link to="/about"> CSPS Organization </router-link>
          </span>
        </p>
      </div>
      <div class="flex items-center justify-center gap-5 mt-10">
        <router-link to="/tatakforms/register">
          <md-filled-button
            ><md-icon slot="icon" v-html="icon('campaign', true)" />
            Register</md-filled-button
          >
        </router-link>

        <router-link to="/tatakforms/login">
          <md-filled-button class="px-7">
            <md-icon slot="icon" v-html="icon('login', true)" />
            Login</md-filled-button
          >
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@material/web/button/filled-button";
import graphic from "../../assets/img/tatakpics/UC-DAYS LOGO V2.png";
import VanillaTilt from "vanilla-tilt";
import { icon } from "~/utils/icon";
import "@material/web/icon/icon";
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
