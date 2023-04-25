import React, { Component } from 'react';
import {Alert, message } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import versionConfig from '../../configs/VersionConfig';
import dataConfig from '../../configs/DataConfig';
import pageCommon from '../../commons/PageCommon';
import {
  accountLogin,
} from '../../services/user';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

export default
class LoginPage extends Component {
  state = {
    type: 'account',
    authLogin: false,
    submitting: false,
  };

  componentWillMount() {

  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (err) {
      return;
    }
    this.setState({submitting : true});

    let reqParam = {
      userName : values.userName,
      password : values.password,
      mode : 1,
    };

    // accountLogin(reqParam, (response)=>{
    //   if (response != undefined && response != null) {
    //     let versionObj = {
    //       versionNo: versionConfig.versionNo,
    //       versionTime: versionConfig.versionTime,
    //       versionContent: versionConfig.versionContent
    //     };

    //     dataConfig.carryObject.setDataItem('version', versionObj)
    //     dataConfig.carryObject.setDataItem('operator', response.operator);
    //     message.success('登录成功,页面跳转中...', 2, ()=>{this.setState({submitting : false});});
    //     pageCommon.jumpDefaultPage();
    //   }
    //   this.setState({submitting : false});
    // });

    let versionObj = {
      versionNo: versionConfig.versionNo,
      versionTime: versionConfig.versionTime,
      versionContent: versionConfig.versionContent
    };

    let operatorObj = {
      token: 'token',
      versionNo: '1.0.0',
      user: {
        userName: 'iP2Admin',
        realName: '系统管理员',
      }
    }

    dataConfig.carryObject.setDataItem('version', versionObj)
    dataConfig.carryObject.setDataItem('operator', operatorObj);

    message.success('登录成功,页面跳转中...', 2, ()=>{this.setState({submitting : false});});
    pageCommon.jumpDefaultPage();


  };

  changeAuthLogin = e => {
    this.setState({
      authLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={this.state.type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户登录">
            {this.props.status === 'error' &&
              this.props.type === 'account' &&
              !this.state.submitting &&
              this.renderMessage('账户或密码错误')}
            <UserName name="userName" placeholder="请输入用户名" />
            <Password
              name="password"
              placeholder="请输入用户密码"
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Submit loading={this.state.submitting}>登录</Submit>

        </Login>
      </div>
    );
  }
}
