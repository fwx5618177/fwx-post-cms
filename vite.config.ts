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
        base: ".",
        plugins: [react()],
        define: {
            "process.env": {
                BASE_URL: baseUrl,
                MODE: mode,
            },
        },
        resolve: {
            alias: {
                "@/": path.resolve(__dirname, "./src"),
                "@i18n": path.resolve(__dirname, "./i18n"),
                "@mocks": path.resolve(__dirname, "./mocks"),
            },
        },
        css: {
            preprocessorOptions: {
                scss: {},
            },
        },
        server: {
            https: false,
            proxy: {},
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
