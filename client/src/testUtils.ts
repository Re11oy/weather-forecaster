export const testDate = new Date(2020, 10)

export const getTestForecast = (
  isMinimumReached = false,
  isMaximumReached = false,
) => ({
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
