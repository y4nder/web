<template>
  <div class="container mx-auto px-6">
    <Transition name="slide-fade" mode="out-in">
      <div v-if="errorMessage.length === 0" class="flex flex-col items-center justify-center pb-5">
        <div class="flex flex-col space-y-5 w-full sm:w-3/4 lg:w-7/12 2xl:w-1/3 font-reset bg-surface-container p-6 lg:p-8 rounded-2xl">
          <div class="text-center mb-1" data-sal="slide-right" data-sal-repeat>
            <h4 class="mb-1 text-lg lg:text-2xl font-bold"><span class="text-primary">Tatakforms</span> Registration</h4>
            <p class="text-outline">You are registering for {{ college?.name }}</p>
          </div>
  
          <!-- Student ID -->
          <md-filled-text-field
            data-sal="zoom-in"
            data-sal-repeat
            v-model.trim="studentId"
            maxLength="8"
            type="number"
            label="Student ID"
            min="0"
            oninput="this.value = this.value.slice(0, 8)"
            :disabled="store.isLoading || isRegistered"
          >
            <md-icon slot="leading-icon" v-html="icon('badge', true)" />
          </md-filled-text-field>
  
          <!-- First and Last name -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5 !mt-1">
            <md-filled-text-field data-sal="slide-right" data-sal-repeat v-model.trim="firstName" label="First name" :disabled="store.isLoading || isRegistered">
              <md-icon slot="leading-icon" v-html="icon('person', true)" />
            </md-filled-text-field> 
            <md-filled-text-field data-sal="slide-left" data-sal-repeat v-model.trim="lastName" label="Last name" :disabled="store.isLoading || isRegistered">
              <md-icon slot="leading-icon" v-html="icon('person', true)" />
            </md-filled-text-field> 
          </div>

          <!-- Course and Year level -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <md-filled-select data-sal="slide-right" data-sal-repeat v-model="course" label="Course" :disabled="store.isLoading || isRegistered">
              <md-icon slot="leading-icon" v-html="icon('school', true)" />
              <md-select-option v-for="course in college?.courses" :key="course.id" :value="course.id">
                {{ course.acronym }}
              </md-select-option>
            </md-filled-select>
            <md-filled-select data-sal="slide-left" data-sal-repeat v-model="yearLevel" label="Year level" :disabled="store.isLoading || isRegistered">
              <md-icon slot="leading-icon" v-html="icon('school', true)" />
              <md-select-option v-for="year in 4" :key="year" :value="year">
                {{ mapYearLevel(year) }}
              </md-select-option>
            </md-filled-select>
          </div>
      
          <!-- Email -->
          <md-filled-text-field
            data-sal="zoom-in"
            data-sal-repeat
            v-model.trim="email"
            type="email"
            label="Email"
            :disabled="store.isLoading || isRegistered"
            supportingText="Make sure to use your valid email address."
          >
            <md-icon slot="leading-icon" v-html="icon('mail', true)" />
          </md-filled-text-field>

          <div class="flex gap-5">
            <!-- Password -->
            <md-filled-text-field
              data-sal="zoom-in"
              data-sal-repeat
              v-model.trim="password"
              type="password"
              label="Password"
              :disabled="store.isLoading || isRegistered"
            >
              <md-icon slot="leading-icon" v-html="icon('lock', true)" />
            </md-filled-text-field>
  
            <!-- Confirm Password -->
            <md-filled-text-field
              data-sal="zoom-in"
              data-sal-repeat
              v-model.trim="confirmPassword"
              type="password"
              label="Confirm Password"
              :disabled="store.isLoading || isRegistered"
            >
              <md-icon slot="leading-icon" v-html="icon('lock', true)" />
            </md-filled-text-field>
          </div>

          <p class="text-on-surface-variant text-xs">
            Note: Once created, your account will be used for all Tatakforms events!
          </p>
  
          <!-- Register -->
          <div class="flex justify-end gap-3" data-sal="zoom-in" data-sal-repeat>
            <md-filled-tonal-button v-if="isRegistered" @click="clearFields">Reset fields</md-filled-tonal-button>
            <md-filled-button @click="register" :disabled="isRegistered || store.isLoading">
              {{ store.isLoading ? "Registering..." : isRegistered ? 'Registered' : "Confirm details" }}
            </md-filled-button>
          </div>
        </div>
      </div>
      <div v-else class="error flex justify-center items-center">
        <div class="bg-error rounded-[28px] text-on-error p-6">
          {{ errorMessage }}

          <div class="flex justify-center items-center mt-3">
            <router-link to="/tatakforms">
              <md-text-button>
                <md-icon v-html="icon('arrow_back')" slot="icon" />
                Go back
              </md-text-button>
            </router-link>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { isEmail } from '~/utils/string';
import { Endpoints, makeRequest } from '~/network/request';
import { mapYearLevel } from '~/utils/page';
import { useStore, useDialog } from '~/store';
import { icon } from '~/utils/icon';
import sal from "sal.js";

import "@material/web/textfield/filled-text-field";
import "@material/web/button/text-button";
import "@material/web/button/filled-tonal-button";
import "@material/web/button/filled-button";
import "@material/web/select/filled-select";
import "@material/web/select/select-option";
import "@material/web/icon/icon";

const studentId = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const course = ref();
const yearLevel = ref();

const college = ref<CollegeModel>();
const dialog = useDialog();
const store = useStore();
const route = useRoute();
const router = useRouter();

const isLoggingIn = ref(false);
const isRegistered = ref(false);
const isFetchingCourses = ref(true);

const errorMessage = ref("");

watch([isFetchingCourses], ([fetchingCourses]) => {
  store.isLoading = fetchingCourses;
});

onMounted(() => {
  store.isLoading = false;

  makeRequest<CollegeModel, { acronym: string }>("GET", Endpoints.CollegeCourses, { acronym: route.params.college as string }, response => {
    isFetchingCourses.value = false;

    if (response.success) {
      college.value = response.data;
      return;
    }

    errorMessage.value = response.message;
    toast.error(response.message);
  });

  sal();
});

function register() {
  // If one of the fields is empty, show a toast message
  if (!studentId.value || !firstName.value || !lastName.value || !email.value ||
    !college.value || !course.value || !yearLevel.value || !password.value || !confirmPassword.value) {
    toast.error("Please fill up all fields.");
    return;
  }

  if (!isEmail(email.value)) {
    toast.error("Invalid email format.");
    return;
  }

  if(confirmPassword.value !== password.value){
    toast.error("Password does not match");
    return;
  }

  let id = dialog.open({
    title: "Confirm Details",
    message: `
      <div class="grid grid-cols-2 gap-y-1 mt-3">
        <div>Student ID:</div>
        <div>${studentId.value}</div>
        <div>First name:</div>
        <div>${firstName.value}</div>
        <div>Last name:</div>
        <div>${lastName.value}</div>
        <div>Email:</div>
        <div>${email.value}</div>
        <div>College:</div>
        <div>${college.value.name}</div>
        <div>Course:</div>
        <div>${college.value.courses?.find(c => c.id === course.value)?.acronym || "N/A"}</div>
        <div>Year level:</div>
        <div>${mapYearLevel(yearLevel.value)}</div>
      </div>
    `,
    ok: {
      text: "Proceed",
      click() {
        dialog.close(id);

        makeRequest("POST", Endpoints.TatakformsRegister, {
          student_id: studentId.value,
          year_level: yearLevel.value,
          first_name: firstName.value,
          last_name: lastName.value,
          course_id: course.value,
          email_address: email.value,
          password: password.value
        }, (response) => {
          isLoggingIn.value = false;
          store.isLoading = false;
          
          // if success
          if (response.success) {
            isRegistered.value = true;

            id = dialog.open({
              title: "Success",
              message: response.message,
              cancel: {
                text: "Close",
                click: () => {
                  clearFields();
                  dialog.close(id);
                }
              },
              ok: {
                text: "Go to login",
                click: () => {
                  clearFields();
                  dialog.close(id);
                  router.push("/tatakforms/login");
                }
              }
            });

            return;
          }

          toast.error(response.message);
        });
      }
    }
  });
}

function clearFields() {
  studentId.value = "";
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  course.value = "";
  yearLevel.value = "";
  isRegistered.value = false;

  for (const select of document.querySelectorAll("md-filled-select")) {
    select.reset();
  }
}
</script>

<style lang="scss" scoped>
.error md-text-button {
  --md-sys-color-primary: var(--md-sys-color-on-error);
}
</style>