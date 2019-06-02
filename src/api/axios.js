/*
  使用axios封装的ajax请求函数
  函数返回的是promise对象
 */
import axios from 'axios'

export default function ajax (url = '', data = '', type = 'GET') {
  if (type === 'GET') {
    // data: {username: dashen1, password: 123, type: dashen}
    // dataStr: username=dashen1&password=123&type=dashen
    let dataStr = ''
    Object.keys(data).forEach(key => { // Object.key(data) 方法会返回一个由data对象的可枚举属性组成的数组
      dataStr += key + '=' + data[key] + '&'
    })
    if (data) { // 如果data参数不为空
      dataStr = dataStr.substring(0, dataStr.lastIndexOf('&')) // 删除最后一个 &
      url = url + '?' + dataStr
    }
    // 发送get请求
    return axios.get(url)
  } else{
    // 发送post请求
    return axios.post(url, data)
  }
}