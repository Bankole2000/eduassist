<script lang="ts" setup>
// import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { Answer, Attempt, PaginatedResults, Question, Quiz } from '../types/user.types';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
  attempt: {
    type: Object as () => Attempt,
    required: true,
  },
  quizId: {
    type: String,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  }
})

const loading = ref(false);
const correctAnswers = ref<Answer[]>([]);
const questions = ref<Question[]>([])
const questionCount = computed(() => questions.value.length);
const answerCount = computed(() => correctAnswers.value.length);
// const {user} = storeToRefs(useAuthStore());
const {makeAuthenticatedRequest} = useAuthStore()

const scoreColor = (answerCount: number, questionCount: number) => computed(() => {
  let score = (answerCount / questionCount) * 100
  console.log({score })
  switch (true) {
    case (score <= 39):
      return "error"
    case (score >= 40 && score <= 69):
      return "orange"
    case (score >= 70 && score <= 89):
      return "success"
    case (score >= 90 && score <= 100):
      return "purple"
    default:
      return "grey"
  }
})


async function getQuizAttemptScores(){
  if(loading.value) return;
  loading.value = true;
  try {
    const filter = encodeURIComponent(`(answer.id=question.correct_option.id&&attempt='${props.attempt.id}')`)
    const { items: answers }: PaginatedResults<Answer> = await makeAuthenticatedRequest({ url: `answers/records?filter=${filter}`})
    const { expand }: Quiz = await makeAuthenticatedRequest({ url: `quizzes/records/${props.quizId}?expand=questions_via_quizzes`})
    correctAnswers.value = answers
    questions.value = expand?.questions_via_quizzes as Question[]
  } catch (error: any) {
    console.log({ error })
  } finally {
    loading.value = false
  }
}

onMounted(() => getQuizAttemptScores())
</script>

<template>
  <div class="d-flex align-center mt-2">
    <p>{{ props.index }} - {{  props.attempt.created }}</p>
    <v-spacer></v-spacer>
    <div style="width: 60%">
      <v-progress-linear 
      class="mx-2"
      bg-color="#92aed9"
      buffer-color="error"
      buffer-opacity="1"
      :buffer-value="questionCount"
      color="success"
      height="12"
      :max="questionCount"
      min="0"
      :model-value="answerCount"
      rounded
      ></v-progress-linear>
    </div>
    <v-spacer></v-spacer>
    <v-chip :color="scoreColor(answerCount, questionCount).value">{{ answerCount }} / {{ questionCount }}</v-chip>
  </div>
  <v-divider class="mt-2"></v-divider>
</template>
