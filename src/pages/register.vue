<script setup>
    import { ref } from 'vue'
    import { useUserStore } from '../store/userStore'
    import { useRouter } from 'vue-router'

    const userStore = useUserStore()
    const router = useRouter()

    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)

    const handleSignUp = async () => {
        console.log('[Cadastro] Iniciando processo de registro...')
        errorMessage.value = ''
        successMessage.value = ''
        isLoading.value = true

        // Validações no frontend antes de enviar ao backend
        if (
            !username.value ||
            !email.value ||
            !password.value ||
            !confirmPassword.value
        ) {
            errorMessage.value = 'Todos os campos são obrigatórios.'
            isLoading.value = false
            return
        }

        if (password.value !== confirmPassword.value) {
            errorMessage.value = 'As senhas não coincidem.'
            isLoading.value = false
            return
        }

        try {
            const success = await userStore.registerUser(
                username.value,
                email.value,
                password.value,
                confirmPassword.value
            )

            if (success) {
                successMessage.value = 'Cadastro realizado com sucesso!'
                console.log(
                    '[Cadastro] Usuário cadastrado com sucesso! Redirecionando para login...'
                )

                setTimeout(() => {
                    router.push('/login')
                }, 1500)
            } else {
                errorMessage.value = 'Erro ao cadastrar.'
            }
        } catch (error) {
            console.error('[Cadastro] Erro ao cadastrar:', error)
            errorMessage.value =
                error.response?.data?.error || 'Erro ao cadastrar usuário.'
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <v-container class="fill-height d-flex justify-center align-center">
        <v-card class="pa-6 pb-4" width="420" elevation="8" rounded="lg">
            <v-card-title class="text-center text-h5 font-weight-bold">
                Cadastro
            </v-card-title>

            <v-form
                @submit.prevent="handleSignUp"
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
                    v-model="email"
                    label="E-mail"
                    type="email"
                    variant="outlined"
                    density="comfortable"
                    class="mt-2 w-75"
                    :rules="[v => !!v || 'Este campo é obrigatório']"
                />
                <v-text-field
                    v-model="password"
                    label="Senha"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                    class="mt-2 w-75"
                    :rules="[v => !!v || 'Este campo é obrigatório']"
                />
                <v-text-field
                    v-model="confirmPassword"
                    label="Confirmar Senha"
                    type="password"
                    variant="outlined"
                    density="comfortable"
                    class="mt-2 w-75"
                    :rules="[v => !!v || 'Este campo é obrigatório']"
                />

                <v-alert v-if="errorMessage" type="error" class="mb-2 w-75">
                    {{ errorMessage }}
                </v-alert>

                <v-alert v-if="successMessage" type="success" class="mb-2 w-75">
                    {{ successMessage }}
                </v-alert>

                <v-btn
                    color="primary"
                    type="submit"
                    :loading="isLoading"
                    size="small"
                    class="mt-3 w-75"
                >
                    {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
                </v-btn>
            </v-form>

            <v-card-actions class="justify-center">
                <p class="text-caption">
                    Já possui uma conta?
                    <router-link to="/login">Entre aqui</router-link>
                </p>
            </v-card-actions>
        </v-card>
    </v-container>
</template>
