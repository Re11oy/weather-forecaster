import { Document, model, Schema } from 'mongoose'

export interface Forecast {
  day: Date
  temp: number
  isMaximumReached: boolean
  isMinimumReached: boolean
}

export interface LocationWeatherForecast extends Document {
  city: string
  forecasts: Forecast[]
}

const forecastSchema: Schema = new Schema(
  {
    day: Date,
    temp: Number,
    isMaximumReached: Boolean,
    isMinimumReached: Boolean,
  }
)

const locationWeatherForecastSchema: Schema = new Schema(
  {
    city: String,
    forecasts: [forecastSchema],
  },
  { timestamps: true }
)

export default model<LocationWeatherForecast>('WeatherForecasts', locationWeatherForecastSchema)
