// eslint-disable-next-line import/no-unresolved
import nativeFetch from '@system.fetch'
import { markFetchConfig } from '../util/tool'
import Log from '../util/log'
import { timeoutError } from '../util/error'

/**
 * 发送请求超时
 * @param {Number} overtime 超时时间
 * @param {Object} config 完整配置项
 */
export const timeoutPromise = (overtime, config) => {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reject(timeoutError(overtime, config))
    }, overtime)
  })
}

/**
 * 发送请求
 * @param {Object} config 完整配置项
 */
export const requestPromise = config => {
  const fetchConfig = markFetchConfig(config)
  Log(fetchConfig, config.debug, 'fetchConfig')
  return new Promise((reslove, reject) => {
    const time = Date.now()
    nativeFetch.fetch({
      ...fetchConfig,
      success: res => {
        /**
         * 超时之后, 请求的回调函数还是会继续执行, 也就是继续打印下面的信息, 但是reslove状态不会被race接收
         */
        Log(res, config.debug, '服务端返回数据')
        reslove({
          duration: Date.now() - time,
          config,
          ...res,
        })
      },
      fail: err => {
        reject(err)
      },
      complete: res => {
      },
    })
  })
}

/**
 * 请求拦截器的执行处理
 * @param {Object} config 完整配置
 * @param {Array} interceptor 拦截器函数数组
 */
export const buildHookRequest = (config, interceptor = []) => {
  interceptor.forEach(hook => {
    config = hook({ ...config })
  })
  Log(config, (config.debug || false), '所有请求拦截器处理之后的配置项')
  return config
}

/**
 * 响应拦截器的执行处理
 * @param {Object} res 请求响应
 * @param {Array} interceptor 拦截器函数数组
 */
export const buildHookResponse = (res, interceptor = []) => {
  Log(res, ((res.config || {}).debug || false), '程序处理初次传入响应拦截器的值')

  let data = res
  interceptor.forEach(hook => {
    data = hook({ ...data })
  })
  Log(data, ((res.config || {}).debug || false), '所有请求拦截器处理之后的配置项')
  return data
}
