import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: './src/index.js',
            name: 'Grassly',
            fileName: 'index'
        },
        rollupOptions: {
            external: ['lit'],
        }
    }
});