<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const authStore = useAuthStore()

onMounted(async () => {
  console.log('App: Inicializando...')
  console.log('App: Token:', authStore.token)
  console.log('App: Usuario:', authStore.user)
  console.log('App: isAuthenticated:', authStore.isAuthenticated)

  // Verificar si hay un token válido al cargar la app
  if (authStore.token) {
    console.log('App: Token encontrado, obteniendo usuario actual...')
    await authStore.getCurrentUser()
  }
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
