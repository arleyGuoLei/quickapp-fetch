import Log, { callMIAI } from '../util/log'
import { timeoutPromise, requestPromise, buildHookRequest, buildHookResponse } from './dispatchRequest'
import { mergeConfig } from '../util/tool'
import { retryError, codeError } from '../util/error'

export default class Service {
  /**
   * 初始化Service配置
   * @param {Object} config 配置项
   * 可传入的配置项如下 ↓
   * @baseUrl 全局baseUrl
   * @timeout 超时时间 ms
   * @retry 重试次数
   * @successCode 请求成功的服务器状态码
   * @debug 是否打印日志
   */
  constructor(config) {
    this.config = {
      timeout: 0,
      retry: 0,
      successCode: 0,
      debug: false,
      retryCondition: () => (false), // 重试的条件, 返回true为重试, 返回false不重试
      ...config,
    }

    /**
     * hook 拦截器
     */
    this.interceptors = {
      request: [],
      response: [],
    }

    if (this.config.debug) {
      callMIAI() // 打印logo
    }
  }

  /**
   * 请求拦截器
   * @param {Function} interceptor 请求拦截器函数
   */
  requestHook(interceptor) {
    this.interceptors.request.push(interceptor)
  }

  /**
   * 响应拦截器
   * @param {Function} interceptor 响应拦截器函数
   */
  responseHook(interceptor) {
    this.interceptors.response.push(interceptor)
  }

  /**
   * 通过快应用的Fetch发送请求
   * @param {Object} config 请求的配置项
   */
  request(config = {}) {
    /**
     * 合并初始化时候 和 请求发送时候配置的参数(后面的对象属性将替换前面的属性值)
     */
    const mergeRequestConfig = mergeConfig(this.config, config)

    const fullConfig = buildHookRequest({ ...mergeRequestConfig }, this.interceptors.request)

    const {
      timeout,
      retry,
      successCode,
      debug,
      retryCondition,
    } = fullConfig

    const timeoutRequest = timeoutPromise(timeout, fullConfig)
    const request = requestPromise(fullConfig)
    Log(fullConfig, debug, 'fullConfig')

    return new Promise((resolve, reject) => {
      Promise.race([request, timeoutRequest])
        .then(res => {
          /**
           * 重试逻辑
           * 1. 是否满足传入的retryCondition函数, 函数return true为重试, 否则不重试
           * 2. 是否有剩余的重试次数
           * 如果有重试, 并且重试完所有次数, 将抛出retryError
           */
          const retryCheck = retryCondition(res)
          Log(retryCheck, debug, '是否满足重试函数')

          if (retryCheck) {
            if (retry >= 1) {
              Log(retry, debug, '剩余请求次数')
              return this.request({
                ...config,
                retry: retry - 1,
              }).then(res => {
                resolve(res)
              }).catch(e => {
                reject(e)
              })
            }
            return reject(retryError(res))
          }

          /**
           * 成功的code 不等于服务器code
           */
          if (successCode !== 0 && successCode !== res.code) {
            return reject(codeError(fullConfig))
          }

          /**
           * 符合所有条件, 返回数据（先经过响应拦截器处理）
           */
          const data = buildHookResponse({ ...res }, this.interceptors.response)
          resolve(data)
        }).catch(e => {
          Log(e, debug, '请求发生错误')
          reject(e)
        })
    })
  }
}
