<template>
  <div class="container mx-auto px-7 flex flex-col justify-center items-center gap-3">

    <div class="flex justify-center w-full lg:w-2/3 xl:w-1/2">
      <div class="flex flex-col justify-center items-center w-full">
        <!-- Top -->
        <div class="flex flex-col lg:flex-row lg:justify-center items-center lg:gap-5">
          <div>
            <md-icon class="profile-icon" v-html="icon('account_circle')" />
          </div>
          <div>
            <h4 class="headline-medium font-semibold text-center text-on-surface-variant">
              {{ store.user.first_name }} {{ store.user.last_name }}
            </h4>
            <p class="text-outline text-center lg:text-start">{{ store.user.email_address }}</p>
          </div>
          <div class="lg:ml-12">
            <md-outlined-button class="mt-3 lg:mt-0">View Profile</md-outlined-button>
          </div>
        </div>

        <!-- Tabs -->
        <md-tabs :activeTabIndex="selectedTab" class="mt-5">
          <md-secondary-tab title="Events" @click="selectedTab = 0">
            Events
          </md-secondary-tab>
          <md-secondary-tab title="History" @click="selectedTab = 1">
            History
          </md-secondary-tab>
        </md-tabs>

        <div class="w-full border-t border-outline-variant -translate-y-[1px]">
          <Transition name="slide-fade" mode="out-in">
            <!-- Events -->
            <div v-if="selectedTab == 0">

              <div class="grid grid-cols-2 mt-3">
                <div v-for="ev in events" :key="ev.slug"
                  class="flex justify-between items-center rounded-lg border border-outline-variant p-4 w-full">
                  <div class="flex-grow flex items-center gap-5">
                    <div>
                      <md-icon class="text-primary" v-html="icon('campaign')" />
                    </div>
                    <div>
                      <h4 class="font-semibold text-lg text-primary">{{ ev.name }}</h4>
                      <p class="text-sm text-outline">{{ getHumanDate(new Date(ev.from_date)) }} to {{ getHumanDate(new
              Date(ev.to_date)) }}</p>
                    </div>
                  </div>
                  <router-link :to="`/tatakforms/event/${ev.slug}`">
                    <md-outlined-button>
                      Select
                    </md-outlined-button>
                  </router-link>
                </div>
              </div>
            </div>
            <!-- History -->
            <div v-else-if="selectedTab == 1">
              <div v-for="history in attendanceHistory">
                <p class="font-semibold">UC DAYS 2024 - ATTENDANCE</p>
                <p class="text-outline text-xs lg:text-sm">{{ getReadableDate(history) }}</p>
                <md-divider inset-end class="my-3"></md-divider>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { Endpoints, makeRequest } from '~/network/request';
import { useStore } from '~/store';
import { icon } from '~/utils/icon';
import { getReadableDate, getHumanDate } from "~/utils/date";
import sal from "sal.js";

import "@material/web/textfield/filled-text-field";
import "@material/web/button/text-button";
import "@material/web/button/filled-tonal-button";
import "@material/web/button/outlined-button";
import "@material/web/button/filled-button";
import "@material/web/icon/icon";
import "@material/web/tabs/tabs";
import "@material/web/ripple/ripple";
import "@material/web/tabs/secondary-tab";

const store = useStore();

const selectedTab = ref(0);
const errorMessage = ref("");
const attendanceHistory = ref<any[]>([])
const events = ref<TatakformModel[]>([])

onMounted(() => {
  makeRequest<any, null>("GET", Endpoints.TatakformsAttendanceHistoryOfEvent, null, response => {
    if (response.success) {
      if (response.data[1] > 0) {
        const dataObj = response.data[0][0];

        Object.keys(dataObj).forEach(key => {
          if (dataObj[key]) {
            const data = dataObj[key].toString().split(" ")
            if (data.length > 1) {
              attendanceHistory.value.push(dataObj[key])
            }
          }
        })
      }
      return;
    }

    errorMessage.value = response.message;
    toast.error(response.message);
  });

  // Get all tatakform events
  makeRequest<TatakformModel[], null>("GET", Endpoints.Tatakforms, null, response => {
    if (response.success) {
      console.log(response.data)
      events.value = response.data
      return;
    }

    errorMessage.value = response.message;
    toast.error(response.message);
  });

  sal();
});

</script>


<style lang="scss" scoped>
.event {
  @apply flex flex-col justify-between relative bg-surface-container-low rounded-xl;
  animation: glow 1.5s ease-in-out infinite alternate;

  .foreground {
    @apply bg-surface-container-high rounded-xl;
  }

  .content {
    @apply font-medium rounded-2xl min-w-80;
  }
}

.profile-icon {
  --md-icon-size: 72px;
  @apply text-on-surface-variant;
}

md-tabs {
  --md-secondary-tab-container-color: transparent;
  --md-secondary-tab-container-shape: 8px;

  &::part(divider) {
    @apply hidden;
  }
}
</style>