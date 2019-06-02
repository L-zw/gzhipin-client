/*
  用户列表UI组件
 */
import React, {Component} from 'react'
import {Card, WingBlank, WhiteSpace} from 'antd-mobile'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import QueueAnim from 'rc-queue-anim'

const Header = Card.Header
const Body = Card.Body

class UserList extends Component {

  static propsTypes = {
    userList: PropTypes.array.isRequired
  }

  render() {
    return (
      <WingBlank style={{marginTop: 50, marginBottom: 50}}>
        <QueueAnim type="bottom" delay={100}>
          {
            this.props.userList.map(user => (
              <div key={user._id}>
                <WhiteSpace/>
                <Card onClick={() => this.props.history.push(`/chat/${user._id}`)}>
                  <Header thumb={user.header ? require(`../../assets/images/${user.header}.png`) : require('../../assets/images/header.png')} extra={user.username} />
                  <Body>
                  <div>{user.type === 'laoban' ? '招聘职位' : '求职岗位'}：{user.post}</div>
                  {user.company ? <div>公司名称: {user.company}</div> : null}
                  {user.salary ? <div>职位薪资: {user.salary}</div> : null}
                  <div>{user.type === 'laoban' ? '职位要求' : '个人简介'}：{user.info}</div>
                  </Body>
                </Card>
              </div>
            ))
          }
        </QueueAnim>
      </WingBlank>
    )
  }
}
export default withRouter(UserList)