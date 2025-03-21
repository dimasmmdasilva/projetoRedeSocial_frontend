<script setup>
    import { ref, computed, onMounted, watch } from 'vue'
    import { useAuthStore } from '../store/authStore'
    import { useProfileStore } from '../store/profileStore'

    const authStore = useAuthStore()
    const profileStore = useProfileStore()

    const user = computed(() => authStore.user || null)
    const fileInput = ref(null)
    const newBio = ref('')
    const isEditingBio = ref(false)
    const isSaving = computed(() => profileStore.isLoading)
    const showScrollButton = ref(false)

    const triggerFileUpload = () => {
        if (fileInput.value) {
            fileInput.value.click()
        }
    }

    const uploadImage = event => {
        const target = event.target
        const file = target.files ? target.files[0] : null

        if (file) {
            profileStore.updateProfileImage(file)
        }
    }

    const editBio = () => {
        newBio.value = user.value?.bio || ''
        isEditingBio.value = true
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
    }

    const handleScroll = () => {
        showScrollButton.value = window.scrollY > 200
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    onMounted(() => {
        console.log('[UserProfile] Perfil carregado:', user.value)
        window.addEventListener('scroll', handleScroll)
    })

    watch(user, newVal => {
        console.log('[UserProfile] Usuário atualizado:', newVal)
    })
</script>

<template>
    <v-card
        class="d-flex flex-column align-center pa-6 flex-grow-1 position-relative"
        elevation="3"
        color="blue-lighten-4"
        style="
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            position: relative;
        "
    >
        <v-avatar
            size="170"
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
                "{{ user?.bio || 'Escreva sobre você' }} "
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

            <v-btn
                v-if="!isEditingBio"
                variant="outlined"
                color="primary"
                class="mt-5"
                @click="editBio"
                :disabled="isSaving"
                size="x-small"
                block
            >
                Editar Biografia
            </v-btn>

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

        <v-card-actions
            class="w-100 d-flex flex-column align-center"
            style="
                position: absolute;
                bottom: 10px;
                left: 50%;
                transform: translateX(-50%);
            "
        >
            <v-btn
                color="red"
                variant="outlined"
                size="x-small"
                class="w-75"
                @click="handleLogout"
            >
                Sair
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
