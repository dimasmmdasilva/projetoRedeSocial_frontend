import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../config/axiosConfig.js'
import { useAuthStore } from './authStore.js'

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

        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''

        const formData = new FormData()
        formData.append('profile_image', imageFile)

        try {
            const response = await api.put(
                '/user/update-profile-image/',
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            )

            if (authStore.user) {
                authStore.user.profile_image = response.data.profile_image
                localStorage.setItem('user', JSON.stringify(authStore.user))
            }

            successMessage.value = 'Imagem de perfil atualizada com sucesso!'
            return true
        } catch (error: unknown) {
            if (error instanceof Error) {
                errorMessage.value = error.message
            } else if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error
            ) {
                errorMessage.value =
                    (error as any).response?.data?.detail ||
                    'Erro ao atualizar a imagem do perfil.'
            }
            console.error('[ProfileStore] Erro no upload:', error)
            return false
        } finally {
            isLoading.value = false
        }
    }

    const updateBio = async (newBio: string): Promise<boolean> => {
        if (!newBio.trim()) {
            console.warn(
                '[ProfileStore] Tentativa de atualizar biografia com texto vazio.'
            )
            return false
        }

        isLoading.value = true
        errorMessage.value = ''
        successMessage.value = ''

        try {
            const response = await api.put('/user/update-bio/', {
                bio: newBio,
            })

            if (authStore.user) {
                authStore.user.bio = response.data.bio
                localStorage.setItem('user', JSON.stringify(authStore.user))
            }

            successMessage.value = 'Biografia atualizada com sucesso!'
            return true
        } catch (error: unknown) {
            if (error instanceof Error) {
                errorMessage.value = error.message
            } else if (
                typeof error === 'object' &&
                error !== null &&
                'response' in error
            ) {
                errorMessage.value =
                    (error as any).response?.data?.detail ||
                    'Erro ao atualizar a biografia.'
            }
            console.error('[ProfileStore] Erro ao atualizar bio:', error)
            return false
        } finally {
            isLoading.value = false
        }
    }

    return {
        isLoading,
        errorMessage,
        successMessage,
        updateProfileImage,
        updateBio,
    }
})
