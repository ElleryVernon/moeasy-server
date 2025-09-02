export type ApiSuccess<T> = { success: true; data: T; meta?: Record<string, unknown> }
export type ApiError = { success: false; error: { code: string; message: string; path?: string; timestamp: string } }

export const ok = <T>(data: T, meta?: Record<string, unknown>): ApiSuccess<T> => ({ success: true, data, meta })
export const err = (code: string, message: string, path?: string): ApiError => ({
  success: false,
  error: { code, message, path, timestamp: new Date().toISOString() }
})
