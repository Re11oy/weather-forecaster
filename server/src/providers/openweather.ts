import { WeatherProvider } from '../forecast-update-worker'
import fetch, { Response } from 'node-fetch'

const API_ENDPOINT = 'http://api.openweathermap.org/data/2.5'

export interface Temp {
  day: number
  min: number
  max: number
  night: number
  eve: number
  morn: number
}

export interface Daily {
  dt: number
  temp: Temp
}

export interface OneCallResponse {
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  daily: Daily[]
}

export class OpenWeatherProvider implements WeatherProvider {
  constructor(private apiKey: string) {
    if (!apiKey) {
      throw new Error('Open weather API not specified')
    }
  }

  static async getErrorMessage(response: Response) {
    try {
      const json = await response.json()
      return json.message ?? ''
    } catch (e) {
      return ''
    }
  }

  async getDailyForecast(latitude: number, longitude: number, days: number) {
    const response = await fetch(`${API_ENDPOINT}/onecall?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&cnt=${days}&exclude=current,hourly&units=metric`)
    if (response.status !== 200) {
      const message = await OpenWeatherProvider.getErrorMessage(response)
      throw new Error(`Could not fetch weather forecast: ${message}`)
    }

    const { daily = [] }: OneCallResponse = await response.json()

    // OW returns todays forecast, skip it
    return daily.slice(1, days + 1).map(({dt, temp}) => ({
      date: new Date(dt * 1000),
      dayTemp: temp.day,
    }))
  }
}

