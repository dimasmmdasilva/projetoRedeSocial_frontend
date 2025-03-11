// Importa os estilos do Vuetify
import 'vuetify/styles'

// Importa a biblioteca principal do Vuetify
import { createVuetify } from 'vuetify'

// Importa todos os componentes e diretivas do Vuetify
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Importa os ícones do Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

// Configuração do Vuetify
const vuetify = createVuetify({
    components, // Registra todos os componentes do Vuetify
    directives, // Registra todas as diretivas do Vuetify
    theme: {
        defaultTheme: 'light'
    },
    icons: {
        defaultSet: 'mdi'
    }
})

// Exporta a instância configurada do Vuetify
export default vuetify
