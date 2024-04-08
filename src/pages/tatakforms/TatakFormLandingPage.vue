<template>
  <div class="flex-grow w-full">
    <div class="poster" />

    <div class="container mx-auto px-6">
      <div class="flex flex-col justify-center items-center mt-24">
        <div class="flex justify-center" data-sal="zoom-in">
          <img :src="logo" class="w-full sm:w-4/5 md:w max-w-[400px] select-none float-anim px-6 logo" alt="UC Days 2024 Logo"  />
        </div>
  
        <h1 class="text-lg md:text-xl font-bold mt-6 text-primary text-center" data-sal="zoom-in">
          <span class="text-on-surface-variant">Theme: </span>
          <span ref="theme"></span>
        </h1>
        
        <div class="bg-neutral-100/50 dark:bg-neutral-900/90 backdrop-blur-sm p-6 rounded-xl mt-5 w-full sm:w-4/5 md:w-3/4 lg:w-1/2 xl:w-1/3" data-sal="zoom-in">
          <p class="text-center" ref="intro"></p>
        </div>

        <p class="mt-5 flex flex-col md:flex-row items-center" data-sal="zoom-in">
          This website is developed and managed by
          <router-link to="/about">
            <md-text-button>
              UC Main CSP-S Organization
            </md-text-button>
          </router-link>
        </p>

        <div class="flex items-center justify-center gap-4 mt-5">
          <router-link to="/tatakforms/login" data-sal="slide-left">
            <md-outlined-button class="px-7">
              <md-icon slot="icon" v-html="icon('login', true)" />
              Login
            </md-outlined-button>
          </router-link>

          <router-link to="/tatakforms/register" data-sal="slide-right">
            <md-filled-button>
              <md-icon slot="icon" v-html="icon('campaign', true)" />
              Register
            </md-filled-button>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@material/web/button/text-button";
import "@material/web/button/filled-button";
import "@material/web/button/outlined-button";
import "@material/web/icon/icon";

import { icon } from "~/utils/icon";
import { ref, onMounted } from "vue";

import logo from "~/assets/img/tatakform/ucdays-logo.png";
import VanillaTilt from "vanilla-tilt";
import Typed from "typed.js";
import sal from "sal.js";

const intro = ref();
const theme = ref();
const message = `
  University of Cebu Days is an annual celebration of our academic
  excellence by fostering a spirit of innovation and strengthening our
  sense of unity and camaraderie - this time around, we unite together
  with all the UC campuses!
`;

let instance: Typed | undefined;

onMounted(() => {
  // Bind fancybox
  setTimeout(() => {
    // Bind tilting effect
    for (const image of document.querySelectorAll(".logo")) {
      VanillaTilt.init(image as HTMLElement, {
        reverse: true,
        reset: true,
        "full-page-listening": true,
        perspective: 500,
      });
    }

    // Start sal.js animation
    sal();
    startTyped();
  }, 0);
});

function startTyped() {
  if (instance) {
    instance.destroy();
  }

  instance = new Typed(theme.value, {
    strings: [ "Championing Divergence Through Fortifying Unity & Camaraderie" ],
    typeSpeed: 20,
    showCursor: false,
    onComplete() {
      new Typed(intro.value, {
        strings: [ message ],
        typeSpeed: 20,
        startDelay: 500,
        showCursor: false,
      });
    }
  });
}
</script>

<style lang="scss">
.poster {
  @apply object-cover h-screen w-full select-none opacity-30 dark:opacity-10 absolute -z-[1];
  background-image: url("~/assets/img/tatakform/ucdays-poster.png");
  background-size: cover;
  -webkit-user-drag: none;
  box-shadow: inset 0 0 70px 50px var(--md-sys-color-surface-container-high);
}

html.dark .poster {
  box-shadow: inset 0 0 100px 80px var(--md-sys-color-surface);
}
</style>
