<script lang="ts" setup>
import { watch } from 'vue';

const dialog = defineModel("dialog", {default: false})
const emit = defineEmits(['submit', 'pause', 'continue'])

watch(dialog, (newValue) => {
  if(newValue){
    emit('pause')
  } else {
    emit('continue')
  }
})
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
      <v-card-title class="bg-primary white--text d-flex align-center">
        <v-icon class="mr-4">mdi-content-save-edit</v-icon>
        Submit Quiz Attempt
      </v-card-title>
      <v-card-text>
        Satisfied with your answers? Submit your quiz attempt to get your score immediately.
      </v-card-text>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn
          text="Cancel"
          class="mx-4"
          variant="text"
          color="error"
          @click="dialog = false"
          ></v-btn>
          <v-btn @click="() => {
            $emit('submit')
            dialog = false
          }" variant="elevated" color="primary" append-icon="
          mdi-content-save-move">Submit</v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>
