import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)

console.log('[Main] Registrando plugins...')
app.use(createPinia())
app.use(router)
app.use(vuetify)

const onUnauthorized = () => {
    console.warn(
        '[Main] Token inválido ou expirado. Redirecionando para login...'
    )
    router.push('/login')
}

window.addEventListener('unauthorized', onUnauthorized)

router
    .isReady()
    .then(() => {
        app.mount('#app')
        console.log('[Main] Aplicação Vue montada com sucesso!')
    })
    .catch((error) => {
        console.error('[Main] Erro ao iniciar a aplicação:', error)
    })
