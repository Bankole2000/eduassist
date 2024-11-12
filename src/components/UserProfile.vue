<script setup lang="ts">
import UserAvatar from './UserAvatar.vue';
import { useAuthStore} from '../stores/auth';
import { storeToRefs } from 'pinia';
import QuizCountButton from './QuizCountButton.vue';
import SuccessRateButton from './SuccessRateButton.vue';

const { user } = storeToRefs(useAuthStore());
</script>

<template>
  <div>
    <v-card :elevation="0" class="py-8">
      <div class="d-flex align-center justify-center" >
        <UserAvatar />
      </div>
      <div class="text-center mt-6 text-h5">
        <p v-if="user"><strong>Welcome</strong> @{{ user.username }}</p>
      </div>
    </v-card>
    <v-card :elevation="1" border class="bg-primary mt-4">
      <v-card-title>Your Stats</v-card-title>
      <v-card-text class="pa-0">
        <v-list lines="two">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="teal-lighten-4">
                <v-icon color="white">mdi-help-box-multiple</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <QuizCountButton />
              <!-- <v-btn
                loading
                color="grey-lighten-1"
                icon="mdi-information"
                variant="text"
              ></v-btn> -->
            </template>
            <v-list-item-title>Total Quizzes Taken</v-list-item-title>
            <v-list-item-subtitle>No of quizzes you have taken</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar color="green-lighten-1">
                <v-icon color="white">mdi-seal</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <SuccessRateButton />
              <!-- <v-btn
                loading
                color="grey-lighten-1"
                icon="mdi-information"
                variant="text"
              ></v-btn> -->
            </template>
            <v-list-item-title>Success Rate</v-list-item-title>
            <v-list-item-subtitle>% Right Answers Vs Wrong Answers</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        
      </v-card-text>
    </v-card>
  </div>
</template>
