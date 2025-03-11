import axios from 'axios'

const API_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:8000/api/'
        : '/api/'

console.log(`[Axios Config] Ambiente: ${import.meta.env.MODE}`)
console.log(`[Axios Config] Definindo baseURL como: ${API_URL}`)

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

api.interceptors.request.use(
    config => {
        console.log(`[Axios Request] Iniciando requisição para ${config.url}`)

        const token =
            localStorage.getItem('token') || sessionStorage.getItem('token')

        if (token) {
            console.log(
                '[Axios Request] Token encontrado, adicionando ao header'
            )
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.warn('[Axios Request] Nenhum token encontrado')
        }

        if (config.headers['Content-Type'] === 'multipart/form-data') {
            console.log(
                '[Axios Request] Removendo Content-Type para upload de arquivo'
            )
            delete config.headers['Content-Type']
        }

        return config
    },
    error => {
        console.error('[Axios Request] Erro ao configurar requisição:', error)
        return Promise.reject(error)
    }
)

api.interceptors.response.use(
    response => {
        console.log(
            `[Axios Response] Resposta recebida de ${response.config.url}`,
            response
        )
        return response
    },
    error => {
        if (error.response) {
            const { status, config } = error.response
            console.error(
                `[Axios Response] Erro na requisição para ${config.url}:`,
                error.response
            )

            if (status === 401) {
                console.warn(
                    '[Axios Response] Token inválido ou expirado. Removendo token e redirecionando para login.'
                )
                localStorage.removeItem('token')
                sessionStorage.removeItem('token')
                window.dispatchEvent(new Event('unauthorized'))
            } else if (status === 403) {
                console.warn(
                    '[Axios Response] Requisição bloqueada (403 Forbidden). Verifique CSRF ou permissões.'
                )
            } else if (status === 500) {
                console.error(
                    `[Axios Response] Erro interno do servidor (${status}).`
                )
            }
        } else if (error.request) {
            console.error(
                '[Axios Response] Nenhuma resposta recebida do servidor.',
                error.request
            )
        } else {
            console.error(
                '[Axios Response] Erro ao configurar a requisição.',
                error.message
            )
        }

        return Promise.reject(error)
    }
)

export default api
