<script lang="ts" setup>
import { computed } from 'vue';
import { env } from '../helpers/config';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
const {user} = storeToRefs(useAuthStore());
import defaultProfileImage from '../assets/images/default.jpg';

const avatarUrl = computed(() => {
  if(user.value && user.value.avatar) return `${env.fileUrl}/users/${user.value.id}/${user.value.avatar}`
  else return defaultProfileImage
})
</script>

<template>
<v-dialog max-width="500">
  <template v-slot:activator="{ props: activatorProps }">
    <v-avatar 
    v-bind="activatorProps"
    size="150"
    rounded="100"
    class="avatar-border"
    >
    <!-- image="smirk.png" -->
      <v-img style="border-radius: 50%;" :src="avatarUrl" cover></v-img>
    </v-avatar>
    <!-- <v-btn
      v-bind="activatorProps"
      color="surface-variant"
      text="Open Dialog"
      variant="flat"
    ></v-btn> -->
  </template>

  <template v-slot:default="{isActive}">
    <v-card>
      <v-img
      cover
      height="100%"
      @click="isActive.value = !isActive"
      :src="avatarUrl"
      ></v-img>
      <!-- <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions> -->
    </v-card>
  </template>
</v-dialog>
</template>
<style lang="css" scoped>
  .avatar-border {
    border: 2px dotted teal;
    padding: 10px;
  }
</style>

