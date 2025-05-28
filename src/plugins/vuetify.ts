import 'vuetify/styles'

import { createVuetify } from 'vuetify'

import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light',
    },
    icons: {
        defaultSet: 'mdi',
    },
    defaults: {
        VContainer: {
            fluid: true,
        },
        VSheet: {
            width: '100%',
        },
    },
})

export default vuetify
