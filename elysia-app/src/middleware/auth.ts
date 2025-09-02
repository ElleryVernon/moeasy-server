import { Elysia } from 'elysia'
import jwtPlugin from '@elysiajs/jwt'
import { config } from '../config/env'

export const authPlugin = new Elysia({ name: 'auth' })
  .use(jwtPlugin({ name: 'jwt', secret: config.jwt.secret }))
  .derive(({ jwt }) => ({ jwt }))
  .guard({ beforeHandle: async ({ jwt, headers, set }) => {
    const auth = headers['authorization']
    if (!auth?.startsWith('Bearer ')) {
      set.status = 401
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Missing bearer token', timestamp: new Date().toISOString() } }
    }
    const token = auth.slice('Bearer '.length)
    const payload = await jwt.verify(token)
    if (!payload) {
      set.status = 401
      return { success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid token', timestamp: new Date().toISOString() } }
    }
    return
  } })
