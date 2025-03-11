<script setup>
    import { onMounted, ref, computed } from 'vue'
    import { useUserStore } from '../store/userStore'
    import { useFollowStore } from '../store/followStore'
    import { storeToRefs } from 'pinia'

    const userStore = useUserStore()
    const followStore = useFollowStore()

    const { users, isLoading, errorMessage } = storeToRefs(userStore)
    const alertMessage = ref('')
    const selectedUserId = ref(null)

    // Log ao carregar o componente
    onMounted(async () => {
        console.log('[UserList] Carregando lista de usuários...')
        try {
            await userStore.fetchUsers()
            console.log('[UserList] Lista de usuários carregada:', users.value)
        } catch (error) {
            console.error('[UserList] Erro ao carregar usuários:', error)
        }
    })

    const handleFollow = async userId => {
        console.log(`[UserList] Tentando seguir usuário ID ${userId}`)

        if (followStore.isFollowing(userId)) {
            alertMessage.value = 'Você quer parar de seguir essa pessoa?'
            selectedUserId.value = userId
            return
        }

        try {
            await followStore.toggleFollow(userId)
            console.log(`[UserList] Usuário ID ${userId} seguido com sucesso!`)
        } catch (error) {
            console.error(
                `[UserList] Erro ao seguir usuário ID ${userId}:`,
                error
            )
        }
    }

    const handleUnfollow = async () => {
        if (!selectedUserId.value) return

        console.log(
            `[UserList] Tentando parar de seguir usuário ID ${selectedUserId.value}`
        )

        try {
            await followStore.toggleFollow(selectedUserId.value)
            console.log(
                `[UserList] Parou de seguir usuário ID ${selectedUserId.value}`
            )
        } catch (error) {
            console.error(
                `[UserList] Erro ao parar de seguir usuário ID ${selectedUserId.value}:`,
                error
            )
        } finally {
            alertMessage.value = ''
            selectedUserId.value = null
        }
    }

    const isFollowing = userId => {
        return followStore.isFollowing(userId)
    }
</script>

<template>
    <v-card
        class="fill-height pa-4 d-flex flex-column align-center w-100"
        elevation="3"
        color="blue-lighten-4"
    >
        <v-card-title class="text-center text-h6 font-weight-bold">
            Lista de Usuários
        </v-card-title>

        <v-divider class="my-2" />

        <v-alert v-if="errorMessage" type="error" class="mb-2">
            {{ errorMessage }}
        </v-alert>

        <v-list v-if="!isLoading && users.length" class="w-100">
            <v-list-item v-for="user in users" :key="user.id">
                <v-avatar size="40" class="mr-3">
                    <img
                        :src="
                            user.profile_image ||
                            'https://via.placeholder.com/40'
                        "
                        alt="Profile"
                    />
                </v-avatar>

                <v-list-item-content>
                    <v-list-item-title class="font-weight-bold">
                        {{ user.username }}
                    </v-list-item-title>
                </v-list-item-content>

                <v-btn
                    v-if="!isFollowing(user.id)"
                    color="primary"
                    size="small"
                    :loading="followStore.isLoading"
                    @click="handleFollow(user.id)"
                >
                    Seguir
                </v-btn>

                <v-btn
                    v-else
                    color="secondary"
                    size="small"
                    :loading="followStore.isLoading"
                    @click="handleFollow(user.id)"
                >
                    Seguindo
                </v-btn>

                <v-divider class="mt-2"></v-divider>
            </v-list-item>
        </v-list>

        <v-dialog v-model="alertMessage" persistent max-width="400">
            <v-card>
                <v-card-title class="headline">Confirmar Ação</v-card-title>
                <v-card-text>{{ alertMessage }}</v-card-text>
                <v-card-actions class="d-flex justify-space-between">
                    <v-btn color="red" @click="handleUnfollow">Sim</v-btn>
                    <v-btn color="grey" @click="alertMessage = ''"
                        >Cancelar</v-btn
                    >
                </v-card-actions>
            </v-card>
        </v-dialog>

        <p v-if="isLoading" class="text-center mt-4">Carregando usuários...</p>

        <p v-if="!isLoading && users.length === 0" class="text-center mt-4">
            Nenhum usuário encontrado.
        </p>
    </v-card>
</template>
