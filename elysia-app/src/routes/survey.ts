import { Elysia, t } from 'elysia'
import { ok } from '../types/api'
import { v4 as uuid } from 'uuid'
import QRCode from 'qrcode'
import { uploadToS3 } from '../services/s3'

const surveys = new Map<string, any>()

export const surveyRoutes = new Elysia({ prefix: '/survey' })
  .post('/', ({ body }) => {
    const id = uuid()
    surveys.set(id, { id, ...body, createdAt: new Date().toISOString() })
    return ok({ id })
  }, { body: t.Object({ title: t.String(), description: t.Optional(t.String()) }) })
  .get('/:id', ({ params, set }) => {
    const item = surveys.get(params.id)
    if (!item) { set.status = 404; return { success: false, error: { code: 'NOT_FOUND', message: 'survey not found', timestamp: new Date().toISOString() } } }
    return ok(item)
  })
  .post('/:id/share/qr', async ({ params, set }) => {
    const item = surveys.get(params.id)
    if (!item) { set.status = 404; return { success: false, error: { code: 'NOT_FOUND', message: 'survey not found', timestamp: new Date().toISOString() } } }
    const url = `https://mo-easy.com/survey/${params.id}`
    const png = await QRCode.toBuffer(url, { type: 'png', width: 400 })
    const key = `qr/${params.id}.png`
    const uploaded = await uploadToS3(key, png, 'image/png')
    return ok({ qrUrl: uploaded.url })
  })
