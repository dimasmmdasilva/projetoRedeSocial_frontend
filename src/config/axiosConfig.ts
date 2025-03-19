import axios from 'axios'
import { useAuthStore } from '../store/authStore.js'

const API_URL =
    import.meta.env.MODE === 'development'
        ? 'http://localhost:8000/api/' // Modo de desenvolvimento
        : '/api/' // Produção ou Docker

console.log(`[Axios Config] Ambiente: ${import.meta.env.MODE}`)
console.log(`[Axios Config] Definindo baseURL como: ${API_URL}`)

// Criando a instância do Axios com configuração base
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Interceptador de requisição para adicionar o token JWT
api.interceptors.request.use(
    config => {
        console.log(`[Axios Request] Iniciando requisição para ${config.url}`)

        const token = localStorage.getItem('token')

        if (token) {
            console.log(
                '[Axios Request] Token encontrado, adicionando ao header'
            )
            config.headers.Authorization = `Bearer ${token}`
        } else {
            console.warn('[Axios Request] Nenhum token encontrado')
        }

        // Removendo manualmente o Content-Type para uploads de arquivos
        if (config.headers['Content-Type'] === 'multipart/form-data') {
            console.log(
                '[Axios Request] Upload detectado, ajustando headers...'
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

// Função para tentar renovar o token
const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
        console.warn('[Axios] Nenhum refresh token encontrado.')
        return null
    }

    try {
        console.log('[Axios] Tentando renovar o token...')
        const response = await axios.post(`${API_URL}auth/refresh/`, {
            refresh: refreshToken
        })

        if (response.data.access) {
            console.log('[Axios] Token renovado com sucesso!')
            localStorage.setItem('token', response.data.access)
            return response.data.access
        }
    } catch (error) {
        console.error('[Axios] Erro ao renovar o token:', error)
    }

    return null
}

// Interceptador de resposta para tratamento de erros
api.interceptors.response.use(
    response => {
        console.log(
            `[Axios Response] Resposta recebida de ${response.config.url}`,
            response
        )
        return response
    },
    async error => {
        if (error.response) {
            const { status, config } = error.response
            console.error(
                `[Axios Response] Erro ${status} na requisição para ${config.url}:`,
                error.response
            )

            if (status === 401) {
                console.warn(
                    '[Axios Response] Token expirado. Tentando renovar...'
                )

                const newToken = await refreshToken()
                if (newToken) {
                    console.log(
                        '[Axios Response] Reenviando a requisição com o novo token.'
                    )
                    error.config.headers['Authorization'] = `Bearer ${newToken}`
                    return api(error.config)
                }

                console.warn(
                    '[Axios Response] Token inválido ou expirado. Redirecionando para login.'
                )

                // Se o token não puder ser renovado, força logout
                const authStore = useAuthStore()
                authStore.logout()
            } else if (status === 403) {
                console.warn(
                    '[Axios Response] Acesso negado (403 Forbidden). Verifique permissões.'
                )
            } else if (status === 500) {
                console.error(
                    '[Axios Response] Erro interno do servidor (500).'
                )
            }
        } else if (error.request) {
            console.error(
                '[Axios Response] Nenhuma resposta do servidor:',
                error.request
            )
        } else {
            console.error(
                '[Axios Response] Erro ao configurar requisição:',
                error.message
            )
        }

        return Promise.reject(error)
    }
)

export default api
