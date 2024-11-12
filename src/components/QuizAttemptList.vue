<script setup lang="ts">
import { Attempt, PaginatedResults, Quiz } from '../types/user.types';
import AttemptListItem from './AttemptListItem.vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
const {user} = storeToRefs(useAuthStore());
const {makeAuthenticatedRequest} = useAuthStore()

const props = defineProps({
  quiz: {
    type: Object as () => Quiz,
    required: true
  }
})

const attempts = ref<Attempt[]>([])
const loading = ref(false)
const page = ref(1)
const perPage = ref(50)
const totalItems = ref(0)
const totalPages = ref(1)


async function getQuizAttempts(){
  if(loading.value) return;
  loading.value = true;
  console.log({ quiz: props.quiz, user: user.value })
  if(user.value){
    try {
      const filter = encodeURIComponent(`(user='${user.value.id}'&&quiz='${props.quiz.id}')`)
      const { items, page: rPage, perPage: rPerPage, totalItems: rTotalItems, totalPages: rTotalPages}: PaginatedResults<Attempt> = await makeAuthenticatedRequest({url: `attempts/records?filter=${filter}`})
      attempts.value = items;
      page.value = rPage
      perPage.value = rPerPage
      totalItems.value = rTotalItems
      totalPages.value = rTotalPages
    } catch (error: any) {
      console.log({error})
    } finally {
      loading.value = false
    }
  }
}

onMounted(() => getQuizAttempts())
</script>

<template>
  <div>
    <v-progress-linear v-if="loading" indeterminate height="10" rounded striped color="grey-lighten-1" class="my-2"></v-progress-linear>
    <div v-else>
      <div v-if="attempts.length">
        <AttemptListItem v-for="(attempt, index) in attempts" :attempt="attempt" :index="index + 1" :quiz-id="quiz.id" />
      </div>
      <v-alert v-else type="info" variant="tonal" density="compact">
        You haven't attempted this quiz yet
      </v-alert>
    </div>
  </div>
</template>
