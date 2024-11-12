<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Answer, PaginatedResults, Question } from '../types/user.types';
import { toast } from '@neoncoder/vuetify-sonner';
import { useAuthStore } from '../stores/auth';

const {makeAuthenticatedRequest} = useAuthStore()
const emit = defineEmits(['question:answered'])

const props = defineProps({
  question: {
    type: Object as () => Question,
    required: true
  },
  questionNumber: {
    type: Number,
    required: true
  },
  quizId: {
    type: String,
    required: true
  },
  attemptId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  }
})

const selectedOption = ref<string | null>(null)
const answerId = ref<string | null>(null)
const loading = ref(false)
async function updateAnswer(){
  if(loading.value) return;
  loading.value = true;
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: answerId.value ? `answers/records/${answerId.value}` : 'answers/records', method: answerId.value ? 'PATCH' : 'POST', data: {
    attempt: props.attemptId,
    question: props.question.id,
    user: props.userId,
    answer: selectedOption.value,
  }}, false), {
    duration: 800,
    loading: `Saving answer...`,
    success: (data: Answer) => {
      console.log({data});
      answerId.value = data.id
      emit("question:answered", {questionId: data.question})
      return `Answer saved!`
    },
    error: (data: any) => {
      console.log({data});
      return `Error saving answer`
    },
    finally: () => {
      loading.value = false
    }
  })
}

async function getExistingAnswer(){
  const filter = encodeURIComponent(`(user='${props.userId}'&&quiz='${props.quizId}'&&attempt='${props.attemptId}')`)
  const {items}: PaginatedResults<Answer> = await makeAuthenticatedRequest({url: `answers/records?filter=${filter}`}, false)
  if (items.length) {
    answerId.value = items[0].id
    selectedOption.value = items[0].answer
  }
}

onMounted(() => getExistingAnswer())

</script>

<template>
 <v-card height="250" border :loading="loading">
    <v-card-title>({{ questionNumber }}). {{ question.question }}</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-radio-group v-model="selectedOption" @update:model-value="updateAnswer">
        <v-radio v-for="(option) in question.expand?.options" :label="option.option"
          :value="option.id"></v-radio>
        <!-- <v-radio label="Radio Two" value="two"></v-radio>
  <v-radio label="Radio Three" value="three"></v-radio> -->
      </v-radio-group>
    </v-card-text>
    <!-- <v-card-actions>
      <QuestionInQuiz />
    </v-card-actions> -->
  </v-card>
</template>
