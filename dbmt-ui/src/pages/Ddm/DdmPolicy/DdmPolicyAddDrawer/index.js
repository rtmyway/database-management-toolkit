import React, {Component } from 'react';
import {Form, Input, Row, Col,Spin, Drawer, Button, Radio, Checkbox, message, Select} from 'antd';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
import CheckCommon from '../../../../commons/CheckCommon';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;
const opOptions = [
  { label: 'Initialize', value: 'r' },  
  { label: 'Insert', value: 'c' },
  { label: 'Update', value: 'u' },
  { label: 'Delete', value: 'd' },
];
export default class DdmPolicyAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      dataObj : {
        policyId: '',
        shareMode: '',
        opStr: '',
        tableStr: '',
        targetTopicName: '',
        partitionSize: 1,
        replicationSize: 1,
        bindSinkIds: '*',
        status: 1
      },
      bindSinkMode: 1, // 全部=1 选择=2
      opArray : "r,c,u,d".split(","),
      sinkList: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      this.setState({
        dataObj : {
          policyId: '',
          shareMode: 1,
          opStr: 'r,c,u,d',
          tableStr: '',
          targetTopicName: '',
          partitionSize: 1,
          replicationSize: 1,
          bindSinkIds: '*',
          status: 1
        },
        bindSinkMode : 1, // 全部=1 选择=2
        opArray : "r,c,u,d".split(","),
        sinkList: viewObj.data.sinkList,
      });
    }
  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'policyId') {
      dataObj.policyId = e.target.value;
      dataObj.targetTopicName = e.target.value;
    } else if (item == 'shareMode') {
      dataObj.shareMode = e.target.value;
    } else if (item == 'opStr') {
      dataObj.opStr = e.join(',');
    } else if (item == 'tableStr') {
      dataObj.tableStr = e.target.value;
    } else if (item == 'bindSinkMode') {
      if (e.target.value == 1) {
        dataObj.bindSinkIds = '*';
      }
      this.setState({bindSinkMode: e.target.value});
    } else if (item == 'bindSinkIds') {
      dataObj.bindSinkIds = e.join(',');
    }
    this.setState({dataObj: dataObj});
  }


  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;

    // 检查
    dataObj.tableStr = dataObj.tableStr.trim();
    if (checkCommon.isEmpty(dataObj.policyId)) {
      message.error("策略名称不能为空");
      return;
    }
    if (checkCommon.isEmpty(dataObj.opStr)) {
      message.error("分发操作不能为空");
      return;
    }
    if (checkCommon.isEmpty(dataObj.tableStr)) {
      message.error("分发表名不能为空");
      return;
    }


    this.props.viewObj.onSubViewActionHandler(this.props.viewObj.key, this.props.viewObj.action.confirm, dataObj);
  }

  render() {
    let selectOptions = this.state.sinkList.map(item => {
      return <Option key={item.sinkId}>{item.sinkId}</Option>;
    });

    let selectValues = [];
    let bindSinkIdsStr = this.state.dataObj.bindSinkIds;
    if (CheckCommon.isEmpty(bindSinkIdsStr)) {
      selectValues = [];
    } else if (bindSinkIdsStr == '*') {
      selectValues = this.state.sinkList.map(item => item.sinkId);
    } else {
      selectValues = bindSinkIdsStr.split(",");
    }

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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="策略名称">
              <Input placeholder="请输入策略名称" onChange={(e)=>this.onInputHandle('policyId', e)} value={this.state.dataObj.policyId} />
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="存储模式">
              <Radio.Group onChange={(e)=>this.onInputHandle('shareMode', e)} value={this.state.dataObj.shareMode}>
                <Radio value={1}>共享</Radio>
                <Radio value={0}>独享</Radio>
              </Radio.Group>
            </FormItem>      
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="存储目标">
              <Radio.Group onChange={(e)=>this.onInputHandle('bindSinkMode', e)} value={this.state.bindSinkMode}>
                <Radio value={1}>全部</Radio>
                <Radio value={2}>自定义</Radio>
              </Radio.Group>              
              <Select
                mode="multiple"
                disabled={this.state.bindSinkMode==1}
                style={{ width: '100%' }}
                placeholder="请选择存储目标"
                value={selectValues}
                onChange={(e)=>this.onInputHandle('bindSinkIds', e)}>
                  <Option key={'*'}>全部</Option>
                {selectOptions}
              </Select>
            </FormItem>                     
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分发操作">
              <Checkbox.Group options={opOptions} defaultValue={this.state.dataObj.opStr.split(',')} onChange={(e)=>this.onInputHandle('opStr', e)}  />
            </FormItem>   
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分发表名">
              <TextArea rows={4} placeholder="请输入分发表名schema.table(多个用逗号隔开)" onChange={(e)=>this.onInputHandle('tableStr', e)} value={this.state.dataObj.tableStr} />
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
