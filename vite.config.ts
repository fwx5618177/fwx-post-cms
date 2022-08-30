import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: 'i18n',
                replacement: 'i18n/i18n.js',
            },
            {
                find: 'src',
                replacement: path.resolve(__dirname, './src'),
            },
            // {
            //     find: /@\//,
            //     replacement: pathResolve('src') + '/',
            // },
            // {
            //     src: path.resolve(__dirname, './src'),
            //     '@/': './',
            //     mocks: './mocks',
            //     tests: './tests',
            //     extends: './extends',
            // },
        ],
    },
    build: {
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
})
