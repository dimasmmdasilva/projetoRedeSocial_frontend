import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../config/axiosConfig.js'

interface User {
    id: number
    username: string
    followers: { id: number }[]
    following: { id: number }[]
    followers_count: number
    following_count: number
    profile_image?: string
    bio?: string
}

console.log('[AuthStore] Inicializando Auth Store...')

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User>({
        id: 0,
        username: '',
        followers: [],
        following: [],
        followers_count: 0,
        following_count: 0,
        profile_image: '',
        bio: ''
    })
    const token = ref<string>('')
    const refreshTokenValue = ref<string>('')
    const isLoading = ref(false)
    const errorMessage = ref('')

    const isAuthenticated = computed(() => !!token.value)

    const loadAuthFromStorage = () => {
        console.log('[AuthStore] Carregando autenticação do localStorage...')
        try {
            const storedUser = localStorage.getItem('user')
            const storedToken = localStorage.getItem('token') ?? ''
            const storedRefreshToken =
                localStorage.getItem('refresh_token') ?? ''

            if (storedUser) {
                user.value = JSON.parse(storedUser)
                user.value.following = user.value.following || []
                user.value.followers = user.value.followers || []
                console.log('[AuthStore] Usuário carregado:', user.value)
            }

            token.value = storedToken
            refreshTokenValue.value = storedRefreshToken

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

    const fetchUserData = async () => {
        if (!token.value) {
            console.warn(
                '[AuthStore] Nenhum token disponível. Usuário não autenticado.'
            )
            return
        }

        console.log('[AuthStore] Buscando dados do usuário na API...')
        try {
            const response = await api.get('/user/detail/')
            user.value = response.data

            user.value.following = response.data.following || []
            user.value.followers = response.data.followers || []

            localStorage.setItem('user', JSON.stringify(user.value))
            console.log('[AuthStore] Dados do usuário atualizados:', user.value)
        } catch (error) {
            console.error('[AuthStore] Erro ao buscar dados do usuário:', error)
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
                token.value = response.data.access ?? ''
                refreshTokenValue.value = response.data.refresh ?? ''
                user.value = response.data.user

                user.value.following = response.data.user.following || []
                user.value.followers = response.data.user.followers || []

                localStorage.setItem('token', token.value)
                localStorage.setItem('refresh_token', refreshTokenValue.value)
                localStorage.setItem('user', JSON.stringify(user.value))

                setAuthHeader()
                console.log('[AuthStore] Login bem-sucedido!')
                await fetchUserData()
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
        user.value = {
            id: 0,
            username: '',
            followers: [],
            following: [],
            followers_count: 0,
            following_count: 0,
            profile_image: '',
            bio: ''
        }

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
        logout,
        fetchUserData
    }
})
