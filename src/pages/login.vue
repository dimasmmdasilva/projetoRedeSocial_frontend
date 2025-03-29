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
        errorMessage.value = ''
        isLoading.value = true

        if (!username.value || !password.value) {
            errorMessage.value = 'Preencha todos os campos.'
            isLoading.value = false
            return
        }

        try {
            const success = await authStore.login(
                username.value,
                password.value
            )
            if (success) {
                router.push('/dashboard')
            } else {
                errorMessage.value = 'Credenciais inválidas.'
            }
        } catch (error) {
            errorMessage.value =
                error.response?.data?.error || 'Erro ao fazer login.'
        } finally {
            isLoading.value = false
        }
    }
</script>

<template>
    <div class="login-page">
        <div class="bg-layer bg1"></div>
        <div class="bg-layer bg2"></div>
        <div class="bg-layer bg3"></div>

        <div class="login-content">
            <v-card class="pa-6 pb-4" width="420" elevation="8" rounded="lg">
                <v-card-title class="text-center text-h5 font-weight-bold">
                    Bem vindo
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
                        <router-link to="/register">
                            Cadastre-se aqui
                        </router-link>
                    </p>
                </v-card-actions>
            </v-card>
        </div>
    </div>
</template>

<style scoped>
    .login-page {
        position: fixed;
        inset: 0;
        overflow: hidden;
        width: 100vw;
        height: 100vh;
        z-index: 0;
    }

    .login-content {
        position: absolute;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1;
    }

    .bg-layer {
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        opacity: 0.5;
        transform: skewX(-20deg);
        z-index: 0;
        animation: slide-diagonal 6s ease-in-out infinite alternate;
        background-size: 300% 300%;
        background-repeat: no-repeat;
    }

    .bg1 {
        background-image: linear-gradient(
            -60deg,
            #add8e6 20%,
            transparent 20%,
            transparent 40%,
            #add8e6 40%,
            #add8e6 60%,
            transparent 60%,
            transparent 80%,
            #add8e6 80%
        );
        animation-duration: 8s;
    }

    .bg2 {
        background-image: linear-gradient(
            -60deg,
            #005f99 20%,
            transparent 20%,
            transparent 40%,
            #005f99 40%,
            #005f99 60%,
            transparent 60%,
            transparent 80%,
            #005f99 80%
        );
        animation-duration: 10s;
        animation-direction: alternate-reverse;
    }

    .bg3 {
        background-image: linear-gradient(
            -60deg,
            #d3d3d3 20%,
            transparent 20%,
            transparent 40%,
            #d3d3d3 40%,
            #d3d3d3 60%,
            transparent 60%,
            transparent 80%,
            #d3d3d3 80%
        );
        animation-duration: 12s;
    }

    @keyframes slide-diagonal {
        0% {
            transform: translateX(-20%) skewX(-20deg);
        }
        100% {
            transform: translateX(20%) skewX(-20deg);
        }
    }
</style>
