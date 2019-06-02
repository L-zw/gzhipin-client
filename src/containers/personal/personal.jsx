/*
  个人中心界面路由
 */
import React, {Component} from 'react'
import {Result, List, WhiteSpace, Button, Modal} from 'antd-mobile'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'

import {resetUser} from '../../redux/actions'

const Item = List.Item
const Brief = Item.Brief

class Personal extends Component {

  logout = () => {
    Modal.alert('退出', '确定退出吗？', [
      {text: '取消'},
      {
        text: '确定',
        onPress: () => {
          // 清除cookie中的userDocId
          Cookies.remove('userDocId')
          // 重置redux中的user状态
          this.props.resetUser()
        }
      }
    ])
  }

  render() {
    const {type, header, username, company, post, info, salary} = this.props.user
    const _post = type === 'laoban' ? '招聘职位' : '求职岗位'
    const _info = type === 'laoban' ? '职位要求' : '个人简介'

    return (
      <div>
        <Result img={<img src={require(`../../assets/images/${header}.png`)} style={{width: 50}} alt="头像"/>}
                title={username} message={company} style={{marginTop: 50}}/>
        <List renderHeader={() => '相关信息'}>
          <Item>
            <Brief>{_post}：{post}</Brief>
            {salary ? <Brief>职位薪资：{salary}</Brief> : null}
            <Brief>{_info}：{info}</Brief>
          </Item>
        </List>
        <WhiteSpace/>
        <List>
          <Button type="warning" onClick={this.logout}>退出登录</Button>
        </List>

      </div>
    )
  }
}
export default connect(
  state => ({user: state.user}),
  {resetUser}
)(Personal)