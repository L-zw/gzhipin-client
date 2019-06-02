/*
  用户注册的路由组件
 */
import React, {Component} from 'react'
import {
  NavBar,
  WingBlank,
  List,
  WhiteSpace,
  InputItem,
  Radio,
  Button
} from 'antd-mobile'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

import Logo from '../../components/logo/logo'
import {register} from '../../redux/actions'

const Item = List.Item // 该行代码必须在所有import语句后面

class Register extends Component {
  state = {
    username: '', // 用户名
    password: '', // 密码
    password2: '', // 确认密码
    type: 'dashen' // 用户类型
  }

  // 当用户操作时更新状态
  handleChange = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  // 注册
  register = () => {
    this.props.register(this.state)
  }

  // 跳转到登录界面
  toLogin = () => {
    this.props.history.replace('/login')
  }

  render () {
    const {type} = this.state
    const {redirectTo, msg} = this.props.user
    if (redirectTo) { // 跳转到用户信息完善界面
      return <Redirect to={redirectTo}/>
    }

    return (
      <div>
        <NavBar>硅&nbsp;谷&nbsp;直&nbsp;聘</NavBar>
        <Logo />
        <WingBlank>
          {msg ? <p className="error-msg">{msg}</p> : null}
          <List>
            <WhiteSpace/>
            <InputItem placeholder="请输入用户名" onChange={val => this.handleChange('username', val)}>用户名：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder="请输入密码" onChange={val => this.handleChange('password', val)}>密&nbsp;&nbsp;&nbsp;码：</InputItem>
            <WhiteSpace/>
            <InputItem type="password" placeholder="请输入确认密码" onChange={val => this.handleChange('password2', val)}>确认密码：</InputItem>
            <WhiteSpace/>
            <Item>
              <span>用户类型：</span>
              <Radio style={{marginLeft:30}} checked={type==='dashen'} onClick={() => this.handleChange('type', 'dashen')}>大神</Radio>
              <Radio style={{marginLeft:30}} checked={type==='laoban'} onClick={() => this.handleChange('type', 'laoban')}>老板</Radio>
            </Item>
            <WhiteSpace/>
            <Button type="primary" onClick={this.register}>注册</Button>
            <WhiteSpace/>
            <Button onClick={this.toLogin}>已有账户</Button>
          </List>
        </WingBlank>
      </div>
    )
  }
}

export default connect(
  state => ({user: state.user}),
  {register}
)(Register)