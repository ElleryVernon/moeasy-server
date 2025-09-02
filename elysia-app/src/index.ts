import { Elysia } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { config } from './config/env'
import { healthRoutes } from './routes/health'
import { authRoutes } from './routes/auth'
import { surveyRoutes } from './routes/survey'
import { questionRoutes } from './routes/question'

const app = new Elysia()
  .use(swagger({
    path: '/docs',
    documentation: {
      info: { title: 'Moeasy Elysia API', version: '0.1.0' }
    }
  }))
  .get('/', () => ({ message: 'Moeasy Elysia API' }))
  .use(healthRoutes)
  .use(authRoutes)
  .use(surveyRoutes)
  .use(questionRoutes)

app.listen(config.port)

console.log(`Server listening on http://localhost:${config.port}`)
console.log(`Swagger UI: http://localhost:${config.port}/docs`)
