<script setup>
    import { ref, computed, onMounted } from 'vue'
    import { useAuthStore } from '../store/authStore'
    import { useTweetStore } from '../store/tweetStore'
    import { useRouter } from 'vue-router'

    import UserProfile from '../components/userProfile.vue'
    import TweetFeed from '../components/tweetFeed.vue'
    import UserList from '../components/userList.vue'

    const authStore = useAuthStore()
    const tweetStore = useTweetStore()
    const router = useRouter()

    const isLoading = ref(true)
    const isAuthenticated = computed(() => !!authStore.token)

    onMounted(async () => {
        if (!isAuthenticated.value) {
            router.push('/login')
        } else {
            if (!authStore.user) {
                try {
                    await authStore.fetchUserData()
                } catch (error) {
                    console.error('Erro ao buscar dados do usuário:', error)
                }
            }

            try {
                await tweetStore.fetchFollowingTweets()
            } catch (error) {
                console.error('Erro ao buscar tweets:', error)
            }

            isLoading.value = false
        }
    })
</script>

<template>
    <div class="dashboard-wrapper">
        <div class="bg-layer bg1"></div>
        <div class="bg-layer bg2"></div>
        <div class="bg-layer bg3"></div>

        <v-container fluid class="dashboard-content pa-0 ma-0">
            <v-row class="d-flex justify-center">
                <v-col cols="12" md="2" lg="3" class="pa-3 d-flex flex-column">
                    <v-sheet
                        color="white"
                        class="flex-grow-1 d-flex w-100 mb-5"
                    >
                        <template v-if="!isLoading && authStore.user">
                            <UserProfile
                                :userProfile="authStore.user"
                                class="flex-grow-1 w-100"
                            />
                        </template>
                        <v-progress-circular
                            v-else
                            indeterminate
                            color="primary"
                            class="d-block mx-auto"
                        />
                    </v-sheet>
                </v-col>

                <v-col cols="12" md="8" lg="7" class="pa-4 d-flex flex-column">
                    <v-sheet color="white" elevation="4" class="w-100 mb-3">
                        <template v-if="!isLoading">
                            <TweetFeed />
                        </template>
                        <v-progress-circular
                            v-else
                            indeterminate
                            color="primary"
                            class="d-block mx-auto"
                        />
                    </v-sheet>
                </v-col>

                <v-col
                    cols="12"
                    md="2"
                    lg="2"
                    class="pa-3 mb-1 d-flex flex-column"
                >
                    <v-sheet color="white" class="w-100">
                        <template v-if="!isLoading">
                            <UserList />
                        </template>
                        <v-progress-circular
                            v-else
                            indeterminate
                            color="primary"
                            class="d-block mx-auto"
                        />
                    </v-sheet>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<style scoped>
    .dashboard-wrapper {
        position: relative;
        min-height: 100vh;
    }

    .dashboard-content {
        position: relative;
        z-index: 2;
        padding-bottom: 32px;
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
        pointer-events: none;
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
