import React, { Component } from 'react';
import { Form, Input, Row, Col, Spin, Drawer, Button, Radio, message, Alert } from 'antd';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;

export default class DbmtConnectionConfigUpdateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataObj: {
        env: 'PROD',
        databaseItem: 'POSTGRES',
        host: '',
        port: '5432',
        databaseName: '',
        userName: '',
        password: '',
        description: '',
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      this.setState({
        dataObj: viewObj.data,
      });
    }

  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'databaseItem') {
      dataObj.databaseItem = e.target.value;
      if (dataObj.databaseItem == 'ORACLE') {
        dataObj.databasePort = '1521';
      } else if (dataObj.databaseItem == 'POSTGRES') {
        dataObj.databasePort = '5432';
      }
    } else if (item == 'env') {
      dataObj.env = e.target.value;
    } else if (item == 'host') {
      dataObj.host = e.target.value;
    } else if (item == 'port') {
      dataObj.port = e.target.value;
    } else if (item == 'userName') {
      dataObj.userName = e.target.value;
    } else if (item == 'password') {
      dataObj.password = e.target.value;
    } else if (item == 'databaseName') {
      dataObj.databaseName = e.target.value;
    } else if (item == 'databasePdbName') {
      dataObj.databasePdbName = e.target.value;
    } else if (item == 'env') {
      dataObj.env = e.target.value;
    }
    this.setState({ dataObj: dataObj });
  }




  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;
    this.props.viewObj.onSubViewActionHandler(this.props.viewObj.key, 'CONFIRM', dataObj);
  }

  render() {
    return (
      <div>
        <Drawer
          title={this.props.viewObj.title}
          placement={'right'}
          width={800}
          maskClosable={true}
          mask={true}
          onClose={() => this.props.viewObj.onSubViewVisibleHandler(this.props.viewObj.key, false, {})}
          visible={this.props.viewObj.visible}>
          <Spin spinning={this.props.viewObj.spinning}>
            <Row>
              <Col span={24}>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据库类型">
                  <Radio.Group onChange={(e) => this.onInputHandle('databaseItem', e)} value={this.state.dataObj.databaseItem}>
                    <Radio value={'POSTGRES'}>POSTGRES</Radio>
                    <Radio disabled value={'ORACLE'}>ORACLE</Radio>
                    <Radio disabled value={'MYSQL'}>MYSQL</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="环境">
                  <Radio.Group onChange={(e) => this.onInputHandle('env', e)} value={this.state.dataObj.env}>
                    <Radio value={'PROD'}>正式</Radio>
                    <Radio value={'DEV'}>临时</Radio>
                  </Radio.Group>
                </FormItem>                
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="主机/端口">
                  <Input placeholder="请输入域名或IP" onChange={(e) => this.onInputHandle('host', e)} value={this.state.dataObj.host} />
                  <Input placeholder="请输入数据库端口" onChange={(e) => this.onInputHandle('port', e)} value={this.state.dataObj.port} />
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名/密码">
                  <Input placeholder="请输入用户名" onChange={(e) => this.onInputHandle('userName', e)} value={this.state.dataObj.userName} />
                  <Input placeholder="请输入密码" onChange={(e) => this.onInputHandle('password', e)} value={this.state.dataObj.password} />
                </FormItem>
              </Col>
            </Row>
            <Row style={{ marginLeft: '80px' }} gutter={24}>
              <Col span={2} className='ant-col-offset-2'>
                <Button style={{ marginLeft: '0px' }} type="primary" onClick={this.onConfirmHandler}>确认</Button>
              </Col>
            </Row>
          </Spin>
        </Drawer>

      </div>
    );
  }
}
