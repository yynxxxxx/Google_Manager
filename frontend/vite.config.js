import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // 构建输出到 Flask 的 static 目录
    build: {
        outDir: path.resolve(__dirname, '../static'),
        emptyOutDir: true,
    },
    // 开发服务器配置
    server: {
        port: 3000,
        // 代理 API 请求到 Flask 后端
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
            }
        }
    }
})
