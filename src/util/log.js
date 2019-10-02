/* eslint-disable */

/**
 * 打印日志
 * @param {String} intent 打印的内容
 * @param {Boolean} echoLog 是否打印日志
 * @param {String} title 日志的title关键字
 */
export default (intent, echoLog = false, title = 'BiuBiu') => {
  if (!echoLog) {
    return
  }
  if (typeof intent === 'string') {
    console.log('%c' + ' ' + title + ' ', 'background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;',
      intent)
  } else {
    console.log('%c' + ' ↓ ' + title + ' ↓ ', 'background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;')
    console.log(intent)
  }
}

export function callMIAI() {
  try {
    const { qaqRequetReady = null } = console
    if (Object.is(qaqRequetReady, null)) {
      // eslint-disable-next-line no-useless-concat
      console.log('%c aqa-request %c Ready ' + '%c ' + ' %c MIAI-FE %c cool ',
        'background:#35495e; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
        'background:#41b883; p adding: 1px; border-radius: 0 3px 3px 0;  color: #fff',
        'background:transparent',
        'background: #35495e; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
        'background: #41b883; padding: 1px; border-radius: 0 3px 3px 0; color: #fff;')
      Object.defineProperty(console, 'qaqRequetReady', {
        value: true,
        enumerable: false,
      })
    }
  } catch (error) {
    console.log(error)
  }
}
