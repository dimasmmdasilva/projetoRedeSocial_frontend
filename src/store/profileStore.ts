import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../config/axiosConfig.js'
import { useAuthStore } from './authStore.js'

console.log('[ProfileStore] Inicializando Profile Store...')

export const useProfileStore = defineStore('profile', () => {
    const authStore = useAuthStore()

    const isLoading = ref(false)
    const errorMessage = ref('')
    const successMessage = ref('')

    const updateProfileImage = async (imageFile: File): Promise<boolean> => {
        if (!imageFile) {
            console.warn('[ProfileStore] Nenhuma imagem foi selecionada.')
            return false
        }

        console.log(
            '[ProfileStore] Iniciando atualização da imagem de perfil...'
        )
        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''

        const formData = new FormData()
        formData.append('profile_image', imageFile)

        try {
            console.log(
                '[ProfileStore] Enviando requisição para atualização da imagem de perfil...'
            )
            const response = await api.put(
                '/api/user/profile-image/',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            )

            if (authStore.user) {
                authStore.user.profile_image = response.data.profile_image
                localStorage.setItem('user', JSON.stringify(authStore.user))
            }

            successMessage.value = 'Imagem de perfil atualizada com sucesso!'
            console.log(
                '[ProfileStore] Imagem de perfil atualizada:',
                response.data.profile_image
            )
            return true
        } catch (error: any) {
            console.error(
                '[ProfileStore] Erro ao atualizar a imagem:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.detail ||
                'Erro ao atualizar a imagem do perfil.'
            return false
        } finally {
            isLoading.value = false
            console.log(
                '[ProfileStore] Finalizado processo de atualização da imagem de perfil.'
            )
        }
    }

    const updateBio = async (bio: string): Promise<boolean> => {
        if (!bio.trim()) {
            console.warn(
                '[ProfileStore] Tentativa de atualização com biografia vazia.'
            )
            return false
        }

        console.log(`[ProfileStore] Atualizando biografia para: "${bio}"`)
        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''

        try {
            console.log(
                '[ProfileStore] Enviando requisição para atualização da biografia...'
            )
            const response = await api.put('/api/user/update-bio/', { bio })

            if (authStore.user) {
                authStore.user.bio = response.data.bio
                localStorage.setItem('user', JSON.stringify(authStore.user))
            }

            successMessage.value = 'Biografia atualizada com sucesso!'
            console.log(
                '[ProfileStore] Biografia atualizada:',
                response.data.bio
            )
            return true
        } catch (error: any) {
            console.error(
                '[ProfileStore] Erro ao atualizar biografia:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.detail || 'Erro ao atualizar a biografia.'
            return false
        } finally {
            isLoading.value = false
            console.log(
                '[ProfileStore] Finalizado processo de atualização da biografia.'
            )
        }
    }

    return {
        isLoading,
        errorMessage,
        successMessage,
        updateProfileImage,
        updateBio
    }
})
