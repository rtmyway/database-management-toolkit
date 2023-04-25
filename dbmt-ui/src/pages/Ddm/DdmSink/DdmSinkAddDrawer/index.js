import React, {Component } from 'react';
import {Form, Input, Row, Col,Spin, Drawer, Button, Radio, Checkbox, message} from 'antd';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;
const opOptions = [
  { label: 'Insert', value: 'c' },
  { label: 'Update', value: 'u' },
  { label: 'Insert', value: 'd' },
];
export default class DdmSinkAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      dataObj : {
        sinkId: '',
        sinkItem: 'kafka',
        bootstrapServer: '',
        userName: '',
        password: '',
        internal: 0,
        status: 1
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      this.setState({
        dataObj : {
          sinkId: '',
          sinkItem: 'kafka',
          bootstrapServer: '',
          userName: '',
          password: '',
          internal: 0,
          status: 1
        },
      });
    }

  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'sinkId') {
      dataObj.sinkId = e.target.value;
    } else if (item == 'sinkItem') {
      dataObj.sinkItem = e.target.value;
    } else if (item == 'bootstrapServer') {
      dataObj.bootstrapServer = e.target.value;
    } else if (item == 'userName') {
      dataObj.userName = e.target.value;
    } else if (item == 'password') {
      dataObj.password = e.target.value;
    }
    this.setState({dataObj: dataObj});
  }


  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;

    // 检查
    if (checkCommon.isEmpty(dataObj.sinkId)) {
      message.error("输出源名不能为空");
      return;
    }
    if (checkCommon.isEmpty(dataObj.bootstrapServer)) {
      message.error("输出源地址不能为空");
      return;
    }
    this.props.viewObj.onSubViewActionHandler(this.props.viewObj.key, this.props.viewObj.action.confirm, dataObj);
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
          onClose={()=>this.props.viewObj.onSubViewVisibleHandler(this.props.viewObj.key, false, {})}
          visible={this.props.viewObj.visible}>
          <Spin spinning={this.props.viewObj.spinning}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="输出源类型">
              <Radio.Group onChange={(e)=>this.onInputHandle('sinkItem', e)} value={this.state.dataObj.sinkItem}>
                <Radio value={'kafka'}>kafka</Radio>
                <Radio value={'elasticsearch'}>elasticsearch</Radio>
              </Radio.Group>
            </FormItem>               
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="输出源标识名">
              <Input placeholder="请输入输出源标识名(英文字母或数字)" onChange={(e)=>this.onInputHandle('sinkId', e)} value={this.state.dataObj.sinkId} />
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="输出源地址">
              <Input placeholder="请输入输出源地址" onChange={(e)=>this.onInputHandle('bootstrapServer', e)} value={this.state.dataObj.bootstrapServer} />
            </FormItem>     
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名/密码">
              <Input placeholder="请输入用户名" onChange={(e)=>this.onInputHandle('userName', e)} value={this.state.dataObj.userName} />
              <Input placeholder="请输入密码" onChange={(e)=>this.onInputHandle('password', e)} value={this.state.dataObj.password} />
            </FormItem>                                 
            <Row gutter={24}>
              <Col span={24}>
              <Button style={{marginLeft:'80px'}} type="primary"
                onClick={this.onConfirmHandler}>确认</Button>
              </Col>
            </Row>
          </Spin>
        </Drawer>
      </div>
    );
  }
}
