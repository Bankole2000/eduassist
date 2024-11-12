<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { Question, Quiz } from '../types/user.types';
import { computed, onMounted, ref, watchEffect } from 'vue';
import { toast } from '@neoncoder/vuetify-sonner';
import { useTimer } from 'vue-timer-hook';
import QuestionInQuiz from '../components/QuestionInQuiz.vue';
import Timer from './Timer.vue';
import { storeToRefs } from 'pinia';
import CancelQuizModal from '../components/CancelQuizModal.vue';
import SubmitQuizModal from '../components/SubmitQuizModal.vue';
import TimeUpQuizModal from '../components/TimeUpQuizModal.vue';
import QuizScoreModal from '../components/QuizScoreModal.vue';

const { makeAuthenticatedRequest } = useAuthStore()
const { user } = storeToRefs(useAuthStore())

const quiz = ref<Quiz | null>(null)
const questions = ref<Question[]>([])
const loading = ref(false)

const submitDialog = ref(false)
const cancelDialog = ref(false)
const timeUpDialog = ref(false)
const scoreDialog = ref(false)

// watch([submitDialog, cancelDialog], ([newsd, newcd]) => {
//   if(newsd || newcd){
//     if(timer && !timer.isExpired){
//       timer.pause()
//       return;
//     }
//   } 
//   // if(timer && !timer.isExpired && !timer.isRunning) {
//   //   timer.resume()
//   // }
// })

const e1 = ref(1)
const steps = ref(6)
const disabled = computed(() => {
  return e1.value === 1 ? 'prev' : e1.value === steps.value ? 'next' : undefined
})

let timer: any
const route = useRoute()
const quizId = ref<string>(route.params.id as string)
const attemptId = ref<string>(route.query.attempt as string)
const answeredQuestions = ref<Set<string>>(new Set())

function questionAnswered(e: {questionId: string}){
  answeredQuestions.value.add(e.questionId)
  if(e1.value < questions.value.length){
    setTimeout(() => {
      e1.value+=1
    }, 500);
  } else {
    console.log("Show submit modal")
  }
}

function loadQuizData() {
  if (loading.value) return;
  loading.value = true;
  // const quizId = route.params.id
  // const attemptId = route.query.attempt
  console.log({ quizId: quizId.value, attemptId: attemptId.value });
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: `quizzes/records/${quizId.value}?expand=questions_via_quizzes.options,questions_via_quizzes.correct_option` }), {
    duration: 1000,
    loading: `Loading Quiz Questions`,
    success: (data: Quiz) => {
      quiz.value = data
      questions.value = data.expand?.questions_via_quizzes as Question[]
      steps.value = questions.value.length
      const time = new Date();
      time.setSeconds(time.getSeconds() + questions.value.length * 10);
      timer = useTimer(Number(time));
      console.log({timer})
      watchEffect(async () => {
        if(timer.isExpired.value) {
          timeUpDialog.value = true
          console.warn('IsExpired')
        }
      })
      return `Quiz Loaded`
    },
    error: (data: any) => {
      console.log({ data })
      return `Error loading Quiz`
    },
    finally: () => {
      loading.value = false
    }
  })
}



onMounted(() => loadQuizData())
// $router.back()

</script>
<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center">
            <v-btn @click="cancelDialog = true" prepend-icon="mdi-arrow-left" variant="outlined" size="large" class="mr-4">Back</v-btn>
            <p class="text-h5 font-weight-bold">{{ quiz?.subject }}</p>
            <v-spacer></v-spacer>
            <div class="text-h5" v-if="timer">
              {{ timer }}
              <Timer :digit="timer.minutes" />: <Timer :digit="timer.seconds" />
            </div>
            <v-btn @click="submitDialog = true" append-icon="mdi-receipt-send" class="ml-4" size="large" color="primary">Submit</v-btn>
          </div>
          <v-divider class="my-4"></v-divider>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <div v-if="user">
            <v-stepper v-model="e1">
              <template v-slot:default="{ prev, next }">
                <v-stepper-header>
                  <template v-for="(question, n) in questions" :key="`${n}-step`">
                    <v-stepper-item :color="answeredQuestions.has(question.id) ? 'primary': ''" :complete="answeredQuestions.has(question.id)" :step="`Step {{ n + 1 }}`" :value="n + 1"
                      editable></v-stepper-item>
                    <v-divider v-if="n !== steps" :key="n"></v-divider>
                  </template>
                </v-stepper-header>
                <v-stepper-window>
                  <v-stepper-window-item v-for="(question, n) in questions" :key="`${n}-content`" :value="n + 1">
                    <QuestionInQuiz :question="question" :question-number="n+1" :attempt-id="attemptId" :quiz-id="quizId" :user-id="user.id" @question:answered="questionAnswered" />
                  </v-stepper-window-item>
                </v-stepper-window>
                <v-stepper-actions :disabled="disabled" @click:next="next" @click:prev="prev"></v-stepper-actions>
              </template>
            </v-stepper>
          </div>
          <v-alert v-else type="error" variant="tonal">You must be logged in to take this Quiz</v-alert>
        </v-col>
      </v-row>
      <CancelQuizModal :attempt-id="attemptId" v-model:dialog="cancelDialog" @submit="scoreDialog = true" @pause="timer.pause()" @continue="timer.resume()" />
      <SubmitQuizModal v-model:dialog="submitDialog" @submit="scoreDialog = true" @pause="timer.pause()" @continue="timer.resume()" />
      <TimeUpQuizModal v-model:dialog="timeUpDialog" @submit="scoreDialog = true"/>
      <QuizScoreModal :attempt-id="attemptId" :quiz-id="quizId" v-model:dialog="scoreDialog" @submitted="timer.isRunning ? timer.pause() : () => {}" @close="$router.back()" />
    </v-container>
  </div>
</template>
