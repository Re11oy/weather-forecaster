import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

import { OpenWeatherProvider } from './openweather'
import oneCallResponse from './mocks/open-weather-onecall.json'
import oneCallInvalidKeyResponse from './mocks/open-weather-onecall-invalid-api.json'

describe('OpenWeatherProvider', () => {
  const provider = new OpenWeatherProvider('api-key')

  beforeEach(() => {
    fetchMock.resetMocks()
  })

  it('should parse onecall response', async () => {
    fetchMock.mockOnce(JSON.stringify(oneCallResponse))

    const forecast = await provider.getDailyForecast(1,2,3)

    expect(forecast.length).toEqual(3)

    expect(forecast[0].date.getTime()).toBe(1602068400000)
  })

  it('should correctly process API error', async () => {
    fetchMock.mockOnce(JSON.stringify(oneCallInvalidKeyResponse), {status: 400})

    const request = provider.getDailyForecast(1,2,3)

    await expect(request).rejects.toEqual(new Error('Could not fetch weather forecast: Invalid API key.'))
  })
})
