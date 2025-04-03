<script setup>
    import { ref } from 'vue'
    import { useTweetStore } from '../store/tweetStore'

    const tweetStore = useTweetStore()
    const newTweetContent = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const isProcessing = ref(false)
    const MAX_LENGTH = 200

    const handleCreateTweet = async () => {
        const content = newTweetContent.value.trim()

        if (!content) {
            errorMessage.value = 'não pode estar vazio'
            successMessage.value = ''
            clearMessage(errorMessage)
            return
        }

        if (content.length > MAX_LENGTH) {
            errorMessage.value = `não pode ter mais que ${MAX_LENGTH} caracteres`
            successMessage.value = ''
            clearMessage(errorMessage)
            return
        }

        errorMessage.value = ''
        successMessage.value = ''
        isProcessing.value = true

        try {
            const success = await tweetStore.createTweet(content)

            if (success) {
                newTweetContent.value = ''
                successMessage.value = 'publicado com sucesso!'
                clearMessage(successMessage)
            } else {
                errorMessage.value =
                    'Falha ao publicar a mensagem. Tente novamente.'
                clearMessage(errorMessage)
            }
        } catch (error) {
            errorMessage.value =
                error.response?.data?.message || 'Erro ao enviar a mensagem.'
            clearMessage(errorMessage)
        } finally {
            isProcessing.value = false
        }
    }

    const clearMessage = messageRef => {
        setTimeout(() => {
            messageRef.value = ''
        }, 3000)
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

            <v-alert
                v-if="errorMessage"
                type="error"
                class="mt-2"
                transition="fade-transition"
            >
                {{ errorMessage }}
            </v-alert>

            <v-alert
                v-if="successMessage"
                type="success"
                class="mt-2"
                transition="fade-transition"
            >
                {{ successMessage }}
            </v-alert>

            <v-btn
                color="primary"
                class="mt-2 w-25"
                :disabled="isProcessing || !newTweetContent.trim()"
                @click="handleCreateTweet"
            >
                {{ isProcessing ? 'enviando...' : 'postar' }}
            </v-btn>
        </v-card-text>
    </v-card>
</template>
