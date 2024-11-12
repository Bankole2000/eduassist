<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { env } from '../helpers/config';
import { storeToRefs } from 'pinia';
import defaultProfileImage from '../assets/images/default.jpg';
import { toast } from '@neoncoder/vuetify-sonner';
import { useRouter } from 'vue-router';
const {user} = storeToRefs(useAuthStore())
const { logout } = useAuthStore()
const router = useRouter()

const avatarUrl = computed(() => {
  if(user.value && user.value.avatar) return `${env.fileUrl}/users/${user.value.id}/${user.value.avatar}`
  else return defaultProfileImage
})

function signout(){
  logout()
  toast.toastOriginal.info("Logged out", {duration: 1000})
  router.push("/auth/login")
}

const menu = ref(false)
</script>

<template>
  <v-menu
    v-model="menu"
    location="top start"
    origin="top start"
    transition="scale-transition"
  >
    <template v-slot:activator="{ props }">
      <v-chip
        v-bind="props"
        link
        pill
        class="mr-16"
        size="large"
      >
        <v-avatar start>
          <v-img :src="avatarUrl"></v-img>
        </v-avatar>

        @{{ user?.username }}
      </v-chip>
    </template>

    <v-card width="300">
      <v-list bg-color="black">
        <v-list-item v-if="user">
          <template v-slot:prepend>
            <v-avatar :image="avatarUrl"></v-avatar>
          </template>

          <v-list-item-title>{{ user.firstname }} {{ user.lastname }}</v-list-item-title>

          <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>

          <template v-slot:append>
            <v-list-item-action>
              <v-btn
                variant="text"
                icon
                @click="menu = false"
              >
                <v-icon>mdi-close-circle</v-icon>
              </v-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>

      <v-list>
        <v-list-item link to="/profile">
          <template v-slot:prepend>
            <v-avatar icon="mdi-account-edit"></v-avatar>
          </template>
          <v-list-item-subtitle>Edit Profile</v-list-item-subtitle>
        </v-list-item>
        <v-list-item link @click="signout">
          <template v-slot:prepend>
            <v-avatar icon="mdi-logout"></v-avatar>
          </template>
          <v-list-item-subtitle>Logout</v-list-item-subtitle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
