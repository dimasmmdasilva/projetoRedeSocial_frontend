import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../config/axiosConfig.js'

interface User {
    id: number
    username: string
    followers: { id: number }[]
    followers_count: number
    profile_image?: string
    bio?: string
}

console.log('[AuthStore] Inicializando Auth Store...')

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null)
    const token = ref<string>('')
    const refreshTokenValue = ref<string>('')
    const isLoading = ref(false)
    const errorMessage = ref('')

    const isAuthenticated = computed(() => !!token.value)

    const loadAuthFromStorage = () => {
        console.log('[AuthStore] Carregando autenticação do localStorage...')
        try {
            const storedUser = localStorage.getItem('user')
            const storedToken = localStorage.getItem('token')
            const storedRefreshToken = localStorage.getItem('refresh_token')

            if (storedUser) {
                user.value = JSON.parse(storedUser)
                console.log('[AuthStore] Usuário carregado:', user.value)
            }

            if (storedToken) {
                token.value = storedToken
                setAuthHeader()
            }

            refreshTokenValue.value = storedRefreshToken || ''
        } catch (error) {
            console.error('[AuthStore] Erro ao carregar autenticação:', error)
        }
    }

    const setAuthHeader = () => {
        if (token.value) {
            api.defaults.headers.common['Authorization'] =
                `Bearer ${token.value}`
            console.log('[AuthStore] Token JWT configurado nos headers.')
        } else {
            delete api.defaults.headers.common['Authorization']
            console.log('[AuthStore] Token JWT removido dos headers.')
        }
    }

    const login = async (
        username: string,
        password: string
    ): Promise<boolean> => {
        console.log(`[AuthStore] Tentando login para usuário: ${username}`)
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.post('/auth/login/', {
                username,
                password
            })

            if (response.data.access) {
                token.value = response.data.access
                refreshTokenValue.value = response.data.refresh || ''
                user.value = response.data.user

                localStorage.setItem('token', token.value)
                localStorage.setItem('refresh_token', refreshTokenValue.value)
                localStorage.setItem('user', JSON.stringify(user.value))

                setAuthHeader()
                console.log('[AuthStore] Login bem-sucedido!')
                return true
            }
        } catch (error: any) {
            errorMessage.value =
                error.response?.data?.error || 'Usuário ou senha inválidos.'
            console.error('[AuthStore] Erro no login:', error)
        } finally {
            isLoading.value = false
        }

        return false
    }

    const logout = async () => {
        console.log('[AuthStore] Realizando logout...')
        try {
            await api.post('/auth/logout/', {
                refresh: refreshTokenValue.value
            })
        } catch (error) {
            console.warn('[AuthStore] Erro ao deslogar do servidor:', error)
        }

        token.value = ''
        refreshTokenValue.value = ''
        user.value = null

        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')

        setAuthHeader()
        console.log('[AuthStore] Usuário deslogado e tokens removidos.')

        setTimeout(() => {
            window.location.href = '/login'
        }, 300)
    }

    loadAuthFromStorage()

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        errorMessage,
        login,
        logout
    }
})
