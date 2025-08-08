import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    const envMap = {
        dev: env.VITE_BASE_URL,
        prod: env.VITE_PROD_URL,
    };

    const baseUrl = envMap[mode];
    const isDev = mode === "development";

    return {
        base: "./",
        plugins: [react()],
        define: {
            "process.env": {
                BASE_URL: baseUrl,
                MODE: mode,
            },
        },
        resolve: {
            alias: {
                "@components": path.resolve(__dirname, "./src/components"),
                "@config": path.resolve(__dirname, "./src/config"),
                "@pages": path.resolve(__dirname, "./src/pages"),
                "@request": path.resolve(__dirname, "./src/request"),
                "@utils": path.resolve(__dirname, "./src/utils"),
                "@styles": path.resolve(__dirname, "./src/styles"),
                "@services": path.resolve(__dirname, "./src/services"),
                "@types": path.resolve(__dirname, "./src/types"),
                "@layout": path.resolve(__dirname, "./src/layout"),
                "@i18n": path.resolve(__dirname, "./i18n"),
                "@settings": path.resolve(__dirname, "./src/settings"),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {
                    api: "modern-compiler",
                    silenceDeprecations: ["legacy-js-api"],
                    implementation: "sass",
                    sassOptions: {
                        outputStyle: "compressed",
                    },
                    additionalData: `@use "@styles/variables.scss" as *;`,
                },
            },
            modules: {
                localsConvention: "camelCase",
            },
        },
        server: {
            https: false,
            proxy: {},
            watch: {
                usePolling: false,
                // 等待写入稳定后再触发热更新，避免编辑器保存产生的多次写入导致抖动
                awaitWriteFinish: {
                    stabilityThreshold: 200,
                    pollInterval: 50,
                },
                ignored: [
                    "**/node_modules/**",
                    "**/.git/**",
                    "**/dist/**",
                    "**/.DS_Store",
                    "**/coverage/**",
                    "**/.vite/**",
                    "node_modules/.vite/**",
                ],
            },
        },
        build: {
            chunkSizeWarningLimit: 2000,
            sourcemap: isDev,
            outDir: "./dist",
            assetsDir: ".",
            minify: "terser",
            rollupOptions: {
                output: {
                    manualChunks: {
                        react: ["react"],
                        "react-dom": ["react-dom"],
                        "react-router-dom": ["react-router-dom"],
                        formik: ["formik"],
                        "react-i18next": ["react-i18next"],
                        lodash: ["lodash"],
                        numeral: ["numeral"],
                        dayjs: ["dayjs"],
                    },
                },
            },
            terserOptions: {
                compress: {
                    drop_console: !isDev,
                    drop_debugger: !isDev,
                },
            },
        },
        optimizeDeps: {
            include: ["react", "react-dom", "react-router-dom", "react-i18next"],
        },
    };
});
