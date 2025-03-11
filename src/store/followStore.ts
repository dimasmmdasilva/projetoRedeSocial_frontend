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

            console.log(
                `[FollowStore] Enviando requisição para ${currentlyFollowing ? 'desseguir' : 'seguir'} usuário ID: ${userId}`
            )
            await api.post(`/api/follow/${userId}/`)

            if (currentlyFollowing) {
                authStore.user.followers = authStore.user.followers.filter(
                    u => u.id !== userId
                )
                authStore.user.followers_count = Math.max(
                    0,
                    authStore.user.followers_count - 1
                )
                console.log(
                    `[FollowStore] Usuário ID: ${userId} removido da lista de seguidores.`
                )
            } else {
                authStore.user.followers.push({ id: userId })
                authStore.user.followers_count += 1
                console.log(
                    `[FollowStore] Usuário ID: ${userId} adicionado à lista de seguidores.`
                )
            }

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
            return currentlyFollowing // Retorna o estado anterior caso ocorra erro
        } finally {
            isLoading.value = false
            console.log(
                `[FollowStore] Finalizado processo de seguir/desseguir usuário ID: ${userId}`
            )
        }
    }

    const isFollowing = (userId: number): boolean => {
        if (!authStore.user) return false
        const following =
            authStore.user.followers?.some(u => u.id === userId) || false
        console.log(
            `[FollowStore] Verificando se usuário ID: ${userId} está sendo seguido: ${following}`
        )
        return following
    }

    return { isLoading, errorMessage, toggleFollow, isFollowing }
})
