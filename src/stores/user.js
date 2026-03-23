import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || 'null'))
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)

  function setUserInfo(info, userToken) {
    userInfo.value = info
    token.value = userToken
    localStorage.setItem('userInfo', JSON.stringify(info))
    localStorage.setItem('token', userToken)
  }

  function logout() {
    userInfo.value = null
    token.value = ''
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
  }

  return {
    userInfo,
    token,
    isLoggedIn,
    setUserInfo,
    logout
  }
})
