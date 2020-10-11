import React from 'react'
import { render } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('should just render without crash', () => {
    const rendered = render(<App />)
    expect(rendered).toBeDefined()
  })
})
