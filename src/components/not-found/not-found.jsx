/*
  提示找不到页面的UI组件
 */
import React, {Component} from 'react'
import {Button} from 'antd-mobile'

export default class NotFound extends Component {
  render() {
    return (
      <div>
        <h2 className="not-found">抱歉，找不到该页面!</h2>
        <Button type="primary" onClick={() => this.props.history.replace("/")}>回到首页</Button>
      </div>
    )
  }
}