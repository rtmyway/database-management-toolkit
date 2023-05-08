import React, { Component } from 'react';
import { Form, Input, Row, Col, Spin, Drawer, Button, Switch, DatePicker, Alert } from 'antd';
import moment from 'moment';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;

export default class DbmtRestoreConfigAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataObj: {
        restoreName: '',
        schemaExpression: '',
        tableExpression: '',
        isRestoreData: true,
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      let data = {
        restoreName: '',
        schemaExpression: '',
        tableExpression: '',
        isRestoreData: true,
      };

      if (!checkCommon.isEmpty(viewObj.data.id)) {
        // 克隆
        data = { ...viewObj.data };
        data.id = '';
      }

      this.setState({
        dataObj: data,
      });
    }

  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'restoreName') {
      dataObj.restoreName = e.target.value;
    } else if (item == 'schemaExpression') {
      dataObj.schemaExpression = e.target.value;
    } else if (item == 'tableExpression') {
      dataObj.tableExpression = e.target.value;
    } else if (item == 'isRestoreData') {
      dataObj.isRestoreData = e;
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
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="恢复名称">
                  <Input placeholder="请输入恢复名称" onChange={(e) => this.onInputHandle('restoreName', e)} value={this.state.dataObj.restoreName} />
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="schema映射">
                  <Input placeholder="请输入schema映射" onChange={(e) => this.onInputHandle('schemaExpression', e)} value={this.state.dataObj.schemaExpression} />
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="table映射">
                  <Input placeholder="请输入table映射" onChange={(e) => this.onInputHandle('tableExpression', e)} value={this.state.dataObj.tableExpression} />
                </FormItem>
    
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="恢复数据">
                  <Switch  onChange={(e) => this.onInputHandle('isRestoreData', e)} checked={this.state.dataObj.isRestoreData}/>
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
