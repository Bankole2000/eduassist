<script lang="ts" setup>
import { Level } from '../types/user.types';
import SemesterItem from './SemesterItem.vue';

const props = defineProps({
  level: {
    type: Object as () => Level,
    required: true,
  }
})
</script>

<template>
  <div>
    <v-hover v-slot="{isHovering: isLevelHovering, props: levelHoverProps}">
      <v-card v-bind="levelHoverProps" :elevation="isLevelHovering ? 4: 1">
        <v-card-title class="bg-amber-lighten-4 white--text text-h5 text-center font-weight-bold">{{ props.level.name }}</v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" sm="6" v-for="semester in level.expand?.semesters_via_level">
              <SemesterItem :semester="semester" />
            </v-col>
            <!-- <v-col cols="6">
              <v-card v-ripple>
                This card should ripple
              </v-card>
            </v-col> -->
          </v-row>

          <!-- <div class="d-flex align-center justify-center" style="width: 100%">
            <v-card width="45%" class="mx-auto pa-4">
              1st Semester
            </v-card>
            <v-card width="45%" class="mx-auto pa-4">
              2nd Semester
            </v-card>
          </div> -->
        </v-card-text>
        <!-- <v-card-actions></v-card-actions> -->
        <!-- <v-overlay
          :model-value="true"
          class="align-center justify-center"
          contained
          >
            <v-progress-circular
            color="primary"
            size="64"
            indeterminate
            ></v-progress-circular>
          </v-overlay> -->
      </v-card>
      <!-- <v-divider></v-divider> -->
    </v-hover>
    
  </div>
</template>
