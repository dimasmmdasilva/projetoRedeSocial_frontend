import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import Login from '../pages/login.vue'
import Register from '../pages/register.vue'
import Dashboard from '../pages/dashboard.vue'

console.log('[Router] Iniciando configuração das rotas...')

const routes = [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior: () => ({ top: 0 }),
})

console.log('[Router] Rotas configuradas:', routes)

router.beforeEach((to, _, next) => {
    console.log(`[Router] Tentando acessar a rota: ${to.path}`)

    const authStore = useAuthStore()
    const isAuthenticated = !!authStore.token

    if (to.meta.requiresAuth) {
        console.log('[Router] Esta rota requer autenticação')

        if (!isAuthenticated) {
            console.warn(
                '[Router] Acesso negado! Usuário não autenticado. Redirecionando para /login'
            )
            return next('/login')
        }

        console.log('[Router] Usuário autenticado! Permitindo acesso...')
    }

    next()
})

router.onError((error) => {
    console.error('[Router] Erro no roteamento:', error)
})

export default router
