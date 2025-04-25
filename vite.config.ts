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
            },
        },
        css: {
            preprocessorOptions: {
                less: {
                    javascriptEnabled: true,
                },
                scss: {
                    api: "modern-compiler",
                    silenceDeprecations: ["legacy-js-api"],
                    implementation: "sass",
                    sassOptions: {
                        outputStyle: "compressed",
                    },
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
                usePolling: true,
                interval: 100,
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
