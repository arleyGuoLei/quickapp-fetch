import { buildURL } from './url'

/**
 * 生成完整的请求配置, 后面的对象值会替换前面的对象值
 */
export function mergeConfig() {
  const len = arguments.length
  let config = {}
  for (let i = 0; i <= len; i += 1) {
    const obj = arguments[i]
    config = {
      ...config,
      ...obj,
    }
  }
  /**
   * 完整配置的初始值
   */
  const {
    url = '', data = {}, header = {}, method = 'GET', responseType = 'json', // 快应用原有属性 https://doc.quickapp.cn/features/system/fetch.html?h=fetch
    baseUrl, timeout, retry, successCode, debug, retryCondition, // 初始化时候的属性, 类似继承配置
    params = {}, // 请求的拓展属性
  } = config
  return {
    url,
    data,
    header,
    method,
    responseType,
    baseUrl,
    timeout,
    retry,
    successCode,
    debug,
    params,
    retryCondition,
  }
}

/**
 * 生成符合快应用请求的参数数据
 * @param {Object} config 完整配置
 */
export function markFetchConfig(config) {
  const {
    baseUrl, url, params, data, header, method, responseType,
  } = config
  const finallyUrl = buildURL(baseUrl, url, params)
  const obj = {}
  if (Object.keys(data).length !== 0) {
    obj.data = data
  }
  if (Object.keys(header).length !== 0) {
    obj.header = header
  }
  if (responseType !== '') {
    obj.responseType = responseType
  }
  return {
    url: finallyUrl,
    method,
    ...obj,
  }
}
