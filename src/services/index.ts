import HttpRequest, { ResponseData } from '@/utils/request' 
export * from '@/utils/request'
export const oldHttp = new HttpRequest('old') // 旧的接口
export default new HttpRequest()