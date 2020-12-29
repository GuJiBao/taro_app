import http, { oldHttp, RequestOpts, ResponseData } from './index'

export interface LoginParam {
  tel: string;
  code: string | number
}

export interface SendCodeParam {
  phone: string
}

// 手机号码登录
export const login = async (data: LoginParam) => {
  return await oldHttp.request({
    url: '/delivery/app/login',
    data,
    method: 'POST'
  })
}

// 发送验证码
export const sendCode = async (data: SendCodeParam) => {
  return await oldHttp.request({
    url: '/delivery/send/sms',
    data,
    method: 'POST'
  })
}