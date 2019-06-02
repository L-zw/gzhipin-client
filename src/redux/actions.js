/*
  包含多个action creator
  同步的action、异步的action
 */

import io from 'socket.io-client'
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
  RECEIVE_USER_LIST,
  RECEIVE_USER_LIST_ERROR_MSG,
  RECEIVE_MSG_LIST,
  RECEIVE_MSG,
  READ_CHAT_MSG
} from './action-types'
import {
  reqRegister,
  reqLogin,
  reqUpdate,
  reqUser,
  reqUserList,
  reqMsgList,
  reqReadChatMsg
} from '../api/index'


const authSuccess = (user) => ({type: AUTH_SUCCESS, data: user}) // 同步授权成功信息

const errorMsg = (msg) => ({type: ERROR_MSG, data: msg}) // 同步错误信息

const receiveUser = (user) => ({type: RECEIVE_USER, data: user}) // 同步接收用户完善信息

export const resetUser = (msg) => ({type: RESET_USER, data: msg}) // 同步重置用户完善信息

const receiveUserList = (userList) => ({type: RECEIVE_USER_LIST, data: userList})

const receiveUseListErrorMsg = (msg) => ({type: RECEIVE_USER_LIST_ERROR_MSG, data: msg}) // 同步获取用户列表失败信息

const receiveMsgList = ({users, chatMsgs, userDocId}) => ({type: RECEIVE_MSG_LIST, data: {users, chatMsgs, userDocId}}) // 接收与当前用户有关的消息列表

const receiveMsg = (chatMsg, userDocId) => ({type: RECEIVE_MSG, data: {chatMsg, userDocId}}) // 接收到一条聊天消息

const readChatMsg = ({from, to, count}) => ({type: READ_CHAT_MSG, data: {from, to, count}})

// userDocId: user._id 是cookie中保存的用户标识，在注册、登录时由后台返回并保存



// 异步注册（在组件内调用该方法）
export const register = (user) => {
  // 进行前台表单验证，如果不合法则返回一个同步action对象，提示错误信息
  const {username, password, password2, type} = user
  if (!username || !password) {
    return errorMsg('用户名或密码不能为空！！！')
  } else if (password !== password2) {
    return errorMsg('密码与确认密码不一致！！！')
  }
  return async dispatch => {
    const user = {username, password, type}
    // 发送注册的异步ajax请求
    /*const promise = reqRegister(user) // 返回一个promise对象
    promise.then(response => {
      const result = response.data
    })*/
    const response = await reqRegister(user)
    const result = response.data
    if (result.code === 0) {
      // 获取与用户相关的消息列表
      getMsgList(dispatch, result.data._id)
      // 分发授权成功的action
      dispatch(authSuccess(result.data))
    } else {
      // 分发请求失败的action
      dispatch(errorMsg(result.msg))
    }
  }
}


// 异步登录（在组件内调用该方法）
export const login = (user) => {
  const {username, password} = user
  if (!username || !password) {
    return errorMsg('用户名或密码不能为空！！！')
  }
  return async dispatch => {
    const response = await reqLogin(user)
    const result = response.data
    if (result.code === 0) {
      // 获取与用户相关的消息列表
      getMsgList(dispatch, result.data._id)
      dispatch(authSuccess(result.data))
    } else {
      dispatch(errorMsg(result.msg))
    }
  }
}


// 异步更新信息，在laobaninfo界面成功获取user数据后保存到state
export const update = (user) => {
  return async dispatch => {
    const response = await reqUpdate(user)
    const result = response.data
    if (result.code === 0) { // 更新成功
      dispatch(receiveUser(result.data))
    } else { // 更新失败
      dispatch(resetUser(result.msg))
    }
  }
}


// 根据cookie异步获取用户信息，在main组件加载后调用，实现自动登录
export const getUser = () => {
  return async dispatch => {
    const response = await reqUser()
    const result = response.data
    if (result.code === 0) { // 成功
      // 获取与用户相关的消息列表
      getMsgList(dispatch, result.data._id)
      dispatch(receiveUser(result.data))
    } else { // 失败
      dispatch(resetUser(result.msg))
    }
  }
}


// 异步获取用户列表，在laoban界面调用
export const getUserList = (type) => {
  return async dispatch => {
    const response = await reqUserList(type)
    const result = response.data
    if (result.code === 0) {
      dispatch(receiveUserList(result.data))
    } else {
      dispatch(receiveUseListErrorMsg(result.msg))
    }
  }
}


// 异步获取与当前用户相关的消息数据列表，当用户登录成功后调用，在register()、login()、getUser()内部调用
const getMsgList = async (dispatch, userDocId) => {
  initIO(dispatch, userDocId)
  const response = await reqMsgList()
  const result = response.data
  if (result.code === 0) { // 成功，返回数据：{users: {}, chatMsgs: []}
    const {users, chatMsgs} = result.data
    // 分发同步action，更新数据
    dispatch(receiveMsgList({users, chatMsgs, userDocId}))
  }
}


// 初始化socketIO，返回一个io对象，当执行getMsgList()时调用该函数
const initIO = (dispatch, userDocId) => {
  // 如果当前还没有socket对象才创建，并保存，令其作为io对象的一个属性对象
  if (!io.socket) {
    io.socket = io.connect('ws://localhost:4000')
    // 为socket绑定receiveMsg监听，监视从服务端发送过来的消息chatMsg
    io.socket.on('receiveMsg', chatMsg => {
      console.log('服务端发送消息给所有客户端', chatMsg) // 向所有的客户端发送了该消息
      if (userDocId === chatMsg.from || userDocId === chatMsg.to) { // 如果该消息与自己有关，才分发同步receiveMsg
        dispatch(receiveMsg(chatMsg, userDocId))
      }
    })
  }
}


// 异步向其他用户发送消息，即从客户端向服务端发送消息
export const sendMsg = ({from, to, content}) => {
  return () => {
    io.socket.emit('sendMsg', {from, to, content})
    console.log('客户端发送消息给服务端', {from, to, content})
  }
}


// 读取消息的异步action，表示我已经读了发给我的、未读的消息
export const readMsg = (from, to) => {
  return async dispatch => {
    const response = await reqReadChatMsg(from)
    const result = response.data
    if (result.code === 0) {
      const count = result.data
      dispatch(readChatMsg({from, to, count}))
    }
  }
}