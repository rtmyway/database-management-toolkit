import React, { Component } from 'react';
import { Form, Input, Row, Col, Spin, Drawer, Button, Radio, DatePicker, Alert } from 'antd';
import moment from 'moment';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
const FormItem = Form.Item;
const { TextArea } = Input;

export default class DbmtBackupConfigUpdateDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataObj: {
        backupName: '',
        frequencyType: 'DAY',
        frequencyValue: 1,        
        timeslots: '',
        effectiveStartDate: null,
        effectiveEndDate: null,
        cronExpression: '',
        description: '',
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      console.info(viewObj.data);
      this.setState({
        dataObj: viewObj.data,
      });
    }

  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'backupName') {
      dataObj.backupName = e.target.value;
    } else if (item == 'frequencyType') {
      dataObj.frequencyType = e.target.value;
    } else if (item == 'frequencyValue') {
      dataObj.frequencyValue = e.target.value;
    } else if (item == 'timeslots') {
      dataObj.timeslots = e.target.value;
    } else if (item == 'effectiveStartDate') {
      let dateStr = moment(e).format('YYYY-MM-DD') ;
      dataObj.effectiveStartDate = dateStr;
    } else if (item == 'effectiveEndDate') {
      let dateStr = moment(e).format('YYYY-MM-DD') ;
      dataObj.effectiveEndDate = dateStr;
    } else if (item == 'description') {
      dataObj.description = e.target.value;
    }
    this.setState({ dataObj: dataObj });
  }

  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;
    this.props.viewObj.onSubViewActionHandler(this.props.viewObj.key, 'CONFIRM', dataObj);
  }

  render() {
    let startMoment = null;
    if (this.state.dataObj.effectiveStartDate != null) {
      startMoment = moment(this.state.dataObj.effectiveStartDate, 'YYYY-MM-DD');
    }
    let endMoment = null;
    if (this.state.dataObj.effectiveEndDate != null) {
      endMoment = moment(this.state.dataObj.effectiveEndDate, 'YYYY-MM-DD');
    }    
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
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备份名称">
                  <Input placeholder="请输入备份名称" onChange={(e) => this.onInputHandle('backupName', e)} value={this.state.dataObj.backupName} />
                </FormItem>                
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备份频率">
                  <Radio.Group onChange={(e) => this.onInputHandle('frequencyType', e)} value={this.state.dataObj.frequencyType}>
                    <Radio value={'DAY'}>按天</Radio>
                    <Radio value={'WEEK'}>按周</Radio>
                    <Radio value={'MONTH'}>按月</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备份频率值">
                  <Input placeholder="备份频率值" onChange={(e) => this.onInputHandle('frequencyValue', e)} value={this.state.dataObj.frequencyValue} />
                </FormItem>                               
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备份时间段">
                  <Input placeholder="12:00-13:00,20:00-21:00" onChange={(e) => this.onInputHandle('timeslots', e)} value={this.state.dataObj.timeslots} />
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="开始日">
                  <DatePicker onChange={(e) => this.onInputHandle('effectiveStartDate', e)} value={startMoment} placeholder="请选择生效开始日"/>
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="结束日">
                  <DatePicker onChange={(e) => this.onInputHandle('effectiveEndDate', e)} value={endMoment} placeholder="请选择生效结束日"/>
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
