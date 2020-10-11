import fs from 'fs-extra'

export interface Alert {
  city: string
  lat: number
  lon: number
  minTemp: number
  maxTemp: number
}

export interface Config {
  checkingFrequencyMinutes: number
  forecastDays: number
  alerts: Alert[]
}

const defaultConfig: Config = {
  checkingFrequencyMinutes: 60,
  forecastDays: 5,
  alerts: [],
}

export async function readConfig(): Promise<Config> {
  try {
    return fs.readJson('../config.json')
  } catch (error) {
    console.warn('Could not read config.json used default config instead', {
      defaultConfig,
      error,
    })
    return defaultConfig
  }
}
