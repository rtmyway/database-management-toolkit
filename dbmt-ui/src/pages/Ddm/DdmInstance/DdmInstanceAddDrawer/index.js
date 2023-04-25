import React, { Component } from 'react';
import { Form, Input, Row, Col, Spin, Drawer, Button, Radio, message, Alert } from 'antd';
import DdmDbCheckDrawer from '../../DdmCommon/DdmDbCheckDrawer';
import checkCommon from '../../../../commons/CheckCommon';
import styles from './index.less';
import CheckCommon from '../../../../commons/CheckCommon';
const FormItem = Form.Item;
const { TextArea } = Input;

export default class DdmInstanceAddDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dataObj: {
        instanceId: '',
        databaseItem: 'postgres',
        databaseHost: '',
        databasePort: '',
        databaseUser: 'ddm',
        databasePassword: 'ddm',
        databaseDbName: '',
        databasePdbName: '',
        schemaIncludeList: '',
        tableIncludeList: '',
        snapshotMode: 'initial',
        status: 1
      },
      subVisible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      let data = {
        instanceId: '',
        databaseItem: 'postgres',
        databaseHost: '',
        databasePort: '',
        databaseUser: 'ddm',
        databasePassword: 'ddm',
        databaseDbName: '',
        databasePdbName: '',
        schemaIncludeList: '',
        tableIncludeList: '',
        snapshotMode: 'initial',
        status: 1
      };

      if (!CheckCommon.isEmpty(viewObj.data.instanceId)) {
        // 克隆
        data = { ...viewObj.data };
        data.instanceId = '';
      }

      this.setState({
        dataObj: data,
        // opArray : this.state.dataObj.opStr.split
      });
    }

  }

  onInputHandle = (item, e) => {
    let dataObj = this.state.dataObj;
    if (item == 'instanceId') {
      dataObj.instanceId = e.target.value;
      dataObj.targetTopicName = e.target.value;
    } else if (item == 'databaseItem') {
      dataObj.databaseItem = e.target.value;
      if (dataObj.databaseItem == 'oracle') {
        dataObj.databasePort = '1521';
      } else if (dataObj.databaseItem == 'postgres') {
        dataObj.databasePort = '5432';
      }
    } else if (item == 'databaseHost') {
      dataObj.databaseHost = e.target.value;
    } else if (item == 'databasePort') {
      dataObj.databasePort = e.target.value;
    } else if (item == 'databaseUser') {
      dataObj.databaseUser = e.target.value;
    } else if (item == 'databasePassword') {
      dataObj.databasePassword = e.target.value;
    } else if (item == 'databaseDbName') {
      dataObj.databaseDbName = e.target.value;
    } else if (item == 'databasePdbName') {
      dataObj.databasePdbName = e.target.value;
    } else if (item == 'schemaIncludeList') {
      dataObj.schemaIncludeList = e.target.value;
    } else if (item == 'tableIncludeList') {
      dataObj.tableIncludeList = e.target.value;
    }


    this.setState({ dataObj: dataObj });
  }

  onDbCheckVisibleHandler = (visible) => {
    this.setState({ subVisible: visible});
  }



  onConfirmHandler = (e) => {
    e.preventDefault();
    let dataObj = this.state.dataObj;

    // 检查
    if (checkCommon.isEmpty(dataObj.instanceId)) {
      message.error("实例名不能为空");
      return;
    }
    if (checkCommon.isEmpty(dataObj.databaseHost) || checkCommon.isEmpty(dataObj.databasePort)) {
      message.error("主机/端口不能为空");
      return;
    }
    if (checkCommon.isEmpty(dataObj.databaseUser) || checkCommon.isEmpty(dataObj.databasePassword)) {
      message.error("用户名/密码不能为空");
      return;
    }
    if (checkCommon.isEmpty(dataObj.databaseDbName)) {
      message.error("数据库名不能为空");
      return;
    }

    //dataObj.instanceId = `ddm-${this.state.dataObj.databaseItem}-${this.state.dataObj.instanceId}`;


    this.props.viewObj.onSubViewActionHandler(this.props.viewObj.key, 'CONFIRM', dataObj);
  }

  render() {
    let dbDiffDom = '';
    let databaseItem = this.state.dataObj.databaseItem;
    if (databaseItem == 'postgres') {
      dbDiffDom = <div>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据库名">
          <Input placeholder="请输入数据库名" onChange={(e) => this.onInputHandle('databaseDbName', e)} value={this.state.dataObj.databaseDbName} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模式名">
          <Input placeholder="请输入模式名(schema1,schema2)" onChange={(e) => this.onInputHandle('schemaIncludeList', e)} value={this.state.dataObj.schemaIncludeList} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="表名">
          <TextArea rows={4} placeholder="请输入表名(schema1.table1,schema2.table2)" onChange={(e) => this.onInputHandle('tableIncludeList', e)} value={this.state.dataObj.tableIncludeList} />
        </FormItem>
      </div>;
    } else if (databaseItem == 'oracle') {
      dbDiffDom = <div>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据库名(CDB)">
          <Input placeholder="请输入数据库名" onChange={(e) => this.onInputHandle('databaseDbName', e)} value={this.state.dataObj.databaseDbName} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="PDB名(可选)">
          <Input placeholder="请输入PDB名" onChange={(e) => this.onInputHandle('databasePdbName', e)} value={this.state.dataObj.databasePdbName} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模式名">
          <Input placeholder="请输入模式名(schema1,schema2)" onChange={(e) => this.onInputHandle('schemaIncludeList', e)} value={this.state.dataObj.schemaIncludeList} />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="表名">
          <TextArea rows={4} placeholder="请输入表名(schema1.table1,schema2.table2)" onChange={(e) => this.onInputHandle('tableIncludeList', e)} value={this.state.dataObj.tableIncludeList} />
        </FormItem>
      </div>;
    } else if (databaseItem == 'mysql') {

    } else {

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
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数据库类型">
                  <Radio.Group onChange={(e) => this.onInputHandle('databaseItem', e)} value={this.state.dataObj.databaseItem}>
                    <Radio value={'postgres'}>postgres</Radio>
                    <Radio value={'oracle'}>oracle</Radio>
                    <Radio disabled value={'mysql'}>mysql</Radio>
                  </Radio.Group>
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="实例名称">
                  <Input placeholder="请输入实例名称" addonBefore={`ddm-${this.state.dataObj.databaseItem}-`} onChange={(e) => this.onInputHandle('instanceId', e)} value={this.state.dataObj.instanceId} />
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="主机/端口">
                  <Input placeholder="请输入域名或IP" onChange={(e) => this.onInputHandle('databaseHost', e)} value={this.state.dataObj.databaseHost} />
                  <Input placeholder="请输入数据库端口" onChange={(e) => this.onInputHandle('databasePort', e)} value={this.state.dataObj.databasePort} />
                </FormItem>
                <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="用户名/密码">
                  <Input placeholder="请输入用户名" onChange={(e) => this.onInputHandle('databaseUser', e)} value={this.state.dataObj.databaseUser} />
                  <Input placeholder="请输入密码" onChange={(e) => this.onInputHandle('databasePassword', e)} value={this.state.dataObj.databasePassword} />
                </FormItem>
                {dbDiffDom}
              </Col>
            </Row>
            <Row style={{ marginLeft: '80px' }} gutter={24}>
              <Col span={2}>
                <Button style={{ marginLeft: '0px' }} type="default" onClick={() => this.onDbCheckVisibleHandler(true)}>检测</Button>
              </Col>
              <Col span={2} className='ant-col-offset-2'>
                <Button style={{ marginLeft: '0px' }} type="primary" onClick={this.onConfirmHandler}>确认</Button>
              </Col>
            </Row>
          </Spin>
          <div>
            <DdmDbCheckDrawer destroyOnClose={true} viewObj = {{visible: this.state.subVisible, data: this.state.dataObj, onDbCheckVisibleHandler: this.onDbCheckVisibleHandler}}/>
          </div>
        </Drawer>

      </div>
    );
  }
}
