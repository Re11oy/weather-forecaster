import fetch from 'node-fetch'

describe('Server API', () => {
  const apiUrl = 'http://localhost:8080'

  it('should response list of forecasts', async () => {
    const result = await fetch(`${apiUrl}/forecasts`)
    expect(result.ok).toBeTruthy()

    const [ forecast ] = await result.json()
    expect(forecast).toBeDefined()
    expect(forecast.city).toBeDefined()
    expect(forecast.forecasts.length).toBeGreaterThan(0)
    expect(forecast.forecasts[0].temp).toBe(15)
  })
})
