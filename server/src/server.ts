import Koa, { Next } from 'koa'
import Router from 'koa-router'
import mongoose from 'mongoose'
import { MONGO_CONNECTION_URL } from './environment'
import WeatherForecasts from './models/weather-forecast'

function getRoutes() {
  const router = new Router()

  router.get('/', (ctx) => {
    ctx.status = 200
  })

  router.get('/forecasts', async (ctx) => {
    ctx.body = await WeatherForecasts.find()
  })

  return router.routes()
}

async function main() {
  const PORT = process.env.PORT ?? 8080
  const app = new Koa()

  await mongoose.connect(MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  app.use(
    (ctx: Koa.Context, next: Next): Promise<Next> =>
      next().catch((err) => {
        console.warn('API error', { error: err.message })
        ctx.type = 'json'
        ctx.status = 500
        ctx.body = {
          error: 'Internal Server Error',
        }
      }),
  )
  app.use(getRoutes())
  app.listen(PORT)
  console.log(`🚀 Server ready at port ${PORT}`)
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
