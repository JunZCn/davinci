import * as React from 'react'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import LoginForm from '../../../app/containers/Login/LoginForm'
const styles = require('../../../app/containers/Login/Login.less')

import { login } from '../../containers/App/actions'

const Icon = require('antd/lib/icon')
const Message = require('antd/lib/message')

interface ILoginProps {
  loginLoading?: boolean
  shareInfo: any,
  legitimateUser: () => void
  onLogin?: (username: string, password: string, shareInfo: any, resolve: (res) => void) => void
}

interface ILoginStates {
  username: string
  password: string
}

class Login extends React.PureComponent<ILoginProps, ILoginStates> {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
  }

  private changeUsername = (e) => {
    this.setState({
      username: e.target.value.trim()
    })
  }

  private changePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  private doLogin = () => {
    const { onLogin, shareInfo, legitimateUser } = this.props
    const { username, password } = this.state

    if (username && password) {
      onLogin(username, password, shareInfo, (res) => {
        if (res && res.header && res.header.code && res.header.code === 200) {
          legitimateUser()
        } else {
          Message.destroy() // 掩盖 request 批量处理400 的提示语
          Message.error('无权限')
        }
      })
    }
  }

  public render () {
    const { loginLoading } = this.props
    const { username, password } = this.state
    return (
      <div className={`${styles.login} ${styles.share}`}>
        <Helmet title="Login" />
        <img className={styles.logo} src={require('../../../app/assets/images/logo_light.svg')} />
        <div className={styles.window}>
          <LoginForm
            username={username}
            password={password}
            onChangeUsername={this.changeUsername}
            onChangePassword={this.changePassword}
            onLogin={this.doLogin}
          />
          <button
            disabled={loginLoading}
            onClick={this.doLogin}
          >
            {
              loginLoading
                ? <Icon type="loading" />
                : ''
            }
            登 录
          </button>
        </div>
      </div>
    )
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    onLogin: (username: string, password: string, shareInfo: any, resolve: (res) => void) => dispatch(login(username, password, shareInfo, resolve))
  }
}

export default connect<{}, {}, ILoginProps>(null, mapDispatchToProps)(Login)
