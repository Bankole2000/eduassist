<script lang="ts" setup>
  import { ref } from "vue";
  import { isValidEmail, isNotEmpty } from '@neoncoder/validator-utils';
  import { toast } from "@neoncoder/vuetify-sonner";
  import { useAuthStore } from "../../stores/auth";
// import { storeToRefs } from "pinia";

  const { login } = useAuthStore()
  // const {user} = storeToRefs(useAuthStore())

  const emit = defineEmits(['login:success'])
  // UI state Data
  const showPassword = ref(false)
  const loading = ref(false)
  const errors = ref({
    email: '',
    password: ''
  })

  // Component Data
  const email = ref('')
  const password = ref('')

  // Component Methods
  async function signin(e: any){
    if(loading.value) return;
    
    console.log({e});
    const identity = email.value;
    const usesEmail = identity.includes('@')
    if(!isNotEmpty(identity)) errors.value.email = `Email or Username is required`
    if(usesEmail){
      if(!isValidEmail(identity)) errors.value.email = `Invalid Email Address ${identity}`
    }
    if(!isNotEmpty(password.value)) errors.value.password = 'Password is required'
    console.log({
      identity,
      password: password.value,
      errors: errors.value
    });
    console.log(Object.values(errors.value).filter(x => Boolean(x)).length)
    if(Object.values(errors.value).filter(x => Boolean(x)).length){
      toast.error('Invalid sign in data')
      loading.value = false
      return;
    }
    try {
      loading.value = true
      await login({identity, password: password.value})
      emit("login:success")
    } catch (error: any) {
      console.log({error});
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div>
    <!-- <v-btn @click="logout">Logout</v-btn> -->
    <!-- user: <pre>{{ user }}</pre> -->
    <v-form @submit.prevent="signin">
      <v-text-field prepend-inner-icon="mdi-account" :hint="errors.email" persistent-hint @keypress.enter="signin" :error="Boolean(errors.email)" @focus="errors.email = ''" v-model="email" variant="outlined" tile label="Email or Username" placeholder="your@email.com or username"></v-text-field>
      <v-text-field prepend-inner-icon="mdi-lock" :hint="errors.password" persistent-hint class="mt-2" @keypress.enter="signin" :error="Boolean(errors.password)" @focus="errors.password = ''" v-model="password" variant="outlined" tile label="Password" :type="showPassword ? 'text':'password'" :append-inner-icon="showPassword ? 'mdi-eye-off': 'mdi-eye'" @click:append-inner="showPassword = !showPassword" placeholder="**********"></v-text-field>
      <v-btn color="primary" class="mt-2" tile size="large" type="submit" :loading="loading" :disabled="loading" block prepend-icon="mdi-send">Sign in</v-btn>
    </v-form>
  </div>
</template>
