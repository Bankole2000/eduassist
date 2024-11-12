<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Level, PaginatedResults } from '../types/user.types';
import { useAuthStore } from '../stores/auth';
import { toast } from '@neoncoder/vuetify-sonner';
import LevelSemesters from './LevelSemesters.vue';

const levels = ref<Level[]>([])
const loading = ref(false)
const {makeAuthenticatedRequest} = useAuthStore()

function getLevels(){
  if(loading.value) return;
  loading.value = true;
  setTimeout(() => {
    toast.toastOriginal.promise(makeAuthenticatedRequest({ url : 'levels/records?expand=semesters_via_level'}), {
      duration: 1000,
      loading: 'Fetching Levels & Semesters',
      success: (data: PaginatedResults<Level>) => {
        levels.value = data.items
        return `Fetched Department Levels`
      },
      error: (data: any) => {
        console.log({data});
        return `Error Fetching Department Levels`
      },
      finally: () => {
        loading.value = false
      }
    })
  }, 500);
}

onMounted(() => getLevels())

</script>

<template>
  <div>
    <!-- <h1>List of Levels</h1> -->
    <!-- <v-btn @click="getLevels">Get Levels</v-btn> -->
    <div v-if="loading">
      <v-skeleton-loader v-for="i in 3" :elevation="i" type="card" height="200px" class="my-6"></v-skeleton-loader>
    </div>
    <div v-else>
      <LevelSemesters v-for="(level, index) in levels" :level="level" :class="index > 1 ? 'my-6': 'mb-6'" />
    </div>
  </div>
</template>
