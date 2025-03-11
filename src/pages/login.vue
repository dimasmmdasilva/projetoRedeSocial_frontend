<script setup>
    import { ref } from 'vue'
    import { useAuthStore } from '../store/authStore'
    import { useRouter } from 'vue-router'

    const authStore = useAuthStore()
    const router = useRouter()

    const username = ref('')
    const password = ref('')
    const errorMessage = ref('')
    const isLoading = ref(false)

    const handleLogin = async () => {
        console.log('[Login] Iniciando login do usuário:', username.value)
        errorMessage.value = ''
        isLoading.value = true

        if (!username.value || !password.value) {
            errorMessage.value = 'Preencha todos os campos.'
            isLoading.value = false
            return
        }

        try {
            await authStore.login(username.value, password.value)
            console.log(
                '[Login] Login bem-sucedido! Redirecionando para o dashboard...'
            )
            router.push('/dashboard')
        } catch (error) {
            console.error('[Login] Erro ao fazer login:', error)
            errorMessage.value =
                error.response?.data?.error || 'Erro ao fazer login.'
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card class="pa-6 pb-4" width="420" elevation="8" rounded="lg">
            <v-card-title class="text-center text-h5 font-weight-bold">
                Login
            </v-card-title>

            <v-form
                @submit.prevent="handleLogin"
                class="d-flex flex-column align-center"
            >
                <v-text-field
                    v-model="username"
                    label="Nome do Usuário"
                    variant="outlined"
                    density="comfortable"
                    class="mt-4 w-75"
                    :rules="[v => !!v || 'Este campo é obrigatório']"
                />
                <v-text-field
                    v-model="password"
                    label="Senha"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                    class="w-75"
                    :rules="[v => !!v || 'Este campo é obrigatório']"
                />
                <v-alert v-if="errorMessage" type="error" class="mb-2 w-75">
                    {{ errorMessage }}
                </v-alert>
                <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                    size="large"
                    class="mt-3 w-75"
                >
                    Entrar
                </v-btn>
            </v-form>

            <v-card-actions class="justify-center">
                <p class="text-caption">
                    Não tem uma conta?
                    <router-link to="/register">Cadastre-se aqui</router-link>
                </p>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
