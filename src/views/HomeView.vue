<template>
  <Layout>
    <div class="space-y-6">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido a tu Biblioteca Digital! 📚
          </h1>
          <p class="text-gray-600 mb-6">
            Gestiona tus libros, géneros y páginas de manera fácil y organizada.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
              <div class="flex items-center">
                <div class="text-blue-600 text-2xl mr-3">📖</div>
                <div>
                  <h3 class="text-lg font-semibold text-blue-900">Libros</h3>
                  <p class="text-blue-700">Gestiona tu colección de libros</p>
                </div>
              </div>
              <router-link 
                to="/libros" 
                class="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Ver Libros
              </router-link>
            </div>
            
            <div class="bg-green-50 p-6 rounded-lg">
              <div class="flex items-center">
                <div class="text-green-600 text-2xl mr-3">🏷️</div>
                <div>
                  <h3 class="text-lg font-semibold text-green-900">Géneros</h3>
                  <p class="text-green-700">Organiza por categorías</p>
                </div>
              </div>
              <router-link 
                to="/generos" 
                class="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Ver Géneros
              </router-link>
            </div>
            
            <div class="bg-purple-50 p-6 rounded-lg">
              <div class="flex items-center">
                <div class="text-purple-600 text-2xl mr-3">📄</div>
                <div>
                  <h3 class="text-lg font-semibold text-purple-900">Páginas</h3>
                  <p class="text-purple-700">Crea y edita contenido</p>
                </div>
              </div>
              <router-link 
                to="/paginas" 
                class="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
              >
                Ver Páginas
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="ts">
import Layout from '@/components/Layout.vue'
</script>
