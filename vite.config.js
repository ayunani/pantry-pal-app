import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ⬇️ Replace <REPO_NAME> with your repo name exactly (case-sensitive)
export default defineConfig({
  plugins: [react()],
  base: '/pantry-pal-app/',     // e.g. '/pantry-pal/'
  build: { outDir: 'docs' }  // put build into /docs so Pages can serve it
});

