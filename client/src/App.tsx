import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { WeatherCard } from './WeatherCard'
import { fetchWeatherForecasts, LocationForecast } from './api'

const Main = styled.section`
  display: flex;
  flex-direction: column;

  .alert {
    margin: 1rem auto;
    border-radius: 3px;
    background-color: #fff;
    color: darkgray;
    box-shadow: 1px 1px 4px darkgray;
    padding: 1rem 2rem;

    &.error {
      color: #c06c84;
      box-shadow: 1px 1px 4px #c06c84;
    }
  }
`

const App: React.FC = () => {
  const [forecasts, setForecasts] = useState<LocationForecast[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const setError = useCallback((error: Error) => {
    setErrorMessage(error.message)
    setLoading(false)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchWeatherForecasts().then((forecasts) => {
      setForecasts(forecasts)
      setErrorMessage('')
      setLoading(false)
    }, setError)
  }, [setError])

  return (
    <Main>
      {loading && <div className="alert">Loading...</div>}
      {!loading && errorMessage && (
        <div className="alert error">{errorMessage}</div>
      )}
      {forecasts.length ? (
        forecasts.map((forecast) => (
          <WeatherCard key={forecast.city} {...forecast} />
        ))
      ) : (
        <div className="alert">
          The weather will always be good
          <span role="img" aria-label="" aria-labelledby="">
            {' '}
            😀
          </span>
        </div>
      )}
    </Main>
  )
}

export default App
