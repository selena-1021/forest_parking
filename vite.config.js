import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/", // 이 부분을 꼭 이렇게 한 글자로 바꿔주세요!
})
