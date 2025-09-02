import { Elysia, t } from 'elysia'
import { ok } from '../types/api'
import { generateQuestions } from '../services/llm'

export const questionRoutes = new Elysia({ prefix: '/question' })
  .post('/onboarding', async ({ body }) => {
    const questions = await generateQuestions({ context: body.context })
    return ok({ questions })
  }, { body: t.Object({ context: t.String() }) })
