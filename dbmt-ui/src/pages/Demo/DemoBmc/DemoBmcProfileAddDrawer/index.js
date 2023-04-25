import React, {Component } from 'react';
import {Form, Input, Row, Col,Spin, Drawer, Button, Select, Radio, Checkbox, message} from 'antd';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
const { Option } = Select;
const FormItem = Form.Item;
const { TextArea } = Input;

export default class DemoBmcProfileAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      dataObj : {
        chartName: '',
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
    if (item == 'chartName') {
      dataObj.chartName = e.target.value;
    } else if (item == 'linkPath') {
      dataObj.linkPath = e.target.value;
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
    let children = [];
    children.push(<Option key={'*'}>{`全部`}</Option>);
    for (let i = 11; i < 19; i++) {
      children.push(<Option key={i}>{`ROLE-${i}`}</Option>);
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
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图表类型">
              <Radio.Group onChange={(e)=>this.onInputHandle('chartName', e)} value={this.state.dataObj.chartName}>
                <Radio value={'01'}>柱状图</Radio>
                <Radio value={'02'}>直方图</Radio>
                <Radio value={'03'}>折线图</Radio>
              </Radio.Group>
            </FormItem>              

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="关联页面">
              <Input placeholder="请输入关联页面URL" onChange={(e)=>this.onInputHandle('linkPath', e)} value={this.state.dataObj.linkPath} />
            </FormItem>  

            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色白名单">
              <Select
                mode="tags"
                size={'small'}
                placeholder="Please select"
                defaultValue={['*']}
                // onChange={handleChange}
                style={{ width: '100%' }}
              >
                {children}
              </Select>
            </FormItem>              
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组织白名单">
              <Select
                mode="tags"
                size={'small'}
                placeholder="Please select"
                defaultValue={['*']}
                // onChange={handleChange}
                style={{ width: '100%' }}
              >
                {children}
              </Select>
            </FormItem>               


            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户白名单">
              <Select
                mode="tags"
                size={'small'}
                placeholder="Please select"
                defaultValue={['*']}
                // onChange={handleChange}
                style={{ width: '100%' }}
              >
                {children}
              </Select>
            </FormItem>      


                                     
                        
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
