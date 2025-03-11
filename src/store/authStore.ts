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

            token.value = storedToken || ''
            refreshTokenValue.value = storedRefreshToken || ''

            setAuthHeader()
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

    const login = async (username: string, password: string) => {
        console.log(`[AuthStore] Tentando login para usuário: ${username}`)
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.post('/auth/login/', {
                username,
                password
            })

            token.value = response.data.access || ''
            refreshTokenValue.value = response.data.refresh || ''
            user.value = {
                ...response.data.user,
                followers: response.data.user.followers || [],
                followers_count: response.data.user.followers_count || 0,
                profile_image: response.data.user.profile_image || '',
                bio: response.data.user.bio || ''
            }

            if (token.value) {
                localStorage.setItem('token', token.value)
                localStorage.setItem('refresh_token', refreshTokenValue.value)
                localStorage.setItem('user', JSON.stringify(user.value))
                console.log(
                    '[AuthStore] Login bem-sucedido! Token e usuário armazenados.'
                )
            }

            setAuthHeader()
        } catch (error: any) {
            errorMessage.value =
                error.response?.data?.error || 'Usuário ou senha inválidos.'
            console.error('[AuthStore] Erro no login:', error)
        } finally {
            isLoading.value = false
        }
    }

    const fetchUserData = async () => {
        console.log('[AuthStore] Atualizando dados do usuário...')

        if (!token.value) {
            console.warn(
                '[AuthStore] Nenhum token encontrado. Redirecionando para login...'
            )
            logout()
            return
        }

        try {
            const response = await api.get('/user/profile/')
            user.value = response.data
            localStorage.setItem('user', JSON.stringify(user.value))
            console.log('[AuthStore] Dados do usuário atualizados:', user.value)
        } catch (error) {
            console.error('[AuthStore] Erro ao buscar dados do usuário:', error)
            logout()
        }
    }

    const refreshToken = async () => {
        console.log('[AuthStore] Tentando atualizar token...')

        if (!refreshTokenValue.value) {
            console.warn(
                '[AuthStore] Nenhum refresh token disponível. Deslogando...'
            )
            logout()
            return
        }

        try {
            const response = await api.post('/auth/token/refresh/', {
                refresh: refreshTokenValue.value
            })

            token.value = response.data.access || ''
            localStorage.setItem('token', token.value)
            setAuthHeader()
            console.log('[AuthStore] Token atualizado com sucesso!')
        } catch (error) {
            console.error('[AuthStore] Erro ao atualizar token:', error)
            logout()
        }
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

        window.location.href = '/login'
    }

    api.interceptors.response.use(
        response => response,
        async error => {
            if (
                error.response?.status === 401 &&
                refreshTokenValue.value &&
                error.config &&
                !error.config._retry
            ) {
                console.warn('[AuthStore] Token expirado! Tentando renovar...')
                error.config._retry = true
                await refreshToken()
                return api(error.config)
            }
            console.error('[AuthStore] Erro na requisição:', error)
            return Promise.reject(error)
        }
    )

    loadAuthFromStorage()

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        errorMessage,
        login,
        logout,
        refreshToken,
        fetchUserData
    }
})
