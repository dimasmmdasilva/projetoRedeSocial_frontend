import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const isDocker = env.VITE_RUNNING_IN_DOCKER === 'true'
    const isDev = mode === 'development'

    // Definição da URL do backend para cada ambiente
    const backendUrl = isDev
        ? 'http://localhost:8000' // Ambiente de desenvolvimento local
        : isDocker
          ? 'http://backend:8000' // Ambiente interno do Docker
          : '/api/' // Produção (com proxy configurado no Nginx)

    console.log(`\n🔹 [Vite Config] Ambiente: ${mode}`)
    console.log(`🔹 [Vite Config] Backend URL definida como: ${backendUrl}\n`)

    return {
        plugins: [vue()],
        base: isDev ? '/' : './', // Garante que os assets são carregados corretamente na build
        server: {
            host: '0.0.0.0', // Permite acesso externo para testes
            port: 5173,
            strictPort: true,
            cors: true,
            proxy: {
                '/api': {
                    target: backendUrl,
                    changeOrigin: true,
                    secure: false
                }
            }
        },
        build: {
            outDir: 'dist', // Diretório onde a build será gerada
            assetsDir: 'assets', // Pasta para os assets dentro de dist/
            sourcemap: false, // Desativa sourcemaps na produção para otimizar performance
            minify: isDev ? false : 'terser',
            rollupOptions: {
                output: {
                    assetFileNames: 'assets/[name]-[hash][extname]',
                    chunkFileNames: 'assets/[name]-[hash].js',
                    entryFileNames: 'assets/[name]-[hash].js'
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            }
        },
        envDir: path.resolve(__dirname, './env'), // Mantém arquivos .env organizados
        cacheDir: 'vite_cache', // Define uma pasta separada para o cache do Vite
        publicDir: 'public' // Garante que assets estáticos fiquem organizados
    }
})
