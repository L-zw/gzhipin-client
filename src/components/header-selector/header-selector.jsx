/*
 大神信息完善路由组件
 */
import React, {Component} from 'react'
import {List, Grid} from 'antd-mobile'
import PropTypes from 'prop-types'

export default class HeaderSelector extends Component {
  constructor (props) {
    super(props)
    // 准备需要显示的头像数据
    this.headerArr = []
    for (var i = 0; i < 15; i++) {
      this.headerArr.push({
        icon: require(`../../assets//images/头像${i+1}.png`),
        text: '头像' + (i+1)
      })
    }
  }

  state = {
    icon: '' // 头像图标
  }

  // 接收从dashen-info和laoban-info组件传过来的函数
  static propType = {
    setHeader: PropTypes.func.isRequired
  }

  // 设置头像图片、更新dashen-info和laoban-info组件的header状态
  handleClick = ({icon, text}) => {
    this.setState({icon})
    this.props.setHeader(text)
  }

  render() {
    const {icon} = this.state
    const headerText = !icon ? '请选择头像' : (
      <div>
        已选择头像：<img src={icon} alt="头像"/>
      </div>
    )

    return (
      <List renderHeader={() => headerText}>
        <Grid data={this.headerArr} columnNum={5} onClick={this.handleClick}/>
      </List>
    )
  }
}