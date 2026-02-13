import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 部署到 GitHub Pages 时，将 base 改为你的仓库名，如 '/schedule-generator/'
// 本地开发时可以注释掉 base 或设为 '/'
export default defineConfig({
    plugins: [react()],
    base: '/schedule-generator/', // 改成你的 GitHub 仓库名
})
