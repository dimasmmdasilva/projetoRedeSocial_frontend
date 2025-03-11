<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useAuthStore } from '../store/authStore'
    import { useRouter } from 'vue-router'

    import UserProfile from '../components/userProfile.vue'
    import TweetFeed from '../components/tweetFeed.vue'
    import UserList from '../components/userList.vue'

    const authStore = useAuthStore()
    const router = useRouter()

    const isLoading = ref(true)
    const isAuthenticated = computed(() => !!authStore.token)

    onMounted(async () => {
        console.log('[Dashboard] Montando o painel...')

        if (!isAuthenticated.value) {
            console.warn(
                '[Dashboard] Usuário não autenticado! Redirecionando para login...'
            )
            router.push('/login')
        } else {
            console.log('[Dashboard] Usuário autenticado:', authStore.user)
            console.log('[Dashboard] Carregando dados do usuário...')

            try {
                await authStore.fetchUserData()
            } catch (error) {
                console.error(
                    '[Dashboard] Erro ao carregar dados do usuário:',
                    error
                )
            } finally {
                isLoading.value = false
            }
        }
    })
</script>

<template>
    <v-container fluid class="h-screen overflow-hidden pa-0 ma-0">
        <v-row class="fill-height d-flex justify-center">
            <!-- Perfil do Usuário -->
            <v-col cols="12" md="3" lg="3" class="pa-1">
                <v-sheet color="white">
                    <template v-if="!isLoading && authStore.user">
                        <UserProfile :userProfile="authStore.user" />
                    </template>
                    <v-progress-circular
                        v-else
                        indeterminate
                        color="primary"
                        class="d-block mx-auto"
                    />
                    <p class="text-caption text-center mt-2">
                        {{
                            isLoading
                                ? 'Carregando perfil do usuário...'
                                : 'Perfil carregado!'
                        }}
                    </p>
                </v-sheet>
            </v-col>

            <!-- Feed de Tweets -->
            <v-col cols="12" md="7" lg="7" class="pa-1">
                <v-sheet color="white" elevation="3">
                    <template v-if="!isLoading">
                        <TweetFeed />
                    </template>
                    <v-progress-circular
                        v-else
                        indeterminate
                        color="primary"
                        class="d-block mx-auto"
                    />
                    <p class="text-caption text-center mt-2">
                        {{
                            isLoading
                                ? 'Carregando feed de tweets...'
                                : 'Feed carregado!'
                        }}
                    </p>
                </v-sheet>
            </v-col>

            <!-- Lista de Usuários -->
            <v-col cols="12" md="2" lg="2" class="pa-1">
                <v-sheet color="white">
                    <template v-if="!isLoading">
                        <UserList />
                    </template>
                    <v-progress-circular
                        v-else
                        indeterminate
                        color="primary"
                        class="d-block mx-auto"
                    />
                    <p class="text-caption text-center mt-2">
                        {{
                            isLoading
                                ? 'Carregando lista de usuários...'
                                : 'Lista carregada!'
                        }}
                    </p>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>
