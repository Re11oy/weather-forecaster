import { OpenWeatherProvider } from './providers/openweather'
import { noopGetDailyForecastFunc } from './providers/dummy'
import { Alert, readConfig } from './config'
import mongoose from 'mongoose'
import WeatherForecasts, { Forecast } from './models/weather-forecast'

export interface WeatherForecast {
  date: Date
  currentTemp: number
  minTemp: number
  maxTemp: number
}

export interface GetDailyForecastFunc {
  (latitude: number, longitude: number, days: number): Promise<
    WeatherForecast[]
  >
}

export interface ForecastChecker {
  getDailyForecast: GetDailyForecastFunc
}

const dummyProvider: ForecastChecker = {
  getDailyForecast: noopGetDailyForecastFunc,
}

async function updateWeatherForecast(
  forecastChecker: ForecastChecker,
  alert: Alert,
  forecastDays = 5,
) {
  console.debug('Start location weather forecast update', {
    city: alert.city,
    forecastDays,
  })
  try {
    const forecasts = await forecastChecker.getDailyForecast(
      alert.lat,
      alert.lon,
      forecastDays,
    )
    if (!forecasts?.length) {
      console.debug('No location weather forecasts', { city: alert.city })
      return
    }

    const forecastsUpdate: Forecast[] = forecasts.map((item) => ({
      day: item.date,
      temp: item.currentTemp,
      isMaximumReached: item.maxTemp >= alert.maxTemp,
      isMinimumReached: item.minTemp <= alert.minTemp,
    }))

    await WeatherForecasts.findOneAndUpdate(
      { city: alert.city },
      {
        forecasts: forecastsUpdate,
      },
      { upsert: true },
    )

    console.debug('Location forecasts updated', {
      city: alert.city,
      forecasts: forecasts.length,
    })
  } catch (error) {
    console.warn(`Error accrues during forecast update`, {
      city: alert.city,
      error,
    })
  }
}

async function purgeAlerts(cities: string[]) {
  try {
    const purgeLocations = await WeatherForecasts.find({
      city: { $nin: cities },
    })
    if (purgeLocations.length) {
      await Promise.all(purgeLocations.map((item) => item.deleteOne()))
      console.debug('Purged not monitored locations', {
        locations: purgeLocations.map((item) => item.city),
      })
    }
  } catch (error) {
    console.warn(`Error accrues during alerts purge`, { error })
  }
}

async function updateLocationsWeatherForecasts(
  forecastChecker: ForecastChecker,
): Promise<void> {
  const config = await readConfig()

  await Promise.all(
    config.alerts.map((alert) =>
      updateWeatherForecast(forecastChecker, alert, config.forecastDays),
    ),
  )

  await purgeAlerts(config.alerts.map((alert) => alert.city))

  const nextStartDate = new Date()
  nextStartDate.setMinutes(
    nextStartDate.getMinutes() + config.checkingFrequencyMinutes,
  )
  console.debug(`Next update scheduled at ${nextStartDate}`)
  setTimeout(async () => {
    await updateLocationsWeatherForecasts(forecastChecker)
  }, config.checkingFrequencyMinutes * 60 * 1000)
}

async function startWorker() {
  await mongoose.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  const forecastChecker = process.env.PROVIDER
    ? new OpenWeatherProvider('a681ef0c5f3bb9b882d092485bdaee4f')
    : dummyProvider

  await updateLocationsWeatherForecasts(forecastChecker)
}

if (require.main === module) {
  startWorker().catch((error) => {
    console.log(error)
    process.exit(1)
  })
}
