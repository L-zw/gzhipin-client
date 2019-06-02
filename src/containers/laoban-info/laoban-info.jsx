/*
  老板信息完善路由组件
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {NavBar, WhiteSpace, InputItem, TextareaItem, Button} from 'antd-mobile'
import {Redirect} from 'react-router-dom'

import HeaderSelector from '../../components/header-selector/header-selector'
import {update} from '../../redux/actions'

class LaobanInfo extends Component {
  state = {
    header: '', //头像名称
    post: '', // 招聘职位
    company: '', // 公司名称
    salary: '', // 职位薪资
    info: '', // 职位要求
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

  render() {
    // 如果用户信息已完善，则重定向到老板界面
    const {header} = this.props.user
    if (header) {
      return <Redirect to='/laoban'/>
    }

    return (
      <div>
        <NavBar>老板信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader} />
        <WhiteSpace/>
        <InputItem placeholder='请输入招聘职位' onChange={(val) => this.handleChange('post', val)}>招聘职位：</InputItem>
        <InputItem placeholder='请输入公司名称' onChange={(val) => this.handleChange('company', val)}>公司名称：</InputItem>
        <InputItem placeholder='请输入职位薪资' onChange={(val) => this.handleChange('salary', val)}>职位薪资：</InputItem>
        <TextareaItem placeholder='请输入职位要求' title="职位要求" rows={3} onChange={(val) => this.handleChange('info', val)}/>
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
)(LaobanInfo)