/*
  用户登录的路由组件
 */
import React, {Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  WhiteSpace,
  InputItem,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from "react-router-dom"

import Logo from '../../components/logo/logo'
import {login} from '../../redux/actions'

class Login extends Component {
  state = {
    username: '', // 用户名
    password: '' // 密码
  }

  // 当用户操作时更新状态
  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  // 登录
  login = () => {
    this.props.login(this.state)
  }
  
  // 跳转到注册界面
  toRegister = () => {
    this.props.history.replace('/register')
  }

  render () {
    const {redirectTo, msg} = this.props.user
    if (redirectTo) { // 可能跳转到用户界面或用户信息完善界面
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo/>
        <WingBlank>
          {msg ? <p className="error-msg">{msg}</p> : null}
          <List>
            <WhiteSpace/>
            <InputItem placeholder="请输入用户名" onChange={val => this.handleChange('username', val)}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder="请输入密码" onChange={val => this.handleChange('password', val)}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
            <WhiteSpace/>
            <Button type="primary" onClick={this.login}>登录</Button>
            <WhiteSpace/>
            <Button onClick={this.toRegister}>还没有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {login}
)(Login)