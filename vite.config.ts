import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, type Plugin } from 'vite'
import { sites } from './build/sites-vite-plugin'

function staticWorker(): Plugin {
  return {
    name: 'tsukivox-static-worker',
    apply: 'build',
    async closeBundle() {
      const outputDirectory = resolve(process.cwd(), 'dist/server')
      const workerSource = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request)

    if (response.status !== 404 || request.method !== 'GET') {
      return response
    }

    const fallbackUrl = new URL('/index.html', request.url)
    return env.ASSETS.fetch(new Request(fallbackUrl, request))
  }
}

export default worker
`

      await mkdir(outputDirectory, { recursive: true })
      await writeFile(resolve(outputDirectory, 'index.js'), workerSource)
    }
  }
}

export default defineConfig({
  base: './',
  plugins: [vue(), sites(), staticWorker()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['terminal.local']
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    sourcemap: false
  }
})
