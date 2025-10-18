import { GET } from './route'

describe('/api/health', () => {
  it('returns 200 status', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
  })

  it('returns correct response structure', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('service')
  })

  it('returns status ok', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.status).toBe('ok')
  })

  it('returns correct service name', async () => {
    const response = await GET()
    const data = await response.json()

    expect(data.service).toBe('syncscope-frontend')
  })

  it('timestamp is a valid ISO string', async () => {
    const response = await GET()
    const data = await response.json()

    expect(() => new Date(data.timestamp)).not.toThrow()
    expect(new Date(data.timestamp).toISOString()).toBe(data.timestamp)
  })
})
