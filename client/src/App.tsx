import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { WeatherCard } from './WeatherCard'
import { fetchWeatherForecasts, LocationForecast } from './api'

const Main = styled.section`
  display: flex;
  flex-direction: column;

  .error {
    margin: 1rem auto;
    border-radius: 3px;
    background-color: #fff;
    color: #c06c84;
    box-shadow: 1px 1px 4px #c06c84;
    padding: 1rem 2rem;
  }
`

const App: React.FC = () => {
  const [forecasts, setForecasts] = useState<LocationForecast[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')

  const setError = useCallback((error: Error) => {
    setErrorMessage(error.message)
  }, [])

  useEffect(() => {
    fetchWeatherForecasts().then((forecasts) => {
      setForecasts(forecasts)
      setErrorMessage('')
    }, setError)
  }, [setError])

  return (
    <Main>
      {errorMessage && <div className="error">{errorMessage}</div>}
      {forecasts.map((forecast) => (
        <WeatherCard key={forecast.city} {...forecast} />
      ))}
    </Main>
  )
}

export default App
