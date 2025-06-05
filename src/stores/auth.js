// src/stores/auth.js
import { defineStore } from 'pinia'
import api from '../services/api'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const login = async (credentials) => {
    try {
      const response = await api.post('auth/login', credentials)
      setToken(response.data.token)
      setUser(response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('auth/register', userData)
      setToken(response.data.token)
      setUser(response.data.user)
      return response.data
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.post('auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setToken(null)
      setUser(null)
    }
  }

  const getUser = async () => {
    try {
      const response = await api.get('user')
      setUser(response.data)
      return response.data
    } catch (error) {
      setToken(null)
      setUser(null)
      throw error
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    getUser,
  }
})
