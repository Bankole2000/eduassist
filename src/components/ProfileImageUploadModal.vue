<script lang="ts" setup>
import { toast } from '@neoncoder/vuetify-sonner';
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { User } from '../types/user.types';
const { makeAuthenticatedRequest } = useAuthStore()
const { user } = storeToRefs(useAuthStore());
const dialog = ref(false)
const loading = ref(false)
const image = ref<File | undefined>(undefined)
const imageUrl = ref<string | ArrayBuffer | null>("")
const stringImageUrl = computed(() => imageUrl.value ? String(imageUrl.value) : '')
// const imageUrl = computed(() => {
//   let result
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     result = e.target?.result
//     return result
//   } 
//   if(image.value) return reader.readAsDataURL(image.value);
// })
function uploadImage(remove = false){
  if(loading.value) return;
  if(!image.value) {
    if(!remove) {
      toast.error('Please select an image');
      return;
    }
  }
  if(!user.value) {
    toast.error("You need to be logged in")
    return;
  }
  loading.value = true;
  let data
  if(remove){
    data = { avatar: null}
  } else {
    data = new FormData()
    data.append('avatar', image.value!);
  }
  toast.toastOriginal.promise(makeAuthenticatedRequest({url: `users/records/${user.value.id}`, method: 'PATCH', data, type:  !remove ? 'FormData': 'JSON', successMessage: 'Profile Image Updated'}), {
    loading: 'Updating profile image',
    success: (data: User) => {
      console.log({data})
      user.value = data
      dialog.value = false
      return 'Profile Image updated'
    },
    error: (data: any) => {
      console.log({data});
      return 'Error updating profile image'
    },
    finally: () => {
      loading.value = false;
    }
  })
}

function createImage(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      console.log({e})
      imageUrl.value = e.target ? e.target.result : '';
    };
    reader.readAsDataURL(file);
  }

function onFileChange(file: File | null) {
  console.log({file, image: image.value})
  if (!file || !image.value) {
    return;
  }
  createImage(image.value);
}
async function cancel(){
    loading.value = false;
    image.value = undefined;
    dialog.value = false;
  }
</script>


<template>
  <div class="text-center pa-0">
    <v-btn tile @click="dialog = true" prepend-icon="mdi-camera" variant="tonal" color="green" class="text-capitalize mx-4">Update Profile Image</v-btn>

    <v-dialog
      v-model="dialog"
      width="auto"
      persistent
    >
      <v-card
        tile
        width="400"
      >
        <v-card-title class="d-flex align-center bg-primary">
          <v-icon>mdi-camera</v-icon> &nbsp; Update Image
          <v-spacer></v-spacer>
          <v-btn @click="cancel" icon variant="tonal" size="x-small"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-file-input
            tile
            label="Select Image"
            prepend-inner-icon="mdi-camera"
            density="compact"
            variant="outlined"
            accept="image/png, image/jpeg, image/bmp"
            v-model="image"
            @change="onFileChange"
            clearable
            show-size
          ></v-file-input>
          <v-expand-transition>
            <div v-if="image">
              <v-img :src="stringImageUrl" max-height="400" cover :aspect-ratio="1"></v-img>
            </div>
          </v-expand-transition>
        </v-card-text>
        <v-divider></v-divider>
        <template v-slot:actions>
          <v-spacer></v-spacer>
          <v-btn tile class="px-4 text-capitalize" color="error" text="Remove" prepend-icon="mdi-cancel" variant="tonal" @click="uploadImage(true)"></v-btn>
          <v-btn tile class="px-4 text-capitalize mr-2" color="primary" prepend-icon="mdi-content-save" text="save" variant="tonal" @click="uploadImage(false)"></v-btn>
          <v-btn
            tile
            class="ms-auto text-capitalize px-4"
            text="Close"
            prepend-icon="mdi-close"
            variant="text"
            @click="cancel"
          ></v-btn>
        </template>
        <v-overlay
          :model-value="loading"
          scrim="blue"
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
  </div>
</template>