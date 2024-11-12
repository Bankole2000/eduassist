<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../stores/auth';
import { ref } from 'vue';
import { toast } from '@neoncoder/vuetify-sonner';
import { User, UserUpdateData } from '../types/user.types';
import UserAvatar from '../components/UserAvatar.vue';
import ProfileImageUploadModal from '../components/ProfileImageUploadModal.vue';
const { user, oldPassword } = storeToRefs(useAuthStore())
const { makeAuthenticatedRequest } = useAuthStore()
const firstname = ref<string>(user.value?.firstname || '')
const lastname = ref<string>(user.value?.lastname || '')
const genderOptions = ref(['Male', 'Female', 'Other'])
const gender = ref<string>(user.value?.gender || '')
const username = ref<string>(user.value?.username || '')
const email = ref(user.value?.email)
const changePassword = ref(false)
const newPassword = ref("")
const confirmNewPassword = ref("")
const loading = ref(false)
const changingPassword = ref(false)
const errors = ref({
  newPassword: '',
  confirmNewPassword: '',
  username: '',
  firstname: '',
  lastname: ''
})

function reset(){
  firstname.value = user.value?.firstname || ''
  lastname.value = user.value?.lastname || ''
  gender.value = user.value?.gender || 'Other'
  username.value = user.value?.username || ''
  changePassword.value = (false)
  newPassword.value = ("")
  confirmNewPassword.value = ("")
}

function updateProfileDetails(){
  if(loading.value) return;
  loading.value = true;
  if(!user.value) {
    toast.error("You need to be logged in")
    return;
  }
  const data: UserUpdateData = {
    username: username.value,
    firstname: firstname.value,
    lastname: lastname.value,
    gender: gender.value
  }
  if(!username.value) errors.value.username = 'Username cannot be empty'
  if(!firstname.value) errors.value.firstname = 'firstname cannot be empty'
  if(!lastname.value) errors.value.lastname = 'lastname cannot be empty'

  if(changePassword.value){
    if(!newPassword.value) errors.value.newPassword = 'New Password cannot be empty'
    if(!confirmNewPassword.value) errors.value.confirmNewPassword = 'Confirm New Password cannot be empty'

    if(newPassword.value !== confirmNewPassword.value){
      toast.error("Password don't match")
      return
    }
    data.oldPassword = oldPassword.value
    data.password = newPassword.value
    data.passwordConfirm = confirmNewPassword.value
  }
  if(Object.values(errors.value).filter(x => Boolean(x)).length){
    toast.error('Invalid profile data')
    loading.value = false
    return;
  }
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: `users/records/${user.value.id}`, method: 'PATCH', data, successMessage: 'Profile Details Updated'}), {
    loading: 'Updating Profile',
    success: (data: User) => {
      console.log({data})
      user.value = data
      if(changePassword.value) oldPassword.value = newPassword.value
      return `Profile Updated`
    },
    error: (data: any) => {
      console.log({data});
      return 'Error Updating profile'
    },
    finally: () => {
      loading.value = false
    }
  })
}

function updatePassword(){
  if(changingPassword.value) return;
  const data: Pick<UserUpdateData, 'password' | 'passwordConfirm' | 'oldPassword'> = {}
  if(!user.value) {
    toast.error("You need to be logged in")
    return;
  }
  if(!newPassword.value) errors.value.newPassword = 'New Password cannot be empty'
  if(!confirmNewPassword.value) errors.value.confirmNewPassword = 'Confirm New Password cannot be empty'
  if(Object.values(errors.value).filter(x => Boolean(x)).length){
    toast.error('Invalid password data')
    return;
  }
  if(newPassword.value !== confirmNewPassword.value){
    toast.error("Password don't match")
    return
  }
  data.oldPassword = oldPassword.value
  data.password = newPassword.value
  data.passwordConfirm = confirmNewPassword.value
  changingPassword.value = true
  toast.toastOriginal.promise(makeAuthenticatedRequest({ url: `users/records/${user.value.id}`, method: 'PATCH', data, successMessage: 'Password Updated Successfully'}), {
    loading: 'Updating Password...',
    success: () => {
      oldPassword.value = newPassword.value
      return `Password Updated`
    },
    error: (data: any) => {
      console.log({data});
      return 'Error updating password'
    },
    finally: () => {
      changingPassword.value = false
    }
  })
}
</script>
<template>
  <div>
    <v-container>
      <v-row class="mt-8">
        <v-col cols="12"  sm="4">
          <v-card :elevation="0" class="py-8">
            <div class="d-flex align-center justify-center mb-8" >
              <UserAvatar />
            </div>
            <ProfileImageUploadModal />
            <div class="mt-8 px-8">
              <v-btn class="mt-8" block to="/" variant="outlined" prepend-icon="mdi-arrow-left" text="Home"></v-btn>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12"  sm="8">
          <v-card rounded>
            <v-card-title class="bg-primary white--text d-flex align-center text-h5">
              <v-icon class="mr-4">mdi-account</v-icon>
              <p>Profile Details</p>
              <v-spacer></v-spacer>
              <!-- <v-btn icon="mdi-close"></v-btn> -->
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" @keypress.enter="updateProfileDetails" :hint="errors.firstname" :error="Boolean(errors.firstname)" @focus="errors.firstname = ''" label="Firstname" v-model="firstname"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" @keypress.enter="updateProfileDetails" label="Lastname" v-model="lastname" :hint="errors.lastname" @focus="errors.lastname = ''" :error="Boolean(errors.lastname)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select variant="outlined" label="Gender" prepend-icon="mdi-gender-male-female" :items="genderOptions" v-model="gender"></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field variant="outlined" @keypress.enter="updateProfileDetails" label="Username" prepend-icon="mdi-at" v-model="username" @focus="errors.username = ''" :hint="errors.username" :error="Boolean(errors.username)"></v-text-field>
                </v-col>
                <!-- <v-col cols="12" sm="12">
                  <v-text-field readonly variant="solo-filled" label="Email" v-model="email"></v-text-field>
                </v-col> -->
                <v-col cols="12" sm="12">
                  <v-text-field readonly variant="solo-filled" label="Email" v-model="email">
                    <template #append>
                      <v-btn :loading="changingPassword || loading" variant="tonal" class="text-body-1" @click="changePassword = !changePassword" :append-icon="changePassword ? 'mdi-chevron-up' : 'mdi-chevron-down'">Change Password</v-btn>
                    </template>
                  </v-text-field>
                  <v-expand-transition>
                    <div v-if="changePassword">
                      <v-row>
                        <v-divider class="my-4"></v-divider>
                        <v-col cols="12" sm="6" class="pb-0">
                          <v-text-field :disabled="loading || changingPassword" variant="outlined" label="New Password" placeholder="******" type="password" v-model="newPassword" :hint="errors.newPassword" @focus="errors.newPassword = ''" :error="Boolean(errors.newPassword)"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" class="pb-0">
                          <v-text-field @keypress.enter="updatePassword" :disabled="loading || changingPassword" variant="outlined" label="Confirm New Password" placeholder="******" type="password" v-model="confirmNewPassword" :hint="errors.confirmNewPassword" @focus="errors.confirmNewPassword = ''" :error="Boolean(errors.confirmNewPassword)"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pt-0">
                          <div class="d-flex align-center">
                            <v-spacer></v-spacer>
                            <v-btn @click="updatePassword" :loading="changingPassword" :disabled="loading || changingPassword" class="bg-orange-darken-2 text-white text-body-1">Update Password</v-btn>
                          </div>
                        </v-col>
                      </v-row>
                    </div>
                  </v-expand-transition>
                </v-col>
              </v-row>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="reset" :disabled="loading || changingPassword" prepend-icon="mdi-restore" color="error" variant="text" class="mr-4">Reset</v-btn>
              <v-btn @click="updateProfileDetails" :loading="loading" :disabled="loading || changingPassword" prepend-icon="mdi-floppy" append-icon="mdi-send" color="primary" size="large" variant="elevated" class="px-4">Save</v-btn>
            </v-card-actions>
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
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
