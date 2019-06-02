/*
  用户主界面
 */
import React, {Component} from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import Cookies from 'js-cookie'
import {NavBar} from 'antd-mobile'

import LaobanInfo from '../laoban-info/laoban-info'
import DashenInfo from '../dashen-info/dashen-info'
import Laoban from '../laoban/laoban'
import Dashen from '../dashen/dashen'
import Message from '../message/message'
import Personal from '../personal/personal'
import NavFooter from '../../components/nav-footer/nav-footer'
import NotFound from '../../components/not-found/not-found'
import Chat from '../chat/chat'

import {getRedirectTo} from '../../utils'
import {getUser} from '../../redux/actions'

class Main extends Component {

  // Main的每个子路由相关信息
  navList = [
    {
      path: '/laoban', // 路由路径
      component: Laoban,
      title: '大神列表',
      icon: 'dashen',
      text: '大神',
    },
    {
      path: '/dashen', // 路由路径
      component: Dashen,
      title: '老板列表',
      icon: 'laoban',
      text: '老板',
    },
    {
      path: '/message', // 路由路径
      component: Message,
      title: '消息列表',
      icon: 'message',
      text: '消息',
    },
    {
      path: '/personal', // 路由路径
      component: Personal,
      title: '用户中心',
      icon: 'personal',
      text: '个人',
    }
]

  // 组件第一次渲染后
  componentDidMount () {
    // 根据cookie发送ajax请求，实现自动登录
    const userDocId = Cookies.get('userDocId')
    const {_id} = this.props.user
    if (userDocId && ! _id) {
      this.props.getUser()
    }
  }

  render () {
    /*
     cookie中是否有userDocId
         没有：表示用户还没有登录过，此时应重定向到登录界面
         有：查看redux状态中是否有_id
             没有：表示其已注册或登录过，当前未登录，可能是登录后直接关闭浏览器（redux中没有数据），此时要实现自动登录，即发送ajax请求从后台获取用户数据，
                  在render()里面无法发送请求，所以在生命周期函数里面调用，不用渲染页面
             有：表示其已注册或登录过，当前已经登录，此时要显示相应的界面，
                 点击登录/注册按钮，且授权成功（注册、登录）时，已经在register/login界面进行了重定向，但如果此时手动输入路径请求根路径则要重定向到相应界面
     */
    const userDocId = Cookies.get('userDocId')
    if (!userDocId) {
      return <Redirect to="/login"/>
    }
    const {user} = this.props
    if (!user._id) {
      return null
    } else {
      let path = this.props.location.pathname
      if (path === '/') {
        path = getRedirectTo(user.type, user.header)
        return <Redirect to={path} />
      }
    }

    const {navList} = this
    const path = this.props.location.pathname // 获取当前请求的路径
    const currentNav = navList.find(nav => nav.path === path)// 计算当前的nav，确定展示哪个组件，也可能没有值

    if (currentNav) { // 如果currentNav有值，对 大神列表 或 老板列表 进行隐藏
      if (user.type === 'laoban') { // 隐藏 老板列表
        navList[1].isHide = 'true'
      } else { // 隐藏 大神列表
        navList[0].isHide = 'true'
      }
    }

    return (
      <div>
        {currentNav ? <NavBar className="stick-top">{currentNav.title}</NavBar> : null}
        <Switch>
          <Route path="/laobaninfo" component={LaobanInfo}/>
          <Route path="/dasheninfo" component={DashenInfo}/>
          {
            navList.map(nav => <Route key={nav.path} path={nav.path} component={nav.component}/>)
          }
          <Route path="/chat/:userDocId" component={Chat}/>
          <Route component={NotFound}/>
        </Switch>
        {currentNav ? <NavFooter navList={navList} unReadTotal={this.props.chat.unReadTotal} /> : null}
      </div>
    )
  }
}
export default connect(
  state => ({user: state.user, chat: state.chat}),
  {getUser}
)(Main)