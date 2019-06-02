/*
  底部导航的UI组件
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {TabBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'

const Item = TabBar.Item

class NavFooter extends Component {
  static propTypes = {
    navList: PropTypes.array.isRequired,
    unReadTotal: PropTypes.number.isRequired
  }

  render() {
    let {navList} = this.props
    const path = this.props.location.pathname
    navList = navList.filter(nav => !nav.isHide)
    return (
      <TabBar>
        {
          navList.map(nav => <Item key={nav.path}
                                   badge={nav.path === '/message' ? this.props.unReadTotal : 0}
                                   title={nav.text}
                                   icon={{uri: require(`./images/${nav.icon}.png`)}}
                                   selectedIcon={{uri: require(`./images/${nav.icon}-selected.png`)}}
                                   selected={nav.path === path}
                                   onPress={() => this.props.history.replace(nav.path)}
          />)
        }
      </TabBar>
    )
  }
}

// 向外暴露withRouter()包装的组件
// 内部会向组件传入一些路由组件特有的属性：history/location/math
export default withRouter(NavFooter)