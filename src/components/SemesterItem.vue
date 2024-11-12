<script lang="ts" setup>
import { ref } from 'vue';
import { Semester } from '../types/user.types';
import SemesterCoursesDialog from './SemesterCoursesDialog.vue';

const props = defineProps({
  semester: {
    type: Object as () => Semester,
    required: true,
  }
})
const dialog = ref(false)
</script>

<template>
  <v-hover v-slot="{isHovering: isSemesterHovering, props: semesterHoverProps }">
    <v-card 
    v-ripple 
    @click="dialog = true"
    class="text-h6 text-center pa-2 bg-teal"
    style="cursor: pointer;" 
    v-bind="semesterHoverProps" 
    :elevation="isSemesterHovering ? 4: 1"
    >
      {{ props.semester.name }}
    </v-card>
  </v-hover>
  <SemesterCoursesDialog v-model:dialog="dialog" :semester="props.semester" />
</template>
