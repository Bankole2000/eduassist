<script lang="ts" setup>
const dialog = defineModel("dialog", {default: false})
const emits = defineEmits(['submit'])
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
      <v-card-title class="bg-primary d-flex align-center">
        <v-icon class="mr-4">mdi-alarm</v-icon>
        <p>Time's Up</p>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        Time is up for the quiz and your answers would be submitted automatically.
      </v-card-text>
      <v-divider></v-divider>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="() => {
              dialog = false
              $emit('submit')
            }"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
</template>
