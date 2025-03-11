import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

const app = createApp(App)

// Configuração global de plugins
console.log('[Main] Registrando plugins...')
app.use(createPinia())
app.use(router)
app.use(vuetify)

// Função global para tratar erros de autenticação
const onUnauthorized = () => {
    console.warn(
        '[Main] Token inválido ou expirado. Redirecionando para login...'
    )
    router.push('/login')
}

// Listener global para interceptar eventos de autenticação
window.addEventListener('unauthorized', onUnauthorized)

// Inicializa o Vue Router antes de montar a aplicação
router
    .isReady()
    .then(() => {
        app.mount('#app')
        console.log('[Main] Aplicação Vue montada com sucesso!')
    })
    .catch(error => {
        console.error('[Main] Erro ao iniciar a aplicação:', error)
    })
