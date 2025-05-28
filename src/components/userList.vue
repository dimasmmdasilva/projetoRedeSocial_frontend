<script setup>
    import { onMounted, ref } from 'vue'
    import { useUserStore } from '../store/userStore'
    import { useFollowStore } from '../store/followStore'
    import { storeToRefs } from 'pinia'

    const userStore = useUserStore()
    const followStore = useFollowStore()

    const { users, isLoading, errorMessage } = storeToRefs(userStore)
    const alertMessage = ref(null)
    const selectedUserId = ref(null)

    onMounted(async () => {
        alertMessage.value = null
        selectedUserId.value = null

        console.log('[UserList] Carregando lista de usuários...')
        try {
            await userStore.fetchUsers()
            console.log('[UserList] Lista de usuários carregada:', users.value)
        } catch (error) {
            console.error('[UserList] Erro ao carregar usuários:', error)
        }
    })

    const handleFollow = async (userId) => {
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
            `[UserList] Parando de seguir usuário ID ${selectedUserId.value}`
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
            alertMessage.value = null
            selectedUserId.value = null
        }
    }

    const closeDialog = () => {
        alertMessage.value = null
        selectedUserId.value = null
    }
</script>

<template>
    <v-card
        class="fill-height d-flex flex-column align-center w-100"
        elevation="3"
        color="blue-lighten-4"
    >
        <v-divider class="my-2" />

        <v-alert v-if="errorMessage" type="error" class="mb-2">
            {{ errorMessage }}
        </v-alert>

        <v-list
            v-if="!isLoading && users.length"
            class="w-80"
            color="blue-lighten-4"
            elevation="0"
            style="background: none !important"
        >
            <v-list-item
                v-for="user in users"
                :key="user.id"
                class="d-flex flex-column align-center text-center py-2"
                style="background: none !important"
            >
                <v-avatar size="80" class="mb-1">
                    <img
                        :src="
                            user.profile_image ||
                            'https://via.placeholder.com/50'
                        "
                        alt="Profile"
                        style="
                            object-fit: cover;
                            width: 100%;
                            height: 100%;
                            border-radius: 50%;
                        "
                    />
                </v-avatar>

                <v-list-item-title class="font-weight-bold mb-1">
                    {{ user.username }}
                </v-list-item-title>

                <v-btn
                    :color="
                        followStore.isFollowing(user.id)
                            ? 'secondary'
                            : 'primary'
                    "
                    size="x-small"
                    density="compact"
                    min-width="68"
                    min-height="18"
                    class="text-caption"
                    :loading="followStore.isLoading"
                    @click="handleFollow(user.id)"
                >
                    {{
                        followStore.isFollowing(user.id) ? 'Seguindo' : 'Seguir'
                    }}
                </v-btn>
            </v-list-item>
        </v-list>

        <v-dialog v-model="alertMessage" persistent max-width="250">
            <v-card>
                <v-card-text>{{ alertMessage }}</v-card-text>
                <v-card-actions class="d-flex justify-space-between">
                    <v-btn color="red" size="small" @click="handleUnfollow"
                        >Sim</v-btn
                    >
                    <v-btn color="grey" size="small" @click="closeDialog"
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
