/*
  对话消息列表界面路由
  该组件显示包括我与其他用户聊天的最后一条消息
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {List, Badge} from 'antd-mobile'
import QueueAnim from 'rc-queue-anim'

const Item = List.Item
const Brief = Item.Brief

// 根据已有数组生成包含所有最后一条消息的数组，每条消息都是一个对象 chatMsg: {_id, from, to, chat_id, content, read, create_time}
/*
  1.根据chat_id分组，并且只保留每组的最后一条消息，这是就涉及到消息保存在哪（数组/对象）？
      -> 数组 [下标: chatMsg, ...] 不可行
      -> 对象 {属性名: chatMsg, ...} 根据对象的属性名不可重复，利用chat_id实现分组，得到对象：{chat_id1: chatMsg, chat_id2: chatMsg, ...}
  2.将对象转为数组，用于之后的遍历产生结构标签
  3.对数组按create_time降序排序
 */
/*
  为每个chatMsg添加一个属性unReadCount，标识每个聊天分组的未读消息数量，并且对最后一条消息的unReadCount实现更新、累加
 */
const getLastMsgs = (chatMsgs, userDocId) => {
  // 1.分组并保存
  const lastMsgsObj = {}
  chatMsgs.forEach(chatMsg => {

    if (chatMsg.to === userDocId && !chatMsg.read) { // 此消息是别人发给我的、而且未读
      chatMsg.unReadCount = 1
    } else {
      chatMsg.unReadCount = 0
    }

    // 得到某组聊天的chat_id
    const chatId = chatMsg.chat_id

    // 根据chatId得到lastMsgsObj里的某组聊天的最后一条消息，也可能还没有（相当于原来的，而chatMsg相当于新的）
    const lastMsg = lastMsgsObj[chatId]

    if (!lastMsg) { // 没有，将chatMsg塞进去，unReadCount值为 1
      lastMsgsObj[chatId] = chatMsg
    } else { // 有，留下create_time大的，对unReadCount进行累加
      lastMsgsObj[chatId] = lastMsg.create_time > chatMsg.create_time ? lastMsg : chatMsg
      lastMsgsObj[chatId].unReadCount = lastMsg.unReadCount + chatMsg.unReadCount
    }
  })

  // 2.将对象转为数组
  const lastMsgs = Object.values(lastMsgsObj)

  // 3.排序
  lastMsgs.sort((m1, m2) => {
    return  m2.create_time - m1.create_time
  })

  // console.log(lastMsgs)
  return lastMsgs
}


class Message extends Component {

  render() {
    // 得到当前用户
    const user = this.props.user
    // 得到所有用户对象集合和每一条聊天的具体信息 users:{userid:{username，header}, ...} chatMsgs:[{from, to, ...}, ...]
    const {users, chatMsgs} = this.props.chat
    // 得到我与其他用户聊天的最后一条消息数组
    const lastMsgs = getLastMsgs(chatMsgs, user._id)

    return (
      <List style={{marginTop:50, marginBottom: 50}}>
        {/*alpha left right top bottom scale scaleBig scaleX scaleY*/}
        <QueueAnim type="scale" delay={100}>
          {
            lastMsgs.map(lastMsg => {
              // 得到与我聊天的人的id
              const targetId = lastMsg.to === user._id ? lastMsg.from : lastMsg.to

              // 得到得到与我聊天的人的信息（username、header）
              const targetUser = users[targetId]
              return (
                <Item
                  key={lastMsg._id}
                  extra={<Badge text={lastMsg.unReadCount}/>}
                  thumb={targetUser.header ? require(`../../assets/images/${targetUser.header}.png`) : require('../../assets/images/header.png')}
                  arrow='horizontal'
                  onClick={() => this.props.history.push(`/chat/${targetId}`)}
                >
                  {lastMsg.content}
                  <Brief>{targetUser.username}</Brief>
                </Item>
              )
              // 也可以在该组件调用readMsg()，但是这样做，当用户在组件（chat）内与 A 聊天时，A发消息给我，
              // 退出后（chat组件死亡时）不会更新状态，需要在chat组件的componentWillUnmount()中调用readMsg()...
            })
          }
        </QueueAnim>
      </List>
    )
  }
}
export default connect(
  state => ({user: state.user, chat: state.chat}),
  {}
)(Message)