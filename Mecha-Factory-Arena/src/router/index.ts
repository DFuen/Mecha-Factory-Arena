import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/garage',
    },
    {
      path: '/garage',
      name: 'garage',
      component: () => import('../views/GarageView.vue'),
    },
    {
      path: '/arena',
      name: 'arena',
      component: () => import('../views/ArenaView.vue'),
    },
    {
      path: '/combat',
      name: 'combat',
      component: () => import('../views/CombatView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

router.beforeEach((to) => {
  if (to.name === 'combat') {
    const hasAccess = sessionStorage.getItem('combatAccess') === '1'
    if (!hasAccess) {
      return { name: 'arena' }
    }
    sessionStorage.removeItem('combatAccess')
  }
  return true
})

export default router
