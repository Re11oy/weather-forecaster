import mongoose from 'mongoose'

import { OpenWeatherProvider } from './providers/openweather'
import { dummyProvider } from './providers/dummy'
import { Alert, readConfig } from './config'
import WeatherForecasts, { Forecast } from './models/weather-forecast'
import { MONGO_CONNECTION_URL, OPEN_WEATHER_API_KEY, WEATHER_PROVIDER } from './environment'

export interface WeatherForecast {
  date: Date
  dayTemp: number
}

export interface GetDailyForecastFunc {
  (latitude: number, longitude: number, days: number): Promise<WeatherForecast[]>
}

export interface WeatherProvider {
  getDailyForecast: GetDailyForecastFunc
}

async function updateWeatherForecast(
  weatherProvider: WeatherProvider,
  alert: Alert,
  forecastDays = 5,
) {
  console.debug('Start location weather forecast update', {
    city: alert.city,
    forecastDays,
  })
  try {
    const forecasts = await weatherProvider.getDailyForecast(
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
      temp: item.dayTemp,
      isMaximumReached: item.dayTemp >= alert.maxTemp,
      isMinimumReached: item.dayTemp <= alert.minTemp,
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

/**
 * Remove not actual location weather alerts that not specified in config
 * @param cities, actual list of monitoring locations
 */
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

/**
 * Main works forecasts update function
 * TODO refactor to the lambda cloud function
 * @param weatherProvider - service provide daily weather forecasts
 */
async function updateLocationsWeatherForecasts(
  weatherProvider: WeatherProvider,
): Promise<void> {
  let checkingFrequencyMinutes = 5

  try {
    const config = await readConfig()
    if (config.checkingFrequencyMinutes) {
      checkingFrequencyMinutes = config.checkingFrequencyMinutes
    }

    await Promise.all(
      config.alerts.map((alert) =>
        updateWeatherForecast(weatherProvider, alert, config.forecastDays),
      ),
    )

    await purgeAlerts(config.alerts.map((alert) => alert.city))
  } catch (error) {
    console.error('Error occurs during weather forecast update', error)
  }

  const nextStartDate = new Date()
  nextStartDate.setMinutes(
    nextStartDate.getMinutes() + checkingFrequencyMinutes,
  )
  console.debug(`Next update scheduled at ${nextStartDate}`)
  setTimeout(
    () => updateLocationsWeatherForecasts(weatherProvider),
    checkingFrequencyMinutes * 60 * 1000,
  )
}

async function startWorker() {
  await mongoose.connect(MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })

  const weatherProvider = WEATHER_PROVIDER === 'NOOP'
    ? dummyProvider :
    new OpenWeatherProvider(OPEN_WEATHER_API_KEY)

  console.debug(`Weather forecast update worker started with provider ${WEATHER_PROVIDER}`)
  await updateLocationsWeatherForecasts(weatherProvider)
}

if (require.main === module) {
  startWorker().catch((error) => {
    console.log(error)
    process.exit(1)
  })
}
