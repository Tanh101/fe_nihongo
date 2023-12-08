/// <reference types="vite/client" />
import { defineConfig } from "vite";

export default defineConfig({
    optimizeDeps: {
        exclude: ['js-big-decimal']
    }
});
