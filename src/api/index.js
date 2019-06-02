/*
  包含n个接口请求函数的模块
  每个函数的返回值都是 promise 对象
 */
import ajax from './axios'

// 请求注册
export const reqRegister = (user) => ajax('/register', user, 'POST')

// 请求登录
export const reqLogin = (user) => ajax('/login', user, 'POST')

// 请求更新用户信息
export const reqUpdate = (user) => ajax('/update', user, 'POST')

// 根据cookie请求用户信息
export const reqUser = () => ajax('/user')

// 根据type请求用户列表
export const reqUserList = (type) => ajax('/userlist', {type})

// 请求获取当前用户的所有聊天记录
export const reqMsgList = () => ajax('/msglist')

// 修改指定消息为已读
export const reqReadChatMsg = (from) => ajax('/readmsg', {from}, 'POST')