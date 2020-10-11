import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { format as formatDate } from 'date-fns'

import {
  faTemperatureHigh,
  faTemperatureLow,
} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames/bind'
import { LocationForecast } from './api'

const MAX_LIMIT_COLOR = '#c06c84'
const MIN_LIMIT_COLOR = '#6a8caf'

const Wrapper = styled.section`
  margin: 1rem auto;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
  padding: 1rem 2rem;

  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: 300;
      font-size: 2.25em;
    }

    svg {
      margin-left: 0.5rem;
    }
  }

  .forecasts {
    display: flex;
    justify-content: space-between;
    padding: 1rem 0;

    > div {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 1rem;
    }

    .temp {
      color: #cbcbcb;
      margin-top: 0.5rem;
    }

    .maxLimit {
      color: ${MAX_LIMIT_COLOR};
    }

    .minLimit {
      color: ${MIN_LIMIT_COLOR};
    }
  }
`

const dateFormat = (date: Date): string => formatDate(date, 'dd MMM')
const dayFormat = (date: Date): string => formatDate(date, 'E')

export const WeatherCard: React.FC<LocationForecast> = ({
  city,
  forecasts,
}) => {
  const isMinimumReached = forecasts.find((f) => f.isMinimumReached)
  const isMaximumReached = forecasts.find((f) => f.isMaximumReached)

  return (
    <Wrapper>
      <div className="title">
        <span>{city}</span>
        <div>
          {isMinimumReached && (
            <FontAwesomeIcon
              icon={faTemperatureLow}
              size="2x"
              color={MIN_LIMIT_COLOR}
              data-testid="min-limit"
            />
          )}
          {isMaximumReached && (
            <FontAwesomeIcon
              icon={faTemperatureHigh}
              size="2x"
              color={MAX_LIMIT_COLOR}
              data-testid="max-limit"
            />
          )}
        </div>
      </div>
      <div className="forecasts">
        {forecasts.map((forecast) => {
          const forecastDate = new Date(forecast.day)
          return (
            <div
              key={`${forecastDate.getTime()}`}
              className={classNames({
                minLimit: forecast.isMinimumReached,
                maxLimit: forecast.isMaximumReached,
              })}
            >
              <span>{dayFormat(forecastDate)}</span>
              <span className="date">{dateFormat(forecastDate)}</span>
              <span
                className={classNames('temp', {
                  minLimit: forecast.isMinimumReached,
                  maxLimit: forecast.isMaximumReached,
                })}
              >
                {Math.round(forecast.temp)}°
              </span>
            </div>
          )
        })}
      </div>
    </Wrapper>
  )
}
