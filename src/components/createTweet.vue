<script setup>
    import { ref } from 'vue'
    import { useTweetStore } from '../store/tweetStore'

    const tweetStore = useTweetStore()
    const newTweetContent = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const isProcessing = ref(false)

    const handleCreateTweet = async () => {
        console.log('[CreateTweet] Tentando criar um tweet...')

        if (!newTweetContent.value.trim()) {
            errorMessage.value = 'O tweet não pode estar vazio.'
            console.warn('[CreateTweet] Tentativa de tweet vazio bloqueada.')
            return
        }

        errorMessage.value = ''
        successMessage.value = ''
        isProcessing.value = true

        try {
            console.log(
                `[CreateTweet] Enviando tweet: "${newTweetContent.value}"`
            )
            const success = await tweetStore.createTweet(newTweetContent.value)

            if (success) {
                newTweetContent.value = ''
                successMessage.value = 'publicado com sucesso!'
                console.log('[CreateTweet] Mensagem enviada com sucesso!')
            } else {
                errorMessage.value =
                    'Falha ao publicar a mensagem. Tente novamente.'
            }
        } catch (error) {
            console.error('[CreateTweet] Erro ao criar a mensagem:', error)
            errorMessage.value =
                error.response?.data?.message || 'Erro ao enviar a mensagem.'
        } finally {
            isProcessing.value = false
        }
    }
</script>

<template>
    <v-card max-width="600px" elevation="3" class="pa-2 w-100">
        <v-card-title class="text-center text-h6 font-weight-bold">
            mensagem
        </v-card-title>

        <v-card-text>
            <v-textarea
                v-model="newTweetContent"
                label="escreva aqui..."
                variant="outlined"
                rows="3"
                counter="200"
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
                :disabled="isProcessing || !newTweetContent.trim()"
                class="mt-2 w-25"
                @click="handleCreateTweet"
            >
                {{ isProcessing ? 'enviando...' : 'postar' }}
            </v-btn>
        </v-card-text>
    </v-card>
</template>
