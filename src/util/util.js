const { toString } = Object.prototype

export function isDate(val) {
  return toString.call(val) === '[object Date]'
}

export function isPlainObject(val) {
  return toString.call(val) === '[object Object]'
}
