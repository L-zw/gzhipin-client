/*
  大神主界面路由
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'

import UserList from '../../components/user-list/user-list'
import {getUserList} from '../../redux/actions'

class Dashen extends Component {
  componentDidMount () {
    this.props.getUserList('laoban')
  }

  render() {
    return (
      <UserList userList={this.props.userList}></UserList>
    )
  }
}
export default connect(
  state => ({userList: state.userList}),
  {getUserList}
)(Dashen)