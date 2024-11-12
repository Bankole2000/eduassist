<script setup lang="ts">
import { ref } from "vue";
// import { invoke } from "@tauri-apps/api/core";
import { VSonner } from '@neoncoder/vuetify-sonner'
import ProfileButton from "./components/ProfileButton.vue";
const mainNav = ref(false);
// const greetMsg = ref("");
// const name = ref("");

// async function greet() {
//   // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
//   greetMsg.value = await invoke("greet", { name: name.value });
// }
</script>

<template>
  <v-app>
      <v-app-bar v-if="!$route.path.includes('auth')">
        <v-app-bar-nav-icon @click="mainNav = !mainNav"></v-app-bar-nav-icon>
        <v-app-bar-title>EduAssist</v-app-bar-title>
        <v-spacer></v-spacer>
        <ProfileButton />
      </v-app-bar>
      <v-navigation-drawer v-if="!$route.path.includes('auth')" :disable-resize-watcher="true" :disable-route-watcher="true" v-model="mainNav">
        <v-list>
          <!-- <v-list-item title="Navigation drawer"></v-list-item> -->
          <v-list-item to="/">Home</v-list-item>
          <v-list-item to="/about">About</v-list-item>
          <v-list-item to="/contact">Contact</v-list-item>
          <v-list-item to="/test">Test</v-list-item>
        </v-list>
      </v-navigation-drawer>
    <v-main style="background-color: #EFEFEF;">
      <RouterView></RouterView>
      <!-- <v-btn @click="toast.success('Test Toast', {cardTextProps: {style: {minWidth: '300px'}}})">Test Button</v-btn> -->
    </v-main>
    <!-- </v-layout> -->
    <!-- <main class="container">
      <h1>Welcome to Tauri + Vue</h1>

      <div class="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and Vue logos to learn more.</p>

      <form class="row" @submit.prevent="greet">
        <input id="greet-input" v-model="name" placeholder="Enter a name..." />
        <button type="submit">Greet</button>
        <v-btn @click="toast.success('Test Toast')">Test Button</v-btn>
        
      </form>
      <p>{{ greetMsg }}</p>
    </main> -->
  </v-app>
  <VSonner position="bottom-right" :visible-toasts="5" :expand="true"></VSonner>
</template>

<style scoped>

</style>