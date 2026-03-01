import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Server } from 'socket.io'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'socket-io',
      configureServer(server) {
        if (!server.httpServer) return
        const io = new Server(server.httpServer)

        io.on('connection', (socket) => {
          console.log('User connected:', socket.id)

          socket.on('chat_message', (msg) => {
            io.emit('chat_message', msg)
          })

          socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id)
          })
        })
      }
    }
  ],
  server: {
    open: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['framer-motion', 'lucide-react']
        }
      }
    }
  }
})
