import dotenv from 'dotenv'

const result = dotenv.config()
if (result.error) {
  console.warn(
    'Environment file ".env" not found, ".env.development" used instead',
  )
  dotenv.config({ path: '../.env.development' })
}

export const MONGO_CONNECTION_URL = process.env.MONGO_CONNECTION_URL ?? ''
export const WEATHER_PROVIDER = process.env.WEATHER_PROVIDER ?? ''
export const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY ?? ''
