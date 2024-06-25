import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/atlas': {
        target: 'http://s3.amazonaws.com/com.modestmaps.bluemarble/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/atlas/, ''),
      }
    }
  }
})
