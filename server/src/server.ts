import Koa from 'koa'
import Router from 'koa-router'

function main() {
  const PORT = process.env.PORT || 8080
  const app = new Koa()
  const router = new Router()

  const config = require('../../config.json')

  router.get('/', ctx => {
    ctx.body = config
  })

  app.use(router.routes())
  app.listen(PORT)
  console.log(`🚀 Server ready at port ${PORT}`)
}

if (require.main === module) {
  main()
}
