# quickapp-fetch

[快应用请求](https://doc.quickapp.cn/features/system/fetch.html)封装实践, 4.7KB大小即支持请求超时, GET参数, 请求拦截器, 响应拦截器, 条件重试, 请求耗时记录等操作

## 参数索引

参数  | 类型 | 解释 | 默认值 |
:-: | :-: | :-: | :-:
baseUrl | String | 初始URL (最终Url = baseUrl + url) | 空
url | String | 拼接Url | 空
params | Obejct | GET参数(将自动拼接到url) | 空
timeout | Number | 请求超时 (ms) | 0 (不设置超时)
successCode | Number | 请求成功的服务器状态码 | 0 (不设置判断验证)
debug | Boolean | 是否打印日志 | false (不打印)
retry | Number | 满足失败条件的最大重试次数 | 0 (不重试)
retryCondition | Function(response) | 重试条件 (参数为服务器响应), 返回true表示重试, 返回false表示不重试 | return false (不满足重试条件)
data | String/Object/ArrayBuffer | 参考[快应用 - data](https://doc.quickapp.cn/features/system/fetch.html) | 空
header | Object | 参考[快应用 - header](https://doc.quickapp.cn/features/system/fetch.html) | 空
method | String | 参考[快应用 - method](https://doc.quickapp.cn/features/system/fetch.html) | GET
responseType | String | 参考[快应用 - responseType](https://doc.quickapp.cn/features/system/fetch.html) | json


## 实例

1. fetch.js

```js
import Service from 'quickapp-fetch'

/**
 * 参数初始化
 */
const service = new Service({
  baseUrl: 'http://api.alishenshen.cn/dev/',
  timeout: 5000, // 2s超时
  debug: true, // 输出请求日志
  retry: 5, // 失败重试次数
  retryCondition: res => { // 重试条件
    const { code } = res
    // http状态码为401
    if(code === 401){
      return true // 重试
    }
    return false // 不重试
  }
})

/**
 * 请求拦截器1
 */
service.requestHook(config => {
  config.header['m-token'] = '848ad1e7-c66a-49cc-9482-e999485405c2'
  return config
})

/**
 * 请求拦截器2
 */
service.requestHook(config => {
  config.params['appid'] = '971109'
  return config
})

/**
 * 响应拦截器1
 */
service.responseHook(response => {
  const { code, data, duration, config, headers } = response
  return data
})

/**
 * 响应拦截器2
 */
service.responseHook(response => {
  const { data } = response
  return data
})

export default config => {
  return service.request(config)
}
```

2. getData.js

```js
import Fetch from './fetch'

/**
 * 最简单的GET请求
 */
export const getSimpleData = () => {
  return Fetch({
    url: 'search',
    params: {
      'title': '知识经济时代的两大特征是人的知识贡献比例在日益上升以及产业结构日趋'
    },
    timeout: 8000 // 可对全局的参数进行覆盖
  })
}
```