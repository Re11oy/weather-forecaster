import React from 'react'
import { render, waitFor } from '@testing-library/react'
import App from './App'
import { getTestForecast } from './testUtils'

describe('App', () => {
  it('should fetch list of forecasts and render it', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([getTestForecast(true)]))

    const rendered = render(<App />)
    await waitFor(() => rendered.getByText('Helsinki'))

    expect(rendered.getByText('Sun')).toBeInTheDocument()
    expect(rendered.getByText('01 Nov')).toBeInTheDocument()
    expect(rendered.getByText('10°')).toBeInTheDocument()
  })
})
