<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { Answer, PaginatedResults, Question, Quiz } from '../types/user.types';
import { useAuthStore } from '../stores/auth';

const dialog = defineModel("dialog", {default: false})
const emit = defineEmits(['submitted', 'close'])
const props = defineProps({
  attemptId: {
    type: String,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
})
const { makeAuthenticatedRequest } = useAuthStore()

const answers = ref<Answer[]>([]);
const questions = ref<Question[]>([])
const questionCount = computed(() => questions.value.length);
const answerCount = computed(() => answers.value.length);
const correctAnswers = computed(() => answers.value.filter(x => x.answer === x.expand?.question?.correct_option))
const correctAnswerCount = computed(() => correctAnswers.value.length);
const loading = ref(false)
const showDetails = ref(false)
watch(dialog, (newValue: boolean) => {
  if(newValue) {
    getQuizAttemptScores()
    emit('submitted')
  }
})
async function getQuizAttemptScores(){
  if(loading.value) return;
  loading.value = true;
  try {
    const filter = encodeURIComponent(`(attempt='${props.attemptId}')`)
    const { items: dbanswers }: PaginatedResults<Answer> = await makeAuthenticatedRequest({ url: `answers/records?filter=${filter}&expand=question,answer`})
    const { expand }: Quiz = await makeAuthenticatedRequest({ url: `quizzes/records/${props.quizId}?expand=questions_via_quizzes.options,questions_via_quizzes.correct_option`})
    answers.value = dbanswers
    questions.value = expand?.questions_via_quizzes as Question[]
  } catch (error: any) {
    console.log({ error });
  } finally {
    loading.value = false
  }
}

const userAnswer = (questionId: string) => computed(() => {
  const answer = answers.value.find(ans => ans.question === questionId)
  return answer?.expand?.answer?.option
})
const answerIsCorrect = (questionId: string) => computed(() => {
  const answer = answers.value.find(ans => ans.question === questionId)
  const question = questions.value.find(q => q.id === questionId)
  if(!answer) return false
  if(!question) return false
  if(answer.answer !== question.correct_option) return false
  return true
})
</script>


<template>
  <v-dialog
      v-model="dialog"
      width="auto"
      persistent
      scrollable
    >
      <v-card
        width="600"
        max-height="600"
      >
      <v-card-title class="bg-primary d-flex align-center">
        <v-icon class="mr-4">mdi-scoreboard</v-icon>
        <p>Your Score</p>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <p>
          You scored: <strong>{{  correctAnswerCount }} / {{ questionCount }}</strong> 
        </p> <br>
        <p>
          Total Questions: <strong>{{ questionCount }}</strong>
          <br>
          Questions Attempted: <strong>{{ answerCount }}</strong>
          <br>
          Correct Answers: <strong>{{ correctAnswerCount }}</strong>
        </p>
        <v-btn class="mt-4" color="teal" @click="showDetails = !showDetails" block :append-icon="showDetails ? 'mdi-chevron-double-up': 'mdi-chevron-double-down'">Show Detaiils</v-btn>
        <v-divider></v-divider>
        <v-expand-transition>
          <div v-if="showDetails">
            <v-list lines="three" density="compact">
              <v-list-item v-for="question in questions" :key="question.id">
                <template v-slot:prepend>
                  <v-avatar color="purple-lighten-2">
                    <v-icon color="white">mdi-comment-question-outline</v-icon>
                  </v-avatar>
                </template>
                <template v-slot:append>
                  <v-icon
                    v-if="answerIsCorrect(question.id).value"
                    color="success"
                    icon="mdi-check"
                    variant="text"
                  ></v-icon>
                  <v-icon v-else color="error" icon="mdi-close" variant="text"></v-icon>
                </template>
                <v-list-item-title :title="question.question">{{ question.question }}</v-list-item-title>
                <v-list-item-subtitle>
                  Correct Answer: {{ question.expand?.correct_option?.option }} <br>
                  Your Answer: {{ userAnswer(question.id) }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-expand-transition>
      </v-card-text>
      <v-divider></v-divider>
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="() => {
              dialog = false
              $emit('close')
            }"
          ></v-btn>
        </template>
        <v-overlay
          :model-value="loading"
          class="align-center justify-center"
          contained
          >
            <v-progress-circular
            color="primary"
            size="64"
            indeterminate
            ></v-progress-circular>
          </v-overlay>
      </v-card>
    </v-dialog>
</template>
