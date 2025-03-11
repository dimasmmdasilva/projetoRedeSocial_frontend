<script setup>
    import { onMounted, computed } from 'vue'
    import { useTweetStore } from '../store/tweetStore'
    import TweetForm from '../components/createTweet.vue'
    import TweetItem from '../components/tweetItem.vue'
    import { storeToRefs } from 'pinia'

    const tweetStore = useTweetStore()
    const { tweets, isLoading, errorMessage } = storeToRefs(tweetStore)

    const hasTweets = computed(() => tweets.value.length > 0)

    onMounted(async () => {
        console.log('[TweetFeed] Iniciando carregamento de tweets...')
        try {
            await tweetStore.fetchFollowingTweets()
            console.log(`[TweetFeed] ${tweets.value.length} tweets carregados.`)
        } catch (error) {
            console.error('[TweetFeed] Erro ao carregar tweets:', error)
        }
    })
</script>

<template>
    <v-container fluid class="d-flex flex-column align-center">
        <TweetForm />
        <v-divider class="my-4" />

        <v-list max-width="600px" class="w-100">
            <template v-if="hasTweets">
                <TweetItem
                    v-for="tweet in tweets"
                    :key="tweet.id"
                    :tweet="tweet"
                />
            </template>
        </v-list>

        <p v-if="isLoading && !hasTweets" class="text-center mt-4">
            [TweetFeed] Carregando tweets...
        </p>

        <p v-if="!isLoading && !hasTweets" class="text-center mt-4">
            [TweetFeed] Nenhum tweet encontrado. Siga usuários para ver
            postagens!
        </p>

        <p v-if="errorMessage" class="text-center text-error mt-4">
            [TweetFeed] Erro: {{ errorMessage }}
        </p>
    </v-container>
</template>
