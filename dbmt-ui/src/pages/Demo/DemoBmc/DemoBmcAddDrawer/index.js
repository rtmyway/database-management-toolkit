import React, {Component } from 'react';
import {Form, Input, Row, Col,Spin, Drawer, Button, Select, Radio, Checkbox, message, Icon, Switch} from 'antd';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

export default class DemoBmcAddAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      dataObj : {
        taskName: '',
        taskScope: '',
      },
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      this.setState({
        dataObj : {

        },
      });
    }

  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'taskName') {
      dataObj.taskName = e.target.value;
    } else if (item == 'taskScope') {
      dataObj.taskScope = e;
    } else if (item == 'taskGroup') {
      dataObj.taskGroup = e.target.value;
    } else if (item == 'description') {
      dataObj.description = e.target.value;
    } else if (item == 'customizedScript') {
      dataObj.customizedScript = e.target.value;
    } else if (item == 'intervalSecond') {
      dataObj.intervalSecond = e;
    } else if (item == 'timeSlot') {
      dataObj.timeSlot = e;
    }
    this.setState({dataObj: dataObj});
  }


  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;
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

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="微服务编号" >
              <Select
                style={{ width: '100%' }}
                placeholder="请选择微服务编号"
                optionFilterProp="children"
                onChange={(e)=>this.onInputHandle('taskScope', e)}>
                <Option value="fw-platform-app">fw-platform-app</Option>
                <Option value="fw-platform-app-02">fw-platform-app-02</Option>
              </Select>              
            </FormItem>  
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任务名称">
              <Input placeholder="请输入任务名称" onChange={(e)=>this.onInputHandle('taskName', e)} value={this.state.dataObj.taskName} />
            </FormItem>              
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任务分组">
              <Input placeholder="请输入任务分组(非必填)" onChange={(e)=>this.onInputHandle('taskGroup', e)} value={this.state.dataObj.taskGroup} />
            </FormItem>  
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所有人可见">
              <Switch 
                size={'default'}
                checkedChildren={<Icon type="check" />}
                unCheckedChildren={<Icon type="close" />}
                checked={true}  />
            </FormItem>              
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="SQL查询脚本">
              <TextArea rows={4} placeholder="请输入SQL查询脚本" onChange={(e)=>this.onInputHandle('customizedScript', e)} value={this.state.dataObj.customizedScript} />
            </FormItem>    
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="脚本运行频率">
              <Select
                style={{ width: '100%' }}
                placeholder="请选择脚本运行频率"
                optionFilterProp="children"
                onChange={(e)=>this.onInputHandle('intervalSecond', e)}>
                <Option value='MINUTE'>分钟</Option>                                    
                <Option value='HOUR'>小时</Option>                  
                <Option value='DAY'>天</Option>
                <Option value='WEEK'>周</Option>
                <Option value='MONTH'>月</Option>
              </Select>  
            </FormItem>    
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="运行时间段">
              <Input placeholder="请输入运行时间段00:00-23:59,多个用逗号分隔" onChange={(e)=>this.onInputHandle('timeSlot', e)} value={this.state.dataObj.timeSlot} />
            </FormItem>                                   
      
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任务有效期">
            </FormItem>     

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="任务描述">
              <TextArea rows={4} placeholder="请输入任务描述(非必填)" onChange={(e)=>this.onInputHandle('description', e)} value={this.state.dataObj.description} />
            </FormItem>                                          
                        
            {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="输出源类型">
              <Radio.Group onChange={(e)=>this.onInputHandle('sinkItem', e)} value={this.state.dataObj.sinkItem}>
                <Radio value={'kafka'}>kafka</Radio>
                <Radio value={'elasticsearch'}>elasticsearch</Radio>
              </Radio.Group>
            </FormItem>               
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="输出源标识名">
              <Input placeholder="请输入输出源标识名" onChange={(e)=>this.onInputHandle('sinkId', e)} value={this.state.dataObj.sinkId} />
            </FormItem>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="输出源地址">
              <Input placeholder="请输入输出源地址" onChange={(e)=>this.onInputHandle('bootstrapServer', e)} value={this.state.dataObj.bootstrapServer} />
            </FormItem>     
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名/密码">
              <Input placeholder="请输入用户名" onChange={(e)=>this.onInputHandle('userName', e)} value={this.state.dataObj.userName} />
              <Input placeholder="请输入密码" onChange={(e)=>this.onInputHandle('password', e)} value={this.state.dataObj.password} />
            </FormItem>                                  */}
            <Row gutter={24}>
              <Col span={24}>
              <Button style={{marginLeft:'80px'}} type="primary">确认</Button>
              </Col>
            </Row>
          </Spin>
        </Drawer>
      </div>
    );
  }
}
