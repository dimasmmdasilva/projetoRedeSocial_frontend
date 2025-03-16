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
    const tweets = ref<Tweet[]>([])
    const isLoading = ref(false)
    const errorMessage = ref('')

    // Sincroniza tweets no localStorage quando há mudanças
    watch(
        tweets,
        newTweets => {
            console.log(
                '[TweetStore] Atualizando localStorage com novos tweets:',
                newTweets
            )
            localStorage.setItem('tweets', JSON.stringify(newTweets))
        },
        { deep: true }
    )

    const fetchFollowingTweets = async (): Promise<boolean> => {
        console.log('[TweetStore] Buscando tweets dos usuários seguidos...')
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await api.get<Tweet[]>('/tweets/following/')

            if (response.data.length) {
                tweets.value = response.data
                localStorage.setItem('tweets', JSON.stringify(response.data))
            }

            console.log(
                `[TweetStore] ${response.data.length} tweets carregados.`
            )

            return true
        } catch (error: any) {
            console.error('[TweetStore] Erro ao buscar tweets:', error)

            errorMessage.value =
                error.response?.data?.message || 'Erro ao carregar tweets.'
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
            const response = await api.post<Tweet>('/tweets/', { content })
            tweets.value.unshift(response.data)
            localStorage.setItem('tweets', JSON.stringify(tweets.value))

            console.log('[TweetStore] Tweet criado com sucesso:', response.data)
            return true
        } catch (error: any) {
            console.error('[TweetStore] Erro ao criar tweet:', error)

            errorMessage.value =
                error.response?.data?.message || 'Erro ao criar tweet.'
            return false
        } finally {
            isLoading.value = false
            console.log('[TweetStore] Finalizado processo de criação de tweet.')
        }
    }

    const deleteTweet = async (tweetId: number): Promise<boolean> => {
        console.log(`[TweetStore] Tentando excluir tweet ID ${tweetId}`)

        const tweetIndex = tweets.value.findIndex(t => t.id === tweetId)
        if (tweetIndex === -1) {
            console.warn('[TweetStore] Tweet não encontrado:', tweetId)
            return false
        }

        try {
            await api.delete(`/tweets/${tweetId}/`)
            tweets.value.splice(tweetIndex, 1)
            localStorage.setItem('tweets', JSON.stringify(tweets.value))

            console.log(
                `[TweetStore] Tweet ID ${tweetId} excluído com sucesso.`
            )
            return true
        } catch (error: any) {
            console.error('[TweetStore] Erro ao excluir tweet:', error)

            errorMessage.value =
                error.response?.data?.message || 'Erro ao excluir tweet.'
            return false
        }
    }

    const toggleLike = async (tweetId: number): Promise<boolean> => {
        console.log(`[TweetStore] Alternando curtida para tweet ID ${tweetId}`)

        const tweet = tweets.value.find(t => t.id === tweetId)
        if (!tweet) {
            console.warn('[TweetStore] Tweet não encontrado:', tweetId)
            return false
        }

        tweet.is_liked = !tweet.is_liked
        tweet.likes_count += tweet.is_liked ? 1 : -1

        try {
            const action = tweet.is_liked ? 'like' : 'unlike'
            await api.post(`/tweets/${tweetId}/${action}/`)

            console.log(
                `[TweetStore] Tweet ${tweet.is_liked ? 'curtido' : 'descurtido'} com sucesso!`
            )
            return true
        } catch (error: any) {
            console.error('[TweetStore] Erro ao curtir/descurtir tweet:', error)

            errorMessage.value =
                error.response?.data?.message ||
                'Erro ao curtir/descurtir o tweet.'

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
        deleteTweet,
        toggleLike
    }
})
