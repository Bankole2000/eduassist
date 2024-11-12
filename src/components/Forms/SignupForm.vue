<script lang="ts" setup>
import { toast } from "@neoncoder/vuetify-sonner";
import { ref } from "vue";
import { useDisplay } from "vuetify";
import { useAuthStore } from "../../stores/auth";
import { User } from "../../types/user.types";
import { isNotEmpty } from "@neoncoder/validator-utils";

const {makeAuthenticatedRequest} = useAuthStore()

const emit = defineEmits(['signup:success'])

// UI state data
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const loading = ref(false)
const errors = ref({
  email: '',
  password: '',
  firstname: '',
  lastname: '',
  username: '',
  gender: '',
  confirmPassword: '',
})
const {smAndDown} = useDisplay()

// Component Data
const firstname = ref("");
const lastname = ref("");
const email = ref("");
const username = ref("");
const gender = ref("Male")
const password = ref("");
const confirmPassword = ref("");

const genderOptions = ref(["Male", "Female", "Other"])
function signup(e: any){
  if(loading.value) return;
  const data = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    emailVisibility: true,
    username: username.value,
    password: password.value,
    passwordConfirm: confirmPassword.value,
    gender: gender.value
  }
  if(!isNotEmpty(data.email)) errors.value.email = `Email is required`
  if(!isNotEmpty(data.firstname)) errors.value.firstname = `Firstname is required`
  if(!isNotEmpty(data.lastname)) errors.value.lastname = `Lastname is required`
  if(!isNotEmpty(data.username)) errors.value.username = `Username is required`
  if(!isNotEmpty(data.password)) errors.value.password = `Password is required`
  if(!isNotEmpty(data.passwordConfirm)) errors.value.confirmPassword = `Please confirm password`
  if(data.password !== data.passwordConfirm) errors.value.confirmPassword = `Password mismatch`
  if(Object.values(errors.value).filter(x => Boolean(x)).length){
    toast.error('Invalid sign up data')
    loading.value = false
    return;
  }
  
  loading.value = true
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: 'users/records', method: 'POST', data, successMessage: 'Registration Successful - Please sign in'}), {
    loading: 'Signing you up...',
    success: (data: User) => {
      console.log({data});
      emit('signup:success')
      return `Registration successful`
    },
    error: (data: any) => {
      console.log({data})
      if(data.data.username) errors.value.username = data.data.username.message
      if(data.data.email) errors.value.email = data.data.email.message
      if(data.data.firstname) errors.value.firstname = data.data.firstname.message
      if(data.data.lastname) errors.value.lastname = data.data.lastname.message
      return `Error Signing up`
    },
    finally: () => {
      loading.value = false;
    }
  })
  console.log({e});
}
</script>

<template>
  <div>
    <v-form @submit.prevent="signup">
      <v-container>
      <v-row>
        <v-col cols="12" class="py-0 my-0" sm="6">
          <v-text-field :density="smAndDown ? 'compact': 'default'" prepend-inner-icon="mdi-account" :hint="errors.firstname" persistent-hint @keypress.enter="signup" :error="Boolean(errors.firstname)" @focus="errors.firstname = ''" v-model="firstname" variant="outlined" tile label="Firstname" placeholder="John"></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0 my-0" sm="6">
          <v-text-field :density="smAndDown ? 'compact': 'default'" prepend-inner-icon="mdi-account" :hint="errors.lastname" persistent-hint @keypress.enter="signup" :error="Boolean(errors.lastname)" @focus="errors.lastname = ''" v-model="lastname" variant="outlined" tile label="Lastname" placeholder="Doe"></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0 my-0" sm="6">
          <v-text-field :density="smAndDown ? 'compact': 'default'" prepend-inner-icon="mdi-email" :hint="errors.email" persistent-hint @keypress.enter="signup" :error="Boolean(errors.email)" @focus="errors.email = ''" v-model="email" variant="outlined" tile label="Email" placeholder="john.doe@email.com"></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0 my-0" sm="6">
          <v-text-field :density="smAndDown ? 'compact': 'default'" prepend-inner-icon="mdi-at" :hint="errors.username" persistent-hint @keypress.enter="signup" :error="Boolean(errors.username)" @focus="errors.username = ''" v-model="username" variant="outlined" tile label="Username" placeholder="john_doe"></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0 my-0" sm="12">
          <v-select label="Gender" :density="smAndDown ? 'compact': 'default'" variant="solo-filled" tile :items="genderOptions" v-model="gender"></v-select>
        </v-col>
        <v-col cols="12" class="py-0 my-0" sm="6">
          <v-text-field :density="smAndDown ? 'compact': 'default'" prepend-inner-icon="mdi-lock" :hint="errors.password" persistent-hint @keypress.enter="signup" :error="Boolean(errors.password)" @focus="errors.password = ''" v-model="password" variant="outlined" tile label="Password" :type="showPassword ? 'text':'password'" :append-inner-icon="showPassword ? 'mdi-eye-off': 'mdi-eye'" @click:append-inner="showPassword = !showPassword" placeholder="**********"></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0 my-0" sm="6">
          <v-text-field :density="smAndDown ? 'compact': 'default'" prepend-inner-icon="mdi-lock" :hint="errors.confirmPassword" persistent-hint @keypress.enter="signup" :error="Boolean(errors.confirmPassword)" @focus="errors.confirmPassword = ''" v-model="confirmPassword" variant="outlined" tile label="Confirm Password" :type="showConfirmPassword ? 'text':'password'" :append-inner-icon="showConfirmPassword ? 'mdi-eye-off': 'mdi-eye'" @click:append-inner="showConfirmPassword = !showConfirmPassword" placeholder="**********"></v-text-field>
        </v-col>
        <v-col cols="12" class="py-0 my-0">
          <v-btn color="primary" class="mt-2" tile size="large" type="submit" :loading="loading" :disabled="loading" block prepend-icon="mdi-account-plus">Sign Up</v-btn>
        </v-col>
      </v-row>
      </v-container>
    </v-form>
  </div>
</template>
