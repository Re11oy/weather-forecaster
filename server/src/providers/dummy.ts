import { GetDailyForecastFunc } from '../forecast-update-worker'

export const noopGetDailyForecastFunc: GetDailyForecastFunc = async (latitude: number, longitude: number, days: number) => {
  return [
    {
      date: new Date(),
      currentTemp: 15,
      minTemp: 10,
      maxTemp: 20,
    }
  ]
}
