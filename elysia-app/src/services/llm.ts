import axios from 'axios'
import { config } from '../config/env'

export type GenerateQuestionParams = { context: string }

export const generateQuestions = async ({ context }: GenerateQuestionParams) => {
  if (!config.ncs.apiKey || !config.ncs.endpoint) return [{ id: 'q1', text: '귀하의 업종은 무엇인가요?' }]
  // Example placeholder: adapt to real NCS API
  const resp = await axios.post(
    config.ncs.endpoint,
    { prompt: `온보딩 설문을 위해 다음 맥락을 바탕으로 5개 문항을 만들어줘: ${context}` },
    { headers: { 'X-API-KEY': config.ncs.apiKey } }
  )
  return resp.data?.questions ?? []
}
