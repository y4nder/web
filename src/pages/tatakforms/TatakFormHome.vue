<template>
  <div class="container mx-auto px-6 h-full flex-grow flex flex-col pt-6">
    <h3 class="font-bold text-2xl mb-4">Tatakform Events</h3>

    <div class="flex flex-col lg:flex-row gap-3 h-full self-stretch flex-grow items-stretch">
      <div class="w-full lg:w-1/3 xl:w-1/5">
        <div
          v-for="ev in events"
          :to="`/tatakforms/event/${ev.slug}`"
          :key="ev.slug"
          class="tatakform"
          role="button"
          @click="selectEvent(ev)"
          :class="{ 'border border-primary border-dashed': selectedEvent?.id === ev.id }"
        >
          <md-ripple />
          <div>
            <h4
              class="font-semibold text-lg text-outline mb-0.5"
              :class="{ 'text-primary': selectedEvent?.id === ev.id }"
            >
              {{ ev.name }}
            </h4>
            <p class="text-xs text-outline">{{ getHumanDate(new Date(ev.from_date)) }} to {{ getHumanDate(new Date(ev.to_date)) }}</p>
          </div>
          <md-icon class="text-outline" v-html="icon('keyboard_arrow_right')" />
        </div>
      </div>
      <div class="flex-grow bg-surface-container-low p-6 rounded-2xl self-stretch">
        <Transition name="slide-fade" mode="out-in">
          <p v-if="selectedEvent === null" class="italic">
            Please select an event to view more details
          </p>
          <div class="flex flex-col justify-between h-full" v-else>
            <div>
              <div class="flex items-center justify-between">
                <h3 class="text-2xl font-bold text-primary">{{ selectedEvent.name }}</h3>
                <p class="text-xs text-outline hidden sm:inline">{{ getHumanDate(new Date(selectedEvent.from_date)) }} to {{ getHumanDate(new Date(selectedEvent.to_date)) }}</p>
              </div>
            </div>

            <div class="flex flex-col items-center gap-4 justify-center mt-2">
              <h5 class="text-base text-outline font-medium self-start lg:self-center">Your attendance</h5>

              <div
                class="flex gap-4 flex-col justify-center items-center w-full"
                v-for="(day, i) in getDatesBetween(selectedEvent.from_date, selectedEvent.to_date)"
              >
                <div class="attendance-container">
                  <div>
                    <h3>Day {{ i + 1 }} - AM</h3>
                    <h5>{{ getHumanDate(day) }}</h5>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="attendance[`day${i + 1}_am`]">{{ getTime(attendance[`day${i + 1}_am`]) }}</span>
                    <span class="text-outline text-xs" v-else>No record</span>
                    <md-icon v-if="attendance[`day${i + 1}_am`]" v-html="icon('verified')" />
                  </div>
                </div>
                <div class="attendance-container">
                  <div>
                    <h3>Day {{ i + 1 }} - PM</h3>
                    <h5>{{ getHumanDate(day) }}</h5>
                  </div>
                  <div>
                    <span v-if="attendance[`day${i + 1}_pm`]">{{ getTime(attendance[`day${i + 1}_pm`]) }}</span>
                    <span class="text-outline text-xs" v-else>No record</span>
                    <md-icon v-if="attendance[`day${i + 1}_pm`]" v-html="icon('verified')" />
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col lg:flex-row justify-end gap-3 mt-5">
              <md-outlined-button @click="generateQrCode">View QR Code</md-outlined-button>
              <md-filled-button @click="downloadTatakForm">Download Tatak Form</md-filled-button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { toast } from 'vue3-toastify';
import { Endpoints, makeRequest } from '~/network/request';
import { useStore, useDialog } from '~/store';
import { icon } from '~/utils/icon';
import { getHumanDate, getDatesBetween, getTime } from "~/utils/date";
import { saveAs } from 'file-saver';
import { Config } from '~/config';
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
const dialog = useDialog();

const errorMessage = ref("");
const events = ref<TatakformModel[]>([]);
const attendance = ref<Record<string, string>>({});
const selectedEvent = ref<TatakformModel | null>(null);

onMounted(() => {
  // Get all tatakform events
  makeRequest<TatakformModel[], null>("GET", Endpoints.Tatakforms, null, response => {
    if (response.success) {
      events.value = response.data
      return;
    }

    errorMessage.value = response.message;
    toast.error(response.message);
  });

  sal();
});

function getAttendance(ev: TatakformModel) {
  store.isLoading = true;

  makeRequest<any, { slug: string }>("GET", Endpoints.TatakformsAttendance, { slug: ev.slug }, response => {
    store.isLoading = false;
    
    if (!response.success) {
      errorMessage.value = response.message;
      toast.error(response.message);
      return;
    }

    attendance.value = response.data !== null ? response.data : {};
    console.log(attendance.value);
  });
}

function downloadTatakForm() {
  if (!selectedEvent.value) {
    toast.error("Please select an event first");
    return;
  }

  toast.info("Downloading your tatakform...");

  makeRequest<any, { slug: string }>("GET", Endpoints.TatakformsAttendanceDownload, { slug: selectedEvent.value.slug }, async (response, config) => {
    if (response instanceof Blob) {
      if (response.size < 1000) {
        toast.error("Error downloading tatakform. Please try again later.");
        return;
      }
      
      // Get the filename from the response headers
      const filename = config?.headers['content-disposition'].split('filename=')[1].replaceAll('"', '') || "tatakform.pdf";
      // Save the file
      return saveAs(response, filename);
    }

    toast.error(response.message);
  });
}

function generateQrCode() {
  const url = `${Config.API_URL}/qrcode?q=CSPS${selectedEvent.value?.slug.toUpperCase()}${store.user.student_id}`;

  const id = dialog.open({
    title: `Your QR Code`,
    message: `
      <img style="height: 300px;" src="${url}&theme=${store.isDark ? 'dark' : 'light'}" />
    `,
    cancel: {
      text: "Close",
      click() {
        dialog.close(id);
      },
    },
    ok: {
      text: "Download",
      click() {
        toast.info("Downloading QR Code...");
        dialog.close(id);

        fetch(`${url}&theme=adaptive`)
          .then(res => res.blob())
          .then(blob => {
            saveAs(blob, `CSPS${selectedEvent.value?.slug.toUpperCase()}${store.user.student_id}.png`);
          })
          .catch(err => {
            console.log(err);
            toast.error("Failed to download QR Code");
          });
      },
    },
  });
}

function selectEvent(ev: TatakformModel) {
  getAttendance(ev);
  selectedEvent.value = ev;
}
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

.tatakform {
  @apply flex justify-between items-center
    rounded-2xl bg-surface-container-low p-5 w-full relative;
}

.attendance-container {
  @apply p-5 rounded-lg bg-surface-container-high w-full xl:w-1/2 2xl:w-1/3 flex justify-between items-center;

  h3 {
    @apply font-medium text-on-surface-variant;
  }

  h5 {
    @apply text-xs text-outline;
  }

  md-icon {
    --md-icon-size: 16px;
    @apply text-primary;
  }
}
</style>
