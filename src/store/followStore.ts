import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../config/axiosConfig.js'
import { useAuthStore } from './authStore.js'

console.log('[FollowStore] Inicializando Follow Store...')

export const useFollowStore = defineStore('follow', () => {
    const authStore = useAuthStore()
    const isLoading = ref(false)
    const errorMessage = ref('')

    const toggleFollow = async (userId: number): Promise<boolean> => {
        console.log(
            `[FollowStore] Tentando seguir/desseguir usuário ID: ${userId}`
        )

        if (!authStore.user) {
            console.warn(
                '[FollowStore] Nenhum usuário autenticado para seguir/desseguir.'
            )
            return false
        }

        const currentlyFollowing = isFollowing(userId)

        try {
            isLoading.value = true
            errorMessage.value = ''

            const response = await api.post(`/users/${userId}/follow/`)
            console.log(`[FollowStore] Requisição bem-sucedida:`, response.data)

            if (currentlyFollowing) {
                authStore.user.following = authStore.user.following.filter(
                    u => u.id !== userId
                )
                authStore.user.following_count = Math.max(
                    0,
                    (authStore.user.following_count || 0) - 1
                )
                console.log(
                    `[FollowStore] Usuário ID ${userId} removido da lista de seguidos.`
                )
            } else {
                authStore.user.following.push({ id: userId })
                authStore.user.following_count =
                    (authStore.user.following_count || 0) + 1
                console.log(
                    `[FollowStore] Usuário ID ${userId} adicionado à lista de seguidos.`
                )
            }

            // Atualizar os dados do usuário autenticado no localStorage e no backend
            await authStore.fetchUserData()
            console.log(
                `[FollowStore] Dados do usuário atualizados após seguir/desseguir.`
            )

            return !currentlyFollowing
        } catch (error: any) {
            console.error(
                '[FollowStore] Erro ao seguir/desseguir usuário:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.message ||
                error.response?.data?.detail ||
                'Erro ao seguir/desseguir usuário.'

            return currentlyFollowing
        } finally {
            isLoading.value = false
            console.log(
                `[FollowStore] Finalizado processo de seguir/desseguir usuário ID ${userId}`
            )
        }
    }

    const isFollowing = (userId: number): boolean => {
        if (!authStore.user || !authStore.user.following) return false
        return authStore.user.following.some(u => u.id === userId)
    }

    return { isLoading, errorMessage, toggleFollow, isFollowing }
})
