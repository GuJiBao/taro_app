
import Taro from '@tarojs/taro'
import { RequestOpts } from '@tarojs/api'
import { EncryptionParameters } from './maskSign'
import config from '@/config'
const { api: { version, apiBaseUrl, oldApiBaseUrl } } = config

interface CallbackResult {
  (res: any): void
}

export interface RequestOpts {
  // Taro request请求参数
  url: string,
  complete?: CallbackResult,
  data?: any,
  dataType?: 'json' | any,
  fail?: CallbackResult,
  header?: any,
  method?: 'OPTIONS' | 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'TRACE' | 'CONNECT',
  responseType?: 'text' | 'arraybuffer',
  success?: CallbackResult,
  jsonp?: boolean,
  jsonpCache?: boolean,
  mode?: 'no-cors' | 'cors' | 'same-origin',
  credentials?: 'same-origin' | 'include' | 'omit',
  cache?: 'default' | 'no-cache' | 'reload' | 'force-cache' | 'only-if-cached',
  timeout?: number,
  retryTimes?: number,
  backup?: string | string[],
  dataCheck?: () => boolean,
  useStore?: boolean,
  storeCheckKey?: string,
  storeSign?: string,
  storeCheck?: () => boolean,
  // 自定义的参数
  headerType?: string
}

export interface ResponseData {
  code: number;
  data?: any;
  msg: string
}

class HttpRequest {
  private time: number;
  private baseUrl: string;
  constructor(urlPrefix: string = 'new') {
    this.baseUrl = urlPrefix === 'old' ? oldApiBaseUrl : apiBaseUrl
    this.time = (new Date()).valueOf()
  }
  public request(options: RequestOpts) {
    options = this.mergeConfig(options)
    // 添加拦截器
    Taro.addInterceptor((chain) => this.interceptor(chain))
    // 发起请求
    return <ResponseData><unknown> Taro.request(options)
  }
  private interceptor(chain) {
    const requestParams = chain.requestParams
    const { method, data, url } = requestParams
    const arr = {
      'Api-Version': version,
      'Timestamp': this.time
    }

    // 生成签名
    let sign = EncryptionParameters(Object.assign({}, data, arr))
    if (sign) {
      requestParams.header.sign = sign
    }
    let token = Taro.getStorageSync('token')
    if (token) {
      requestParams.header.Authorization = 'Bearer ' + token
    }

    console.log(`http ${method || 'GET'} --> ${url} data: `, data)

    return chain.proceed(requestParams)
      .then(res => {
        console.log(`http <-- ${url} result:`, res)
        return res.data
      })
  }
  private mergeConfig(options: RequestOpts): RequestOpts {
    let { 
      url,
      header,
      headerType = 'application/json'
    } = options

    // 设置header
    header = {
      ...header,
      'Content-Type': headerType,
      'Api-Version': version,
      'Timestamp': this.time,
      's-client': 'weapp',
      'sdk': 'sjx'
    }

    return Object.assign(options, {
      url: this.baseUrl + url,
      header
    })
  }
}

export default HttpRequest




// 以下作废
// const request = (opts: RequestOpts) => {
//   let {
//     url,
//     header,
//     headerType = 'application/json'
//   } = opts

//   const time = (new Date()).valueOf()

//   const arr = {
//     'Api-Version': version,
//     'Timestamp': time
//   }

//   // 设置header
//   header = {
//     'Content-Type': headerType,
//     'Api-Version': version,
//     'Timestamp': time,
//     's-client': 'weapp',
//     'sdk': 'sjx'
//   }

//   // 拦截器设置
//   const interceptor = function (chain) {
//     const requestParams = chain.requestParams
//     const { method, data, url } = requestParams
//     // 生成签名
//     let sign = EncryptionParameters(Object.assign({}, data, arr))
//     if (sign) {
//       requestParams.header.sign = sign
//     }
//     let token = Taro.getStorageSync('token')
//     if (token) {
//       requestParams.header.Authorization = 'Bearer ' + token
//     }

//     console.log(`http ${method || 'GET'} --> ${url} data: `, data)

//     return chain.proceed(requestParams)
//       .then(res => {
//         console.log(`http <-- ${url} result:`, res)
//         return res
//       })
//   }
//   Taro.addInterceptor(interceptor)

//   url = BASE_URL + url

//   Taro.request({
//     ...opts,
//     header,
//     url
//   })
// }

// export default request