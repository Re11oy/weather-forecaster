import React from 'react'
import { render } from '@testing-library/react'
import { WeatherCard } from './WeatherCard'
import { getTestForecast } from './testUtils'

describe('WeatherCard', () => {
  it('should render card with forecast', () => {
    const { container } = render(<WeatherCard {...getTestForecast()} />)

    expect(container).toMatchSnapshot()
  })

  it('should should display min temperature alert', () => {
    const rendered = render(<WeatherCard {...getTestForecast(true, false)} />)

    expect(rendered.getByTestId('min-limit')).toBeInTheDocument()
    expect(rendered.getByText('10°')).toHaveClass('minLimit')
  })

  it('should should display max temperature alert', () => {
    const rendered = render(<WeatherCard {...getTestForecast(false, true)} />)

    expect(rendered.getByTestId('max-limit')).toBeInTheDocument()
    expect(rendered.getByText('10°')).toHaveClass('maxLimit')
  })
})
