import { MilvusClient } from '@zilliz/milvus2-sdk-node'
import { config } from '../config/env'

let client: MilvusClient | null = null

export const getMilvus = () => {
  if (!client) client = new MilvusClient({ address: config.milvus.address, username: config.milvus.username, password: config.milvus.password })
  return client
}
