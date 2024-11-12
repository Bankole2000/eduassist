<script lang="ts" setup>
import { toast } from '@neoncoder/vuetify-sonner';
import { useAuthStore } from '../stores/auth';
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  attemptId: {
    type: String,
    required: true
  }
})

const {makeAuthenticatedRequest} = useAuthStore()
const dialog = defineModel("dialog", {default: false})
const loading = ref(false)
const router = useRouter()
const emit = defineEmits(['submit', 'pause', 'continue'])

watch(dialog, (newValue) => {
  if(newValue){
    emit('pause')
  } else {
    emit('continue')
  }
})
function cancelAttempt(){
  if(loading.value) return;
  loading.value = true
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: `attempts/records/${props.attemptId}`, method: 'DELETE', type: "JSON"}), {
    loading: `Cancelling quiz attempt...`,
    success: (data: null) => {
      console.log({data});
      dialog.value = false
      router.back()
      return `Quiz attempt cancelled`
    },
    error: (data: any) => {
      console.log({data});
      return `Error cancelling quiz attempt`
    },
    finally: () => {
      loading.value = false
    }
  })
}
</script>


<template>
  <v-dialog
      v-model="dialog"
      width="auto"
      persistent
    >
      <v-card
        max-width="400"
      >
      <v-card-title class="bg-error white--text d-flex align-center">
        <v-icon class="mr-4">mdi-close-box</v-icon>
        Cancel this Quiz Attempt?
      </v-card-title>
      <v-card-text>
        Cancel this quiz attempt? (Your score will <strong>NOT</strong> be saved)
      </v-card-text>
      <v-divider></v-divider>
        <template v-slot:actions>
          <v-btn @click="cancelAttempt" prepend-icon="mdi-delete" color="error" variant="elevated">
            Cancel Attempt
          </v-btn>
          <v-btn
            class="ms-auto"
            variant="tonal"
            color="primary"
            text="Continue Quiz"
            :loading="loading"
            append-icon="mdi-arrow-right"
            @click="dialog = false"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>
