import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 배포 시 리포지토리 이름으로 변경하세요
  // 예: base: '/villa-parking/'
  base: '/villa-parking/',
})
