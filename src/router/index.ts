import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/LibrosView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/libros',
      name: 'libros',
      component: () => import('@/views/LibrosView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/libros/:id',
      name: 'libro-detail',
      component: () => import('@/views/LibroDetailView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/generos',
      name: 'generos',
      component: () => import('@/views/GenerosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/paginas',
      name: 'paginas',
      component: () => import('@/views/PaginasView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/libros/:id/paginas',
      name: 'libro-paginas',
      component: () => import('@/views/PaginasView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/mis-libros',
      name: 'mis-libros',
      component: () => import('@/views/MisLibrosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/favoritos',
      name: 'favoritos',
      component: () => import('@/views/FavoritosView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pendientes',
      name: 'pendientes',
      component: () => import('@/views/PendientesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },

  ],
})

// Guard de navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Solo redirigir si la ruta requiere autenticación y no está autenticado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
