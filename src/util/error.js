/**
 * 服务器状态码和返回的http状态码不一致
 */
export const codeError = () => {
  return new Error('successCode is not equal code')
}

/**
 * 请求超时的错误
 * @param {Number} overtime 超时时间
 * @param {Object} config 超时请求的配置
 */
export const timeoutError = (overtime, config) => {
  return new Error(JSON.stringify({
    message: `Timeout of ${overtime} ms exceeded`,
    config,
  }))
}

/**
 * 重试完所有请求, 依旧还是失败
 * @param {Object} res 请求到的结果
 */
export const retryError = res => {
  return new Error(JSON.stringify({
    message: 'retry still fails !!!',
    res,
  }))
}
