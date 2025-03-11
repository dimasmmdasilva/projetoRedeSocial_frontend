import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../config/axiosConfig.js'

console.log('[UserStore] Inicializando User Store...')

export const useUserStore = defineStore('user', () => {
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
            if (error.response) {
                console.error(
                    '[UserStore] Erro no registro:',
                    error.response.status,
                    error.response.data
                )

                // Se houver erros específicos no backend, exibir a primeira mensagem de erro encontrada
                const errorDetail =
                    error.response.data?.message ||
                    error.response.data?.detail ||
                    Object.values(error.response.data || {})
                        .flat()
                        .join(', ') ||
                    'Erro ao cadastrar usuário.'

                errorMessage.value = errorDetail
                return { success: false, message: errorDetail }
            } else {
                console.error('[UserStore] Erro inesperado no registro:', error)
                errorMessage.value = 'Erro desconhecido ao tentar registrar.'
                return {
                    success: false,
                    message: 'Erro desconhecido ao tentar registrar.'
                }
            }
        } finally {
            isLoading.value = false
            console.log('[UserStore] Cadastro finalizado.')
        }
    }

    return { isLoading, errorMessage, successMessage, registerUser }
})
