import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('serves the built TsukiVox experience', async () => {
  const html = await readFile(new URL('../dist/client/index.html', import.meta.url), 'utf8')
  const workerUrl = new URL('../dist/server/index.js', import.meta.url)
  workerUrl.searchParams.set('test', `${process.pid}-${Date.now()}`)
  const { default: worker } = await import(workerUrl.href)

  const response = await worker.fetch(
    new Request('http://localhost/'),
    {
      ASSETS: {
        fetch: async (request) => {
          const pathname = new URL(request.url).pathname
          return pathname === '/' || pathname === '/index.html'
            ? new Response(html, { headers: { 'content-type': 'text/html; charset=utf-8' } })
            : new Response('Not found', { status: 404 })
        }
      }
    }
  )

  assert.equal(response.status, 200)
  assert.match(await response.text(), /TsukiVox/)
})
