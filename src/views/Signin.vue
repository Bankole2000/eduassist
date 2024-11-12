<script lang="ts" setup>
import SigninForm from '../components/Forms/SigninForm.vue';
import bgImg from '../assets/images/guy-in-library.webp'

</script>
<template>
  <div style="width: 100vw; height: calc(100vh)" class="d-flex align-center">
    <div style="flex: 6; height: calc(100vh);">
      <v-img :src="bgImg" cover>
        <div
              class="d-flex bg-red-darken-2 v-card--reveal text-h2"
              style="height: 100%; opacity: 0.5;"
            >
              
            </div>

      </v-img>
    </div>
    <div style="flex: 4; height: calc(100vh); background-color: white;">
      <v-container>
        <v-row justify="center" align="center" style="height: 90vh;">
          <v-col cols="12" class="px-16">
            <SigninForm @login:success="$router.push('/')" />
            <div class="d-flex align-center my-4">
              <v-divider></v-divider>
              <span class="px-4">OR</span>
              <v-divider></v-divider>
            </div>
            <v-btn to="/auth/signup" block prepend-icon="mdi-account-plus">Register</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </div>
    
  </div>
</template>
