<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useTweetStore } from '../store/tweetStore'
    import { useAuthStore } from '../store/authStore'
    import { formatDistanceToNow } from 'date-fns'
    import { ptBR } from 'date-fns/locale'

    const props = defineProps({
        tweet: {
            type: Object,
            required: true
        }
    })

    const tweetStore = useTweetStore()
    const authStore = useAuthStore()

    // Estado local para curtidas
    const isLiked = ref(props.tweet.is_liked)
    const likeCount = ref(props.tweet.likes_count)
    const isProcessing = ref(false)

    const toggleLike = async () => {
        if (isProcessing.value) return
        isProcessing.value = true

        console.log(`[TweetItem] Interação com o tweet ID ${props.tweet.id}`)

        try {
            // Atualiza a UI imediatamente para melhor resposta do usuário
            isLiked.value = !isLiked.value
            likeCount.value += isLiked.value ? 1 : -1

            console.log(`[TweetItem] Curtindo/Descurtindo tweet...`)
            await tweetStore.toggleLike(props.tweet.id)
            console.log(
                `[TweetItem] Tweet ${isLiked.value ? 'curtido' : 'descurtido'} com sucesso!`
            )
        } catch (error) {
            // Reverte caso a requisição falhe
            isLiked.value = !isLiked.value
            likeCount.value += isLiked.value ? -1 : 1
            console.error(
                `[TweetItem] Erro ao curtir/descurtir o tweet:`,
                error
            )
        } finally {
            isProcessing.value = false
        }
    }

    // Log ao montar o componente
    onMounted(() => {
        console.log(`[TweetItem] Montando tweet ID: ${props.tweet.id}`)
        console.log(`[TweetItem] Autor: ${props.tweet.author.username}`)
        console.log(`[TweetItem] Conteúdo: "${props.tweet.content}"`)
        console.log(
            `[TweetItem] Criado há: ${formatDistanceToNow(
                new Date(props.tweet.created_at),
                {
                    addSuffix: true,
                    locale: ptBR
                }
            )}`
        )
        console.log(`[TweetItem] Total de curtidas: ${likeCount.value}`)
    })
</script>

<template>
    <v-card class="mb-4 pa-4 w-100" elevation="2" max-width="600px">
        <v-card-title class="d-flex align-center">
            <div>
                <span class="font-weight-bold">{{
                    tweet.author.username
                }}</span>
                <span class="text-caption text-grey-darken-1 ml-2">
                    •
                    {{
                        formatDistanceToNow(new Date(tweet.created_at), {
                            addSuffix: true,
                            locale: ptBR
                        })
                    }}
                </span>
            </div>
        </v-card-title>

        <v-card-text class="text-body-1">
            {{ tweet.content }}
        </v-card-text>

        <v-card-actions>
            <v-btn
                variant="text"
                color="primary"
                @click="toggleLike"
                :disabled="isProcessing"
            >
                <v-icon v-if="isLiked">mdi-heart</v-icon>
                <v-icon v-else>mdi-heart-outline</v-icon>
                <span class="ml-1">{{ likeCount }}</span>
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
