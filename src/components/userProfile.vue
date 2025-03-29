<script setup>
    import { ref, computed, watch } from 'vue'
    import { useAuthStore } from '../store/authStore'
    import { useProfileStore } from '../store/profileStore'

    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    const user = computed(() => authStore.user || null)
    const fileInput = ref(null)
    const newBio = ref('')
    const isEditingBio = ref(false)
    const isSaving = computed(() => profileStore.isLoading)
    const menu = ref(false)

    const triggerFileUpload = () => {
        if (fileInput.value) fileInput.value.click()
    }

    const uploadImage = event => {
        const file = event.target.files?.[0] || null
        if (file) profileStore.updateProfileImage(file)
    }

    const editBio = () => {
        newBio.value = user.value?.bio || ''
        isEditingBio.value = true
        menu.value = false

        // subir suavemente ao topo ao clicar em editar
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
        document.body.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const confirmEditBio = async () => {
        if (!newBio.value.trim()) return
        await profileStore.updateBio(newBio.value)
        isEditingBio.value = false
    }

    const cancelEditBio = () => {
        isEditingBio.value = false
    }

    const handleLogout = () => {
        authStore.logout()
        menu.value = false
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
        document.body.scrollTo({ top: 0, behavior: 'smooth' })
        menu.value = false
    }

    watch(user, newVal => {
        console.log('[UserProfile] Usuário atualizado:', newVal)
    })
</script>

<template>
    <v-card
        class="d-flex flex-column align-center flex-grow-1"
        elevation="3"
        color="blue-lighten-4"
        style="min-height: 100vh"
    >
        <v-avatar
            size="200"
            class="mb-4 mt-6 cursor-pointer"
            @click="triggerFileUpload"
        >
            <img
                v-if="user?.profile_image"
                :src="user.profile_image"
                alt="Imagem de perfil"
                class="w-100 h-100 rounded-circle"
                style="object-fit: cover"
                @error="user.profile_image = ''"
            />
            <v-icon v-else size="60">mdi-account</v-icon>
        </v-avatar>

        <input
            type="file"
            ref="fileInput"
            class="d-none"
            @change="uploadImage"
            accept="image/*"
        />

        <v-card-title class="text-center text-h6 font-weight-bold">
            {{ user?.username || 'Usuário não encontrado' }}
        </v-card-title>

        <v-card-subtitle class="text-center text-caption mb-3">
            {{ user?.followers_count ?? 0 }} seguidores
        </v-card-subtitle>

        <v-card-text class="text-center w-100">
            <p v-if="!isEditingBio" class="text-caption font-italic">
                "{{ user?.bio || 'Escreva sobre você' }}"
            </p>

            <v-textarea
                v-if="isEditingBio"
                v-model="newBio"
                label="Biografia"
                variant="solo"
                counter="100"
                class="mt-2"
                auto-grow
                no-resize
            />

            <div v-if="isEditingBio" class="d-flex justify-space-between mt-2">
                <v-btn
                    color="blue-lighten-3"
                    @click="confirmEditBio"
                    :loading="isSaving"
                    size="x-small"
                >
                    Confirmar
                </v-btn>
                <v-btn
                    color="red-lighten-3"
                    @click="cancelEditBio"
                    size="x-small"
                >
                    Cancelar
                </v-btn>
            </div>
        </v-card-text>
    </v-card>

    <v-menu
        v-model="menu"
        transition="slide-y-transition"
        offset-y
        location="top start"
        :close-on-content-click="false"
    >
        <template #activator="{ props }">
            <v-btn
                icon
                color="primary"
                elevation="10"
                size="small"
                v-bind="props"
                style="
                    position: fixed;
                    bottom: 20px;
                    left: 20px;
                    z-index: 99999;
                    pointer-events: auto;
                "
            >
                <v-icon>mdi-menu</v-icon>
            </v-btn>
        </template>

        <v-card class="pa-2 d-flex flex-column" style="min-width: 140px">
            <v-btn
                variant="outlined"
                size="x-small"
                class="mb-2"
                @click="editBio"
            >
                <v-icon start size="small">mdi-pencil</v-icon>
                Editar
            </v-btn>

            <v-btn
                variant="outlined"
                size="x-small"
                class="mb-2"
                @click="scrollToTop"
            >
                <v-icon start size="small">mdi-arrow-up</v-icon>
                Topo
            </v-btn>

            <v-btn
                variant="outlined"
                color="red"
                size="x-small"
                @click="handleLogout"
            >
                <v-icon start size="small">mdi-logout</v-icon>
                Sair
            </v-btn>
        </v-card>
    </v-menu>
</template>
