import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../config/axiosConfig.js'
import { useAuthStore } from './authStore.js'

console.log('[UserStore] Inicializando User Store...')

export const useUserStore = defineStore('user', () => {
    const authStore = useAuthStore()
    const users = ref<
        { id: number; username: string; profile_image?: string; bio?: string }[]
    >([])
    const isLoading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const registerUser = async (
        username: string,
        email: string,
        password: string,
        confirmPassword: string
    ): Promise<{ success: boolean; message: string }> => {
        console.log(`[UserStore] Tentando cadastrar usuário: ${username}`)
        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''

        try {
            if (password !== confirmPassword) {
                console.warn('[UserStore] Erro: As senhas não coincidem!')
                return { success: false, message: 'As senhas não coincidem!' }
            }

            const response = await api.post('/auth/register/', {
                username,
                email,
                password,
                confirm_password: confirmPassword
            })

            successMessage.value = 'Usuário cadastrado com sucesso!'
            console.log(
                '[UserStore] Cadastro realizado com sucesso:',
                response.data
            )
            return { success: true, message: 'Usuário cadastrado com sucesso!' }
        } catch (error: any) {
            console.error(
                '[UserStore] Erro no registro:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                Object.values(error.response?.data || {})
                    .flat()
                    .join(', ') ||
                'Erro ao cadastrar usuário.'
            return { success: false, message: errorMessage.value }
        } finally {
            isLoading.value = false
            console.log('[UserStore] Cadastro finalizado.')
        }
    }

    const fetchUsers = async (): Promise<boolean> => {
        console.log('[UserStore] Buscando lista de usuários...')
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.get('/users/list/')
            users.value = response.data
            console.log(
                `[UserStore] Lista de usuários carregada: ${users.value.length} usuários.`
            )
            return true
        } catch (error: any) {
            console.error(
                '[UserStore] Erro ao buscar usuários:',
                error.response?.data || error
            )
            errorMessage.value =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                'Erro ao carregar lista de usuários.'
            return false
        } finally {
            isLoading.value = false
        }
    }

    const fetchUserDetails = async (): Promise<boolean> => {
        console.log('[UserStore] Buscando detalhes do usuário autenticado...')
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.get('/user/detail/')
            authStore.user = response.data
            console.log(
                '[UserStore] Detalhes do usuário carregados:',
                response.data
            )
            return true
        } catch (error: any) {
            console.error(
                '[UserStore] Erro ao buscar detalhes do usuário:',
                error.response?.data || error
            )
            errorMessage.value =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                'Erro ao carregar detalhes do usuário.'
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        users,
        isLoading,
        errorMessage,
        successMessage,
        registerUser,
        fetchUsers,
        fetchUserDetails
    }
})
