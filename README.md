# weather-forecaster

![CI](https://github.com/Re11oy/weather-forecaster/workflows/Node.js%20CI/badge.svg)

Simple weather forecast service. Retrieves the weather forecast for the specified locations and checks to see if the temperature exceeds the specified limits in the next few days.

## Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [MongoDB](https://docs.mongodb.com/manual/installation/)
- [Docker](https://www.docker.com/products/docker-desktop)

## Development

- Install dependencies
```bash
yarn install
```

- Start service and MongoDB instance. MongoDB starts inside the Docker container.
```bash
yarn start-with-db
```

- Or you can use your own MongoDB instance. The connection URL should be provided in the `.env` file.
```bash
yarn start
```

Client application opens on `http://localhost:3000/`

### Environment

Environment variables loads from a `.env` file. Used [dotenv](https://github.com/motdotla/dotenv#readme) module.

`MONGO_CONNECTION_URL` - [MongoDB connection string](https://docs.mongodb.com/manual/reference/connection-string/)

`WEATHER_PROVIDER` - The external provider of weather forecasts: `NOOP` - dummy testing provider, `OW` - Open Weather;
By default, used [Open Weather](https://openweathermap.org/api) provider.
                            
`OPEN_WEATHER_API_KEY` - Open Weather API key (APPID) 

### Configuration

The service uses **config.json** for alerts configuration. The config can be changed during service work, actual config will be applied during the next run. 

```js
{
  "checkingFrequencyMinutes": 5,   // external weather provider polling interval in minutes
  "forecastDays": 5,               // monitorable period
  "alerts": [                      // list of alerts  
    {
      "city": "City name",
      "lat": 60.192059,            // location latitude
      "lon": 24.945831,            // location longitude
      "minTemp": 4,                // minimal temperature alert limit
      "maxTemp": 12                // maximal temperature alert limit
    },
    ...
  ]
}
```

### Testing

CI server starts unit and integration tests.

- Run client and server unit tests. 

```bash
yarn test
```

- Integration tests can be run using a script.
```
./scripts/run-integration-tests.sh
```

## TODO

- Add the client, server, and worker Dockerfiles
- Refactor worker to the cloud lambda function
- Integrate cron task orchestrator (e.g. [Agenda](https://github.com/agenda/agenda#readme))
- Setup production builds workflow and implement continuous deployment
