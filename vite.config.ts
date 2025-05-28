import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')

    const isDocker = env.VITE_RUNNING_IN_DOCKER === 'true'
    const isDev = mode === 'development'

    const backendUrl = isDev
        ? 'http://localhost:8000'
        : isDocker
          ? 'http://backend:8000'
          : ''

    console.log(`\n🔹 [Vite Config] Ambiente: ${mode}`)
    console.log(`🔹 [Vite Config] Backend URL definida como: ${backendUrl}\n`)

    return {
        plugins: [vue()],
        base: isDev ? '/' : './',
        server: {
            host: '0.0.0.0',
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
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: false,
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
        envDir: path.resolve(__dirname, './env'),
        cacheDir: 'vite_cache',
        publicDir: 'public'
    }
})
