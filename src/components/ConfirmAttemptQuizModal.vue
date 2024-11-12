<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Attempt, Quiz } from '../types/user.types';
import { toast } from '@neoncoder/vuetify-sonner';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

const {makeAuthenticatedRequest} = useAuthStore()
const {user} = storeToRefs(useAuthStore())

const props = defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true
  }
})

const router = useRouter()

const loading = ref(false);

function confirmQuizAttempt(){
  if(!user.value){
    toast.error('You must be logged in to attempt a quiz')
    return;
  }
  if(loading.value) return;
  loading.value = true;
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: 'attempts/records', method: 'POST', data: {user: user.value.id, quiz: props.quiz.id}, successMessage: "Beginning Quiz Attempt", errorMessage: "Error Beginning Quiz Attempt"}), {
    loading: 'Starting Quiz...',
    success: (data: Attempt) => {
      console.log({data});
      router.push({ path: `/quiz/${props.quiz.id}`, query: { attempt: data.id } })
      return `Quiz Attempt Started`
    },
    error: (data: any) => {
      console.log({data});
      return `Error starting quiz attempt`
    },
    finally: () => {
      loading.value = false
    }
  })
}
</script>

<template>
  <v-dialog max-width="500" persistent>
  <template v-slot:activator="{ props: activatorProps }">
    <v-btn
      v-bind="activatorProps"
      color="surface-variant"
      class="mx-4"
      text="Take Quiz"
      variant="flat"
    ></v-btn>
  </template>

  <template v-slot:default="{ isActive }">
    <v-card >
      <v-card-title class="d-flex align-center bg-primary">
        <v-icon class="mr-4">mdi-format-list-checks</v-icon>
        <p>Attempt this quiz</p>
        <v-spacer></v-spacer>
        <v-btn :disabled="loading" @click="isActive.value = false" variant="tonal" icon="mdi-close" size="small"></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p class="text-h6">
          {{  props.quiz.subject }}
        </p>
        <v-divider class="mb-4"></v-divider>
        <p>This quiz will be timed. At the end of the timer the quiz will end and be <strong>submitted automatically</strong>.</p>
        <br>
        <p>During the quiz, use the <kbd class="bg-grey-darken-3 px-2">Back</kbd> button to end a quiz with or without submitting and use the <kbd class="bg-primary px-2">Submit</kbd> button to submit the quiz</p>

      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Cancel"
          color="error"
          :disabled="loading"
          prepend-icon="mdi-close"
          class="mx-4"
          @click="isActive.value = false"
        ></v-btn>
        <v-btn :loading="loading" color="primary" variant="elevated" @click="confirmQuizAttempt" class="pl-4" append-icon="mdi-chevron-right">Start</v-btn>
      </v-card-actions>
    </v-card>
  </template>
</v-dialog>
</template>
