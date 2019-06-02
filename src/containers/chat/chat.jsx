/*
  对话聊天的路由组件
 */
import React, {Component} from 'react'
import {NavBar, List, InputItem, Icon, Grid} from 'antd-mobile'
import {connect} from 'react-redux'

import {sendMsg, readMsg} from '../../redux/actions'

const Item = List.Item

class Chat extends Component {

  // 组件即将要挂载时初始化表情数组
  componentWillMount () {
    const emojis = ['😃', '😄', '😁', '😳', '😉', '😊', '😇', '😘', '😚', '😋', '😜', '😝',
      '😐', '😶', '😏', '😒', '😌', '😔', '😪', '😷', '😵', '😎', '😫', '😲',
      '😨', '😰', '😥', '😱', '😭', '😢', '👨', '💕', '🎥', '✨', '🎃', '✔',
      '💪', '💬', '🔥', '😈', '👿', '💀', '☠', '💩', '👹', '👺', '👻', '👽',
      '❤', '⚽', '✋', '👋', '👌', '✌', '👈', '👉', '👆', '👇', '👍', '👎'
    ]
    this.emojis = emojis.map(emoji => ({text: emoji}))
  }

  state = {
    content: '', // 初始化发送消息为空
    isShow: false // 是否显示表情列表
  }

  // 当组件第一次挂载后，令窗口滚动条滑到最底
  componentDidMount () {
    window.scrollTo(0, document.body.scrollHeight)
  }

  // 当数据更新后，令窗口滚动条滑到最底
  componentDidUpdate () {
    window.scrollTo(0, document.body.scrollHeight)
  }

  componentWillUnmount () { // 在退出之前
    // 发请求更新消息的未读状态
    const from = this.props.match.params.userDocId
    const to = this.props.user._id
    this.props.readMsg(from, to)
  }

  // 向其他用户发消息
  handleSend = () => {
    // 收集数据
    const from = this.props.user._id
    const to = this.props.match.params.userDocId
    const content = this.state.content.trim()
    // 发送请求
    if(content) {
      this.props.sendMsg({from, to, content})
    }
    // 清除输入框数据
    this.setState({content: ''})
  }

  // 切换显示表情列表的显示隐藏
  toggleShow = () => {
    const isShow = !this.state.isShow
    this.setState({isShow})
    // 异步手动派发 resize 事件，解决表情列表显示的 bug
    if (isShow) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'))
      }, 0)
    }

  }

  render() {

    const {user} = this.props // 当前用户
    const {users, chatMsgs} = this.props.chat // 与当前用户有关的 所有 聊天消息，其中chatMsgs需要过滤得到于某个人的聊天记录
    const targetId = this.props.match.params.userDocId // 与我聊天的人的id


    // console.log('123',users[user._id])
    if(!users[user._id]) { // 如果还没有获取users数据，直接不做任何显示，users初始值为空数组，异步获取之后才有值
      return null
    }
    // console.log('456',users[user._id])


    // targetId是一个变量，值是users的属性名，users[targetId]是取users对象的属性名为 “targetId的值” 的属性值
    // users.targetId这种写法代表targetId是属性名，但实际不是，这种写法是错的
    const targetHeader = users[targetId] ? users[targetId].header : null // 与我聊天的人，可能没有header（即未完善信息）
    const chatId = [user._id, targetId].sort().join('_') // 聊天id（固定两个人的chat_id是不变的）
    const msgs = chatMsgs.filter(chatMsg => chatId === chatMsg.chat_id) // 当前用户与具体某个人的聊天记录

    return (
      <div id='chat-page'>
        <NavBar className="stick-top" icon={<Icon type="left"/>} onLeftClick={() => this.props.history.goBack()}>
          {users[targetId].username}
        </NavBar>
        <List style={{marginTop:50, marginBottom: 50}}>
            {
              msgs.map(msg => {
                if (msg.to === targetId) { // 如果是我发给对方的
                  return (
                    <Item key={msg._id} className='chat-me'extra='我'>
                      {msg.content}
                    </Item>
                  )
                } else { // 如果是对方发给我的
                  return (
                    <Item key={msg._id} thumb={require(`../../assets/images/${targetHeader}.png`)}>
                      {msg.content}
                    </Item>
                  )
                }
              })
            }
        </List>
        <div className='am-tab-bar'>
          <InputItem
            placeholder="请输入"
            value={this.state.content}
            onChange={val => this.setState({content: val})}
            onFocus={() => this.setState({isShow: false})}
            extra={
              <span>
                <span onClick={this.toggleShow} style={{marginRight: 5}}>😃</span>
                <span onClick={this.handleSend}>发送</span>
              </span>
            }
          />
          {this.state.isShow ? (
            <Grid
              data={this.emojis}
              columnNum={10}
              isCarousel={true}
              carouselMaxRow={4}
              onClick={_el => this.setState({content: this.state.content + _el.text})}
            />
          ) : null}
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user, chat: state.chat}),
  {sendMsg, readMsg}
)(Chat)