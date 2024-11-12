
<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { onMounted, ref } from 'vue';
import { toast } from '@neoncoder/vuetify-sonner';

const { makeAuthenticatedRequest } = useAuthStore()
const { user } = storeToRefs(useAuthStore())

const loading = ref(false)
const totalQuizAttempts = ref(0)

async function getTotalQuizCount(){
  if(!user.value){
    toast.error('You need to be logged in')
    return;
  }
  if(loading.value) return;
  loading.value = true;
  try {
    const result = await makeAuthenticatedRequest({ url: `user_attempts/records/${user.value.id}` }, false);
    totalQuizAttempts.value = result.totalAttempts
  } catch (error: any) {
    console.log({error});
  } finally {
    loading.value = false
  }
}

onMounted(() => getTotalQuizCount())
</script>


<template>
  <v-dialog max-width="500" scrollable>
  <template v-slot:activator="{ props: activatorProps }">
    <v-chip
      label
      v-bind="activatorProps"
      size="x-large"
      variant="flat"
      >
      <v-progress-circular :width="3" indeterminate v-if="loading"></v-progress-circular>
      <span class="text-h5" v-else>{{totalQuizAttempts}}</span>
    </v-chip>
      <!-- color="surface-variant" -->
  </template>

  <template v-slot:default="{ isActive }">
    <v-card>
      <v-card-title>Total Quizzes Taken</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          text="Close Dialog"
          @click="isActive.value = false"
        ></v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>
