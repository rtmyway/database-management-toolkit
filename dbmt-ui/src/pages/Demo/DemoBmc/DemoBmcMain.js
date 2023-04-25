import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, Badge} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DemoBmcAddDrawer from './DemoBmcAddDrawer';
import DemoBmcProfileAddDrawer from './DemoBmcProfileAddDrawer';
import styles from '../DemoGlobal.less';
import DemoGlobalConstants from '../DemoGlobalConstants';

const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DemoBmcMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],    
      viewDemoBmcAdd : {
        key: DemoGlobalConstants.viewKeyMap.VIEW_DEMO_BMC_ADD,
        title: '新增采样任务',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
        onSubViewActionHandler: this.onSubViewActionHandler,
        action: {
          confirm: DemoGlobalConstants.actionKeyMap.ACTION_DEMO_BMC_ADD_CONFIRM,
        },     
      },
      viewDemoBmcProfileAdd : {
        key: DemoGlobalConstants.viewKeyMap.VIEW_DEMO_BMC_PROFILE_ADD,
        title: '新增profile',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
        onSubViewActionHandler: this.onSubViewActionHandler,
        action: {
          confirm: DemoGlobalConstants.actionKeyMap.ACTION_DEMO_BMC_PROFILE_ADD_CONFIRM,
        },
      },             
    };
  }

  //render前执行
  componentWillMount() {
    //默认执行一次查询
    let taskList = [
      {
        key: "1e87a5455f8cc4b3bb5fd3dc78690f646",
        "id": "e87a5455f8cc4b3bb5fd3dc78690f646",
        "taskItem": "ANNOTATION_PROCESS",
        "taskScope": "fw-platform-app",
        "intervalSecond": 86400,
        "description": "总用户(未删除),有效用户(已激活),活跃用户(当天有登录日志的用户)",
        "isActive": true,
        "lastExecuteTime": "2022-11-03 15:05:29",
        "lastExecuteLogId": "1264de7dea374163ad21664ea9504a7c",
        "lastExecuteResult": "101,82,27",
        "taskName": "系统用户数",
        "taskGroup": "系统",
        "isInternal": true,
        "timeSlots": "09:00-18:00",
        "effectiveStartTime": "2022-11-01 00:00:00",
        "effectiveEndTime": "2022-12-31 22:00:00",
        "cronExpression": "* * * * * *",
        "resultType": "NUMBER_ARRAY",
        "resultTitle": "总用户,有效用户,活跃用户"
      },
      {
        key: "7bb026aec4724fbd9a661952ff2077c2",        
        "id": "7bb026aec4724fbd9a661952ff2077c2",
        "taskItem": "ANNOTATION_PROCESS",
        "taskScope": "fw-platform-app",
        "intervalSecond": 86400,
        "description": "系统存储文件数",
        "isActive": true,
        "lastExecuteTime": "2022-11-03 15:05:29",
        "lastExecuteLogId": "3839ba84d2e8465d8386dea817323bf7",
        "lastExecuteResult": "7776",
        "taskName": "系统存储文件数",
        "taskGroup": "系统",
        "isInternal": true,
        "timeSlots": "08:00-19:00",
        "effectiveEndTime": "2099-12-31 23:59:00",
        "resultType": "NUMBER_SINGLE"
      },
      {
        key: "112",        
        "id": "112",
        "taskItem": "SIMPLE_QUERY",
        "taskScope": "fw-platform-app",
        "intervalSecond": 86400,
        "description": "登录用户",
        "isActive": true,
        "taskName": "登录用户",
        "taskGroup": "分组1",
        "isInternal": false,
        "timeSlots": "ALL",
        "resultType": "NUMBER_SINGLE"
      }      
    ];
    this.setState({data : taskList});
  }

  componentDidMount(){

  }

  /**
   * 子视图的显示/隐藏
   * @param viewKey 视图key
   * @param visible true:显示 false:隐藏
   * @param data 传递给子视图需要的数据
   */
   onSubViewVisibleHandler = (viewKey, visible, data) => {
    let viewObj;
    if (this.state.viewDemoBmcAdd.key == viewKey) {
      viewObj = this.state.viewDemoBmcAdd;
      viewObj.changeable = true;
      viewObj.visible = visible;
      viewObj.data = data;
      this.setState({viewDemoBmcAdd: viewObj,});
    } else if (this.state.viewDemoBmcProfileAdd.key == viewKey) {
      viewObj = this.state.viewDemoBmcProfileAdd;
      viewObj.changeable = true;
      viewObj.visible = visible;
      viewObj.data = data;
      this.setState({viewDemoBmcProfileAdd: viewObj,});
    }
  }    

 


  render() {
    const columns = [
      {
      //   key : 1,
      //   title: '编号',
      //   dataIndex: 'serialNo',
      // },{
        key : 2,
        title: '任务名称(绿点代表内置任务,蓝点代表非内置任务)',
        render: (text, row, index) => {
          return <div>
            <Badge status={row.isInternal ? "success" : "processing"}/>
            {row.taskName}
            <Tag style={{marginLeft:'10px'}}>{row.taskGroup}</Tag>
          </div>
        },
      },{   
        key : 3,
        title: '高级属性',
        render: (text, row, index) => {
          return <div><a onClick={()=>{this.onSubViewVisibleHandler(this.state.viewDemoBmcProfileAdd.key, true, {});}} style={{fontWeight:'bold', marginLeft: '20px'}}>{'配置'}</a></div>
        },
      },{   
      //   key : 4,
      //   title: '分组',
      //   render: (text, row, index) => {
      //     return <div>{row.taskGroup}</div>
      //   },
      // },{   
        key : 5,
        title: '所属微服务',
        render: (text, row, index) => {
          return <div>{row.taskScope}</div>
        },
      },{   
        key : 6,
        title: '执行策略',
        render: (text, row, index) => {
          return <div>
            {`每天: ${row.timeSlots}`}
          </div>
        },
      },{   
        key : 7,
        title: '最近执行结果',
        render: (text, row, index) => {
          return <div>
            <p>{`执行时间: ${row.lastExecuteTime}`}</p>
            <p>{`执行结果: ${row.lastExecuteResult}`}</p>
          </div>
        },
      },{   
        key : 8,
        title: '任务有效期',
        render: (text, row, index) => {
          return <div>
            <p>{`开始: ${row.effectiveStartTime}`}</p>
            <p>{`结束: ${row.effectiveEndTime}`}</p>
          </div>
        },
      },{   
        key : 9,
        title: '启用',
        render: (text, row, index) => {
          return <div>
            <Switch
            size={'small'}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={row.isActive}></Switch>
          </div>
        },
      },{
        key : 10,
        title: '操作',
        render: (text, row, index) => {

          return row.isInternal ? <div>
            <a style={{fontWeight:'bold', marginLeft: '0px', color: 'grey'}}>{'详情'}</a>
          </div> : <div>
          <div>
          <a style={{fontWeight:'bold', marginLeft: '0px', color: 'grey'}}>{'详情'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px'}}>{'修改'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px', color: 'red'}}>{'删除'}</a>
          </div> 
          </div> 
        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={this.doInstanceList} layout="inline">
          <Row gutter={24}>
            <Col className='ant-col-offset-20' span={2}>
              <FormItem>
                <Button type="default" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
            <Col className='ant-col-offset-0' span={2}>              
              <FormItem>
                <Button onClick={()=>{this.onSubViewVisibleHandler(this.state.viewDemoBmcAdd.key, true, {});}} type="primary" htmlType="button" style={{ width: '100%'}}>新增</Button>
              </FormItem>
            </Col>            
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Table
                bordered
                loading={this.state.loading}
                dataSource={this.state.data}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
          <div>   
            <DemoBmcAddDrawer destroyOnClose={true} viewObj={this.state.viewDemoBmcAdd}/>
            <DemoBmcProfileAddDrawer destroyOnClose={true} viewObj={this.state.viewDemoBmcProfileAdd}/>
          </div>          
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}





