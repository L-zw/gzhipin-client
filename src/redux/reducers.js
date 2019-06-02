/*
  包含多个由state、actions生成新的state的reducer函数模块，当状态更新时会重新渲染当前页面
 */
import {combineReducers} from 'redux'

import {getRedirectTo} from '../utils'
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


const initUser = {
  username: '', // 用户名
  type: '', // 用户类型 dashen/laoban
  msg: '', // 提示错误信息
  redirectTo: '', // 需要自动跳转的路由path
}

function user (state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS: // 认证成功
      const {type, header} = action.data
      return {...action.data, redirectTo: getRedirectTo(type, header)}
    case ERROR_MSG: // 提示错误信息
      return {...state, msg: action.data}
    case RECEIVE_USER:
      return action.data
    case RESET_USER:
      return {...initUser, msg: action.data}
    default:
      return state
  }
}


const initUserList = []

function userList (state = initUserList, action) {
  switch (action.type) {
    case RECEIVE_USER_LIST:
      return action.data // 返回一个数组
    case RECEIVE_USER_LIST_ERROR_MSG:
      return initUserList // 必须返回一个数组
    default:
      return state
  }
}


const initChat = {
  users: {}, // 包含所有用户信息的对象 {_id:{username, header}, ...}
  chatMsgs: [], // 与当前用户有关的所有聊天消息数组 [{_id, from, to, chat_id, content, read, create_time}, ...]
  unReadTotal: 0 // 总的未读数量
}

function chat(state = initChat, action) {
  switch (action.type) {
    case RECEIVE_MSG_LIST:
      const {users, chatMsgs, userDocId} = action.data
      return {
        users,
        chatMsgs,
        unReadTotal: chatMsgs.reduce((preTotal, chatMsg) => preTotal + (chatMsg.to === userDocId && !chatMsg.read ? 1 : 0), 0)
      }
    case RECEIVE_MSG:
      const {chatMsg} = action.data // 报错：userDocId重复定义
      return {
        users: state.users,
        chatMsgs: [...state.chatMsgs, chatMsg],
        unReadTotal: state.unReadTotal + (chatMsg.to === action.data.userDocId && !chatMsg.read ? 1 : 0)
      }
    case READ_CHAT_MSG:
      const {from, to, count} = action.data
      state.chatMsgs.forEach(msg => {
        if(msg.from===from && msg.to===to && !msg.read) {
          msg.read = true
        }
      })
      return {
        users: state.users,
        chatMsgs: state.chatMsgs.map(chatMsg => {
          if (chatMsg.from === from && chatMsg.to === to && !chatMsg.read) { // 发给我的，未读
            return {...chatMsg, read: true}
          } else {
            return chatMsg
          }
        }),
        unReadTotal: state.unReadTotal - count
      }
    default:
      return state
  }
}


// 返回合并reducer函数后的对象
export default combineReducers({
  user,
  userList,
  chat
})