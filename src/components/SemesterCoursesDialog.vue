<script lang="ts" setup>
import { toast } from '@neoncoder/vuetify-sonner';
import { Course, Semester } from '../types/user.types';
import { useAuthStore } from '../stores/auth';
import { ref, watch } from 'vue';

  const {makeAuthenticatedRequest} = useAuthStore()
  const loading = ref(false)
  const dialog = defineModel('dialog', {default: false})
  const props = defineProps({
    semester: {
      type: Object as () => Semester,
      required: true,
    }
  })
  const courses = ref<Course[]>([])
  watch(dialog, (newValue: boolean) => {
    if(newValue) getCourses()
  })
  function getCourses(){
    if(loading.value) return;
    loading.value = true
    setTimeout(() => {
      toast.toastOriginal.promise(makeAuthenticatedRequest({url: `semesters/records/${props.semester.id}?expand=courses_via_semester`}), {
        duration: 1000,
        loading: `Fetching ${props.semester.level_select} ${props.semester.name} Courses`,
        success:(data: Semester) => {
          console.log({data})
          courses.value = data.expand?.courses_via_semester as Course[]
          return `Fetched ${props.semester.level_select} ${props.semester.name} Courses`
        },
        error: (data: any) => {
          console.log({data});
          return `Error fetching ${props.semester.level_select} ${props.semester.name} Courses`
        },
        finally: () => {
          loading.value = false
        }
      })
    }, 500);
  }

  // onMounted(() => getCourses())
</script>


<template>
  <v-dialog
      v-model="dialog"
      width="auto"
      scrollable
      persistent
    >
      <v-card
        width="700"
        max-height="500"
        min-height="500"
        
      >
        <v-card-title class="bg-primary white--text d-flex align-center text-h5">
          <v-icon class="mr-4">mdi-school</v-icon>
          <div>
            <strong>{{ props.semester.level_select }} - {{ props.semester.name }}</strong> Courses
          </div>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = false" icon="mdi-close" variant="tonal" size="small"></v-btn>
        </v-card-title>
        <!-- <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Ok"
            @click="dialog = false"
          ></v-btn>
        </template> -->
        <v-divider></v-divider>
        <v-card-text class="pa-0">
          <div v-if="loading">
            <v-skeleton-loader v-for="i in 3" :elevation="i - i" type="list-item-avatar-two-line" class="my-2"></v-skeleton-loader>
          </div>
          <div v-else>
            <v-list lines="two" class="py-0">
              <v-list-item v-for="(course) in courses" :value="course.id" :to="`courses/${course.id}`">
                <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-book-open-page-variant-outline</v-icon>
          </v-avatar>
        </template>
                <v-list-item-title><strong>{{ course.course_code }}</strong> - {{ course.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ semester.level_select }}{{ semester.name }} - {{ course.course_code }}</v-list-item-subtitle>
              </v-list-item>

            </v-list>

          </div>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="ms-auto"
            text="Ok"
            @click="dialog = false"></v-btn>
        </v-card-actions>
        <!-- <v-overlay
          :model-value="loading"
          class="align-center justify-center"
          contained
          :scrim="'teal'"
          >
            <v-progress-circular
            color="primary"
            size="64"
            indeterminate
            ></v-progress-circular>
          </v-overlay> -->
      </v-card>
    </v-dialog>
</template>
