import { defineStore } from "pinia";
import { User } from "../types/user.types";
import { ref } from "vue";
import { makeRequest, RequestMethod } from "../helpers/fetch";
import { toast } from "@neoncoder/vuetify-sonner";

type AuthRequestOptions = {
  url: string
  method?: RequestMethod
  data?: any, 
  type?: 'JSON' | 'FormData',
  successMessage?: string,
  errorMessage?: string,
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const oldPassword = ref<string>("")
  const token = ref<String | null>(null)

  const makeAuthenticatedRequest = ({url, method = 'GET', data = {}, type = 'JSON', successMessage = 'Success', errorMessage = 'Error'}: AuthRequestOptions, showToast: boolean = true): Promise<any> => {
    return new Promise(async (resolve, reject) => {
      const headers = { authorization:  `Bearer ${token.value}`}
      try {   
        const response = await makeRequest({url, body: data, method, headers}, type)
        if(['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)){
          if (showToast) {
            if(response.code) {
              toast.error(errorMessage ? errorMessage : response.message, {cardTextProps: {style: {minWidth: '300px'}}})
            } else {
              toast.success(successMessage, {cardTextProps: {style: {minWidth: '300px'}}})
            }
          }
        }
        if(response.code){
          reject(response)
        } else {
          resolve(response)
        }
      } catch (err: any) {
        console.log({err})
        if(showToast){
          toast.error(err.message ?? errorMessage, {cardTextProps: {style: {minWidth: '300px'}}})
        }
        reject(err)
      }
    });
  }

  const login = async ({identity, password}: {identity: string, password: string}) => {
    try {
      const response: {record: User, token: string} = await makeAuthenticatedRequest({ url: 'users/auth-with-password', data: {identity, password}, method: 'POST', successMessage: 'Logged In successfully'})
      console.log({response});
      user.value = response.record
      token.value = response.token
      oldPassword.value = password
    } catch (error: any) {
      console.log({error})
      user.value = null
      token.value = null
      oldPassword.value = ""
    }
  }

  const logout = () => {
    return new Promise((resolve, reject) => {
      user.value = null
      token.value = null
      if(!user.value && !token.value){
        resolve('Logged out successfully')
      } else {
        reject('Error logging out')
      }
    })
  }
  return {
    user,
    token,
    oldPassword,
    makeAuthenticatedRequest,
    login,
    logout,
  }
})