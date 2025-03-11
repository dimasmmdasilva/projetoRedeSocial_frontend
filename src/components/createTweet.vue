<script setup>
    import { ref } from 'vue'
    import { useTweetStore } from '../store/tweetStore'

    const tweetStore = useTweetStore()
    const newTweetContent = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')

    const handleCreateTweet = async () => {
        console.log('[CreateTweet] Tentando criar um tweet...')

        if (!newTweetContent.value.trim()) {
            errorMessage.value = 'O tweet não pode estar vazio.'
            console.warn('[CreateTweet] Tentativa de tweet vazio bloqueada.')
            return
        }

        errorMessage.value = ''
        successMessage.value = ''

        try {
            console.log(
                `[CreateTweet] Enviando tweet: "${newTweetContent.value}"`
            )
            await tweetStore.createTweet(newTweetContent.value)
            console.log('[CreateTweet] Tweet enviado com sucesso!')

            newTweetContent.value = ''
            successMessage.value = 'Tweet publicado com sucesso!'
        } catch (error) {
            console.error('[CreateTweet] Erro ao criar tweet:', error)
            errorMessage.value =
                error.response?.data?.message || 'Erro ao enviar tweet.'
        }
    }
</script>

<template>
    <v-card max-width="800px" elevation="3" class="pa-4 w-100">
        <v-card-title class="text-center text-h6 font-weight-bold">
            Novo Tweet
        </v-card-title>

        <v-card-text>
            <v-textarea
                v-model="newTweetContent"
                label="Escreva suas ideias..."
                variant="outlined"
                rows="3"
                counter="280"
                auto-grow
            />

            <v-alert v-if="errorMessage" type="error" class="mt-2">
                {{ errorMessage }}
            </v-alert>

            <v-alert v-if="successMessage" type="success" class="mt-2">
                {{ successMessage }}
            </v-alert>

            <v-btn
                color="primary"
                :disabled="tweetStore.isLoading || !newTweetContent.trim()"
                class="mt-2 w-25"
                @click="handleCreateTweet"
            >
                {{ tweetStore.isLoading ? 'Enviando...' : 'Tweetar' }}
            </v-btn>
        </v-card-text>
    </v-card>
</template>
