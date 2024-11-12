<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { useAuthStore } from "../stores/auth";
// import { storeToRefs } from "pinia";
import { toast } from "@neoncoder/vuetify-sonner";
import { Course } from "../types/user.types";
import QuizAttemptList from "../components/QuizAttemptList.vue";
import ConfirmAttemptQuizModal from "../components/ConfirmAttemptQuizModal.vue";

const { makeAuthenticatedRequest } = useAuthStore()
// const { user } = storeToRefs(useAuthStore())
const course = ref<Course | null>(null)
const loading = ref(false)

const route = useRoute()
function loadCourseData(){
  if(loading.value) return;
  loading.value = true;
  const courseId = route.params.id
  console.log({courseId})
  toast.toastOriginal.promise(makeAuthenticatedRequest({url: `courses/records/${courseId}?expand=quizzes_via_courses,semester`}), {
    duration: 1000,
    loading: 'Loading course data',
    success: (data: Course) => {
      console.log({data});
      course.value = data
      return `Loaded ${data.course_code} course data`
    },
    error: (data: any) => {
      console.log({data})
      return `Error loading course data`
    },
    finally: () => {
      loading.value = false
    }
  })
}
onMounted(() => loadCourseData())
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-btn @click="$router.back()" variant="outlined" size="large" prepend-icon="mdi-arrow-left">Back</v-btn>
            <v-skeleton-loader v-if="loading" type="list-item"></v-skeleton-loader>

            <p class="text-h4 mx-4" v-else><strong>{{ course?.course_code }}</strong> - {{ course?.title }}</p>
          </div>
        </v-col>
      </v-row>
      <v-divider class="my-4"></v-divider>
      <v-row>
        <v-col cols="12">
          <div v-if="loading">
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
          </div>
          <div v-else>
            <div v-if="course?.expand?.quizzes_via_courses">
  
              <p class="text-h5">Quizzes</p>
              
              <v-expansion-panels>
                <v-expansion-panel
                  v-for="(quiz, index) in course?.expand?.quizzes_via_courses"
                  class="mt-4"
                >
                <v-expansion-panel-title>
                  <div class="d-flex align-center" style="width: 100%">
                    <p class="text-body-1"> {{ index + 1 }}. <strong>{{ quiz.subject }}</strong></p>
                    <v-spacer></v-spacer>
                    <ConfirmAttemptQuizModal class="mx-4" :quiz="quiz"/>
                  </div>
                </v-expansion-panel-title>
                <v-divider></v-divider>
                <v-expansion-panel-text>
                  <QuizAttemptList :quiz="quiz" class="mt-1" />
                </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </div>
            <v-alert v-else type="info" variant="tonal" density="compact">There a no quizzes for this course</v-alert>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
