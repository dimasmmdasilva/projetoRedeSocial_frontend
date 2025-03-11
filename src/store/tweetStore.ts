import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import api from '../config/axiosConfig.js'

console.log('[TweetStore] Inicializando Tweet Store...')

interface Tweet {
    id: number
    content: string
    created_at: string
    likes_count: number
    is_liked: boolean
    author: {
        id: number
        username: string
        profile_image?: string
    }
}

export const useTweetStore = defineStore('tweet', () => {
    const tweets = ref<Tweet[]>(
        JSON.parse(localStorage.getItem('tweets') || '[]')
    )
    const isLoading = ref(false)
    const errorMessage = ref('')

    // Sincroniza tweets no localStorage apenas quando há mudanças significativas
    watch(
        tweets,
        newTweets => {
            if (newTweets.length) {
                console.log(
                    '[TweetStore] Atualizando localStorage com novos tweets:',
                    newTweets
                )
                localStorage.setItem('tweets', JSON.stringify(newTweets))
            }
        },
        { deep: true }
    )

    const fetchFollowingTweets = async (): Promise<boolean> => {
        console.log('[TweetStore] Buscando tweets dos usuários seguidos...')
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.get<Tweet[]>('/api/tweets/following/')
            tweets.value = response.data
            console.log(
                '[TweetStore] Tweets carregados com sucesso:',
                response.data
            )
            return true
        } catch (error: any) {
            console.error(
                '[TweetStore] Erro ao buscar tweets:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.detail ||
                'Erro ao carregar tweets dos usuários seguidos.'
            return false
        } finally {
            isLoading.value = false
            console.log('[TweetStore] Finalizada a busca de tweets.')
        }
    }

    const createTweet = async (content: string): Promise<boolean> => {
        if (!content.trim()) {
            console.warn('[TweetStore] Tentativa de criação de tweet vazio.')
            return false
        }

        console.log(`[TweetStore] Criando tweet: "${content}"`)
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.post<Tweet>('/api/tweets/', { content })
            tweets.value.unshift(response.data)
            console.log('[TweetStore] Tweet criado com sucesso:', response.data)
            return true
        } catch (error: any) {
            console.error(
                '[TweetStore] Erro ao criar tweet:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.detail || 'Erro ao criar tweet.'
            return false
        } finally {
            isLoading.value = false
            console.log('[TweetStore] Finalizado processo de criação de tweet.')
        }
    }

    const toggleLike = async (tweetId: number): Promise<boolean> => {
        console.log(`[TweetStore] Alternando curtida para tweet ID ${tweetId}`)
        const tweet = tweets.value.find(t => t.id === tweetId)
        if (!tweet) {
            console.warn('[TweetStore] Tweet não encontrado:', tweetId)
            return false
        }

        // Atualiza UI imediatamente antes de chamada à API
        tweet.is_liked = !tweet.is_liked
        tweet.likes_count += tweet.is_liked ? 1 : -1

        try {
            const action = tweet.is_liked ? 'like' : 'unlike'
            await api.post(`/api/tweets/${tweetId}/${action}/`)
            console.log(
                `[TweetStore] Tweet ${tweet.is_liked ? 'curtido' : 'descurtido'} com sucesso!`
            )
            return true
        } catch (error: any) {
            console.error(
                '[TweetStore] Erro ao curtir/descurtir tweet:',
                error.response?.status,
                error.response?.data
            )
            errorMessage.value =
                error.response?.data?.detail ||
                'Erro ao curtir/descurtir o tweet.'

            // Reverte UI em caso de erro
            tweet.is_liked = !tweet.is_liked
            tweet.likes_count += tweet.is_liked ? 1 : -1
            return false
        }
    }

    return {
        tweets,
        isLoading,
        errorMessage,
        fetchFollowingTweets,
        createTweet,
        toggleLike
    }
})
