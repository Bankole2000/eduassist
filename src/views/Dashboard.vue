<script lang="ts" setup>
import LevelsList from '../components/LevelsList.vue';
import UserProfile from '../components/UserProfile.vue';


</script>
<template>
  <div>
    <v-container fluid class="px-16">
      <v-row>
        <v-col cols="12" sm="4">
          <UserProfile class="mt-0"/>
        </v-col>
        <v-col cols="12" sm="8">
          <LevelsList />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
