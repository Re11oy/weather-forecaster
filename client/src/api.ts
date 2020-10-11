export interface Forecast {
  day: Date
  temp: number
  isMaximumReached: boolean
  isMinimumReached: boolean
}

export interface LocationForecast {
  city: string
  forecasts: Forecast[]
}

export const fetchWeatherForecasts = async (): Promise<LocationForecast[]> => {
  const result = await fetch('/forecasts')
  if (result.status !== 200) {
    throw new Error('Could not fetch alerts')
  }
  return result.json()
}
