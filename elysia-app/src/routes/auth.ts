import { Elysia, t } from 'elysia'
import axios from 'axios'
import { config } from '../config/env'
import jwtPlugin from '@elysiajs/jwt'
import { ok, err } from '../types/api'

export const authRoutes = new Elysia({ prefix: '/auth' })
  .use(jwtPlugin({ name: 'jwt', secret: config.jwt.secret }))
  .get('/kakao/login', ({ set }) => {
    const query = new URLSearchParams({
      client_id: config.kakao.clientId,
      redirect_uri: config.kakao.redirectUri,
      response_type: 'code'
    })
    set.redirect = `https://kauth.kakao.com/oauth/authorize?${query.toString()}`
  })
  .get('/kakao/callback', async ({ query, jwt, set }) => {
    const code = (query as any).code as string | undefined
    if (!code) {
      set.status = 400
      return err('BAD_REQUEST', 'code is required', '/auth/kakao/callback')
    }
    try {
      const tokenResp = await axios.post('https://kauth.kakao.com/oauth/token', new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: config.kakao.clientId,
        client_secret: config.kakao.clientSecret,
        redirect_uri: config.kakao.redirectUri,
        code
      }).toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })

      const accessToken = tokenResp.data.access_token as string
      const userResp = await axios.get('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${accessToken}` } })
      const kakaoId = String(userResp.data.id)
      const appToken = await jwt.sign({ sub: kakaoId, provider: 'kakao' })
      return ok({ token: appToken })
    } catch (e: any) {
      set.status = 500
      return err('OAUTH_ERROR', e?.message ?? 'kakao oauth error', '/auth/kakao/callback')
    }
  }, { query: t.Object({ code: t.Optional(t.String()) }) })
