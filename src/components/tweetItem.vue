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

    const isLiked = ref(props.tweet.is_liked)
    const likeCount = ref(props.tweet.likes_count)
    const isProcessing = ref(false)

    const isAuthor = computed(
        () => authStore.user?.id === props.tweet.author.id
    )

    const toggleLike = async () => {
        if (isProcessing.value) return
        isProcessing.value = true

        console.log(`[TweetItem] Interação com o tweet ID ${props.tweet.id}`)

        try {
            isLiked.value = !isLiked.value
            likeCount.value += isLiked.value ? 1 : -1

            await tweetStore.toggleLike(props.tweet.id)
            console.log(
                `[TweetItem] Tweet ${isLiked.value ? 'curtido' : 'descurtido'} com sucesso!`
            )
        } catch (error) {
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

    const deleteTweet = async () => {
        if (!confirm('Tem certeza que deseja excluir este tweet?')) return

        console.log(`[TweetItem] Excluindo tweet ID ${props.tweet.id}...`)

        try {
            await tweetStore.deleteTweet(props.tweet.id)
            console.log(
                `[TweetItem] Tweet ID ${props.tweet.id} excluído com sucesso.`
            )
        } catch (error) {
            console.error(`[TweetItem] Erro ao excluir tweet:`, error)
        }
    }

    onMounted(() => {
        console.log(`[TweetItem] Montando tweet ID: ${props.tweet.id}`)
        console.log(`[TweetItem] Autor: ${props.tweet.author.username}`)
        console.log(`[TweetItem] Conteúdo: "${props.tweet.content}"`)
        console.log(
            `[TweetItem] Criado há: ${formatDistanceToNow(new Date(props.tweet.created_at), { addSuffix: true, locale: ptBR })}`
        )
        console.log(`[TweetItem] Total de curtidas: ${likeCount.value}`)
    })
</script>

<template>
    <v-card class="mb-4 pa-4 w-100" elevation="3" max-width="580px">
        <v-card-title class="d-flex justify-space-between align-center">
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

            <v-btn
                v-if="isAuthor"
                variant="text"
                color="red"
                size="x-small"
                icon="mdi-delete"
                @click="deleteTweet"
            />
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
