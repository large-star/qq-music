
export const getData = (el,name,val) => {
  const prefix = 'data-'
  name = prefix + name
  if(val) {
    el.setAttribute(name,val)
  }else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for(let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if(vendor === false){
    return false
  }
  if(vendor === 'standard') {
    return style
  }
  
  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

export const getRandomInt = (min,max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const shuffle = (arr) => {
  let _arr = arr.slice()
  let length = _arr.length
  for(let i = 0; i < length; i++) {
    let j = getRandomInt(0,i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

//防抖动  防止 func 频繁调用
export function debounce(func,delay){
  let time = null
  return function(...args){
    if(time) clearTimeout(time)
    time = setTimeout(() => {
      func.apply(this,args)
    }, delay);
  }
}