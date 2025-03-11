<script setup>
    import { onMounted } from 'vue'
    import { useRouter } from 'vue-router'

    const router = useRouter()

    onMounted(() => {
        console.log('[App] Inicializando aplicação...')
    })
</script>

<template>
    <v-app>
        <v-main>
            <v-container>
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>
