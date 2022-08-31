import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    base: 'https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/moxixii.com/',
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
    server: {
        host: true,
        port: 3000,
        https: false,
        proxy: {},
    },
    build: {
        target: 'es2015',
        cssTarget: 'chrome80',
        // minify: 'terser',
        // terserOptions: {
        //     compress: {
        //         keep_infinity: true,
        //         // drop_console: VITE_DROP_CONSOLE,
        //     },
        // },
        chunkSizeWarningLimit: 2000,
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
    experimental: {
        // renderBuiltUrl: (
        //     filename: string,
        //     { hostId, hostType, type }: { hostId: string; hostType: 'js' | 'css' | 'html'; type: 'public' | 'asset' },
        // ) => {
        //     if (type === 'public') {
        //         return 'https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/moxixii.com/' + filename
        //     } else if (path.extname(hostId) === '.js') {
        //         // return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
        //         return {
        //             runtime: `https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/moxixii.com/${JSON.stringify(
        //                 filename,
        //             )}`,
        //         }
        //     } else {
        //         return 'https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/moxixii.com/' + filename
        //     }
        //     // return 'https://moxi-blog-1252315781.cos.ap-shanghai.myqcloud.com/moxixii.com/' + filename
        // },
    },
})
