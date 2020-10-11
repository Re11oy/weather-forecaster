import React from 'react'
import { render } from '@testing-library/react'
import { WeatherCard } from './WeatherCard'

describe('WeatherCard', () => {
  const testDate = new Date(2020, 10)

  const getForecast = (isMinimumReached = false, isMaximumReached = false) => ({
    city: 'Helsinki',
    forecasts: [
      {
        day: testDate,
        temp: 10,
        isMaximumReached: isMaximumReached,
        isMinimumReached: isMinimumReached,
      },
    ],
  })

  it('should render card with forecast', () => {
    const { container } = render(<WeatherCard {...getForecast()} />)

    expect(container).toMatchSnapshot()
  })

  it('should should display min temperature alert', () => {
    const rendered = render(<WeatherCard {...getForecast(true, false)} />)

    expect(rendered.getByTestId('min-limit')).toBeInTheDocument()
    expect(rendered.getByText('10°')).toHaveClass('minLimit')
  })

  it('should should display max temperature alert', () => {
    const rendered = render(<WeatherCard {...getForecast(false, true)} />)

    expect(rendered.getByTestId('max-limit')).toBeInTheDocument()
    expect(rendered.getByText('10°')).toHaveClass('maxLimit')
  })
})
