import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, WhiteSpace, InputItem, TextareaItem, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import {update} from '../../redux/actions'

class DashenInfo extends Component {
  state = {
    header: '', //头像名称
    post: '', // 求职岗位
    info: '', // 个人简介
  }

  // 更新头像名称
  setHeader = (header) => {
    this.setState({
      header
    })
  }

  // 监视状态值的改变并更新
  handleChange = (name, val) => {
    this.setState({
      [name]: val
    })
  }

  // 保存老板信息
  save = () => {
    this.props.update(this.state)
  }

  render () {
    // 如果用户信息已完善，则重定向到大神界面
    const {header} = this.props.user
    if (header) {
      return <Redirect to='/dashen'/>
    }

    return (
      <div>
        <NavBar>大神信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader} />
        <WhiteSpace/>
        <InputItem placeholder='请输入求职岗位' onChange={(val) => this.handleChange('post', val)}>求职岗位</InputItem>
        <TextareaItem placeholder='请输入个人简介' title="个人简介" rows={3} onChange={(val) => this.handleChange('info', val)} />
        <WhiteSpace/>
        <WhiteSpace/>
        <Button type="primary" onClick={this.save}>保&nbsp;&nbsp;&nbsp;存</Button>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {update}
)(DashenInfo)