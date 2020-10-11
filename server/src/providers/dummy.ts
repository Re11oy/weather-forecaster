import { WeatherProvider, GetDailyForecastFunc } from '../forecast-update-worker'

export const noopGetDailyForecastFunc: GetDailyForecastFunc = async (latitude: number, longitude: number, days: number) => {
  return [
    {
      date: new Date(2020, 9, 1),
      dayTemp: 15,
    },
    {
      date: new Date(2020, 9, 2),
      dayTemp: 20,
    },
    {
      date: new Date(2020, 9, 3),
      dayTemp: 25,
    },
    {
      date: new Date(2020, 9, 4),
      dayTemp: 10,
    },
    {
      date: new Date(2020, 9, 5),
      dayTemp: 26,
    }
  ]
}

export const dummyProvider: WeatherProvider = {
  getDailyForecast: noopGetDailyForecastFunc,
}
