import { expect, test } from 'bun:test'
import app from '../src/worker/index'

const routes = ['/api/contact']

test('malformed public form input is rejected with JSON rather than a server error', async () => {
  for (const route of routes) {
    for (const body of ['null', '[]', '{}', '{', '{"email": {}}']) {
      const response = await app.request(`https://example.test${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      expect(response.status).toBeGreaterThanOrEqual(400)
      expect(response.status).toBeLessThan(500)
      expect((await response.json()).error).toBeString()
    }
  }
})

test('oversized requests and unknown API routes never fall through to HTML', async () => {
  const oversized = await app.request(`https://example.test${routes[0]}`, {
    method: 'POST',
    body: 'x'.repeat(20_000),
  })
  expect(oversized.status).toBe(413)
  const missing = await app.request('https://example.test/api/missing')
  expect(missing.status).toBe(404)
  expect((await missing.json()).error).toBeString()
})
