import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
    base: "./",
    plugins: [react()],
    resolve: {
        alias: [
            {
                find: "i18n",
                replacement: "i18n/i18n.js",
            },
            {
                find: "src",
                replacement: path.resolve(__dirname, "./src"),
            },
        ],
    },
    server: {
        https: false,
        proxy: {},
    },
    build: {
        target: "es2015",
        cssTarget: "chrome80",
        minify: "terser",
        chunkSizeWarningLimit: 2000,
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
});
