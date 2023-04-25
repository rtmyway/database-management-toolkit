import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DdmSinkAddDrawer from './DdmSinkAddDrawer';
import DdmSinkOutputDrawer from '../DdmSink/DdmSinkOutputDrawer';
import styles from '../DdmGlobal.less';
import DdmGlobalConstants from '../DdmGlobalConstants';
import {sinkList, sinkAdd, sinkRemove, sinkEnable, sinkDisable} from '../../../services/ddm-sink'
import {policyList} from '../../../services/ddm-policy'
import {connectorProxy} from '../../../services/ddm-connector'


const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DdmSinkMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      instanceNameList: [],
      policyNameList: [],
      data : [],
      viewDdmSinkOutputList : {
        key: DdmGlobalConstants.viewKeyMap.VIEW_DDM_SINK_OUTPUT_LIST,
        title: '输出列表',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
      },      
      viewDdmSinkAdd : {
        key: DdmGlobalConstants.viewKeyMap.VIEW_DDM_SINK_ADD,
        title: '新增输出源',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
        onSubViewActionHandler: this.onSubViewActionHandler,
        action: {
          confirm: DdmGlobalConstants.actionKeyMap.ACTION_DDM_SINK_ADD_CONFIRM,
        },
      },
      viewDdmSinkRemove : {
        key: DdmGlobalConstants.viewKeyMap.VIEW_DDM_SINK_REMOVE,
        title: '删除输出源',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
        onSubViewActionHandler: this.onSubViewActionHandler,
        action: {
          confirm: DdmGlobalConstants.actionKeyMap.ACTION_DDM_SINK_REMOVE_CONFIRM,
        },
      },    
    };
  }

  //render前执行
  componentWillMount() {
    // 加载数据源实例列表
    this.doInstanceNameList();
    this.doPolicyNameList();

    //默认执行一次查询
    this.doSinkList();
  }

  componentDidMount(){

  }

  doInstanceNameList = async () => {
    const reqParam = {
      method: 'GET',
      path: '/connectors',
    };
    const response = await connectorProxy(reqParam);
    try {
      let tmpArray = JSON.parse(response.data);
      this.setState({instanceNameList: tmpArray});
    } catch (error) {
      
    }
  }

  doPolicyNameList = () => {
    const reqParam = {
    };
    
    policyList(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.data.map(item => item.policyId);
        this.setState({
          policyNameList: list
        });
      }
    });
  }  

  /*发起查询*/
  doSinkList = () => {
    const reqParam = {
    };
    // 加载状态=>加载中
    this.setState({loading: true,});
    
    sinkList(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.data;
        for (let i = 0; i < list.length; i++) {
          list[i].key = i + 1;
          list[i].serialNo = i + 1;
        }
        this.setState({
          data: list
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }

  /**
   * 子视图上所有的事件
   * @param viewKey 视图key(DdmGlobalConstants.viewKeyMap)
   * @param actionKey 事件key(DdmGlobalConstants.actionKeyMap)
   * @param data 事件需要的数据
   */
   onSubViewActionHandler = (viewKey, actionKey, data) => {
    let viewObj;
    let reqParam;
    if (this.state.viewDdmSinkAdd.action.confirm == actionKey) {
      viewObj = this.state.viewDdmSinkAdd;
      viewObj.changeable = false;
      viewObj.spinning = true;
      this.setState({viewDdmSinkAdd: viewObj,});
      
      reqParam = {...data};
      sinkAdd(reqParam, (response) => {
        if (response != undefined && response != null) {
          message.success("新增成功");
          viewObj.visible = false;
          this.doSinkList();
        }
        viewObj.spinning = false;
        this.setState({viewDdmSinkAdd: viewObj,});
      });
    } else if (this.state.viewDdmSinkRemove.action.confirm == actionKey) {
      let that = this;
      confirm({
        title: `确定要删除 【${data.sinkId}】 吗?`,
        content: '删除后无法恢复,请谨慎操作',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let reqParam = {
            sinkId: data.sinkId,
          }
          that.setState({loading: true});
          sinkRemove(reqParam, (response) => {
            if (response != undefined && response != null) {
              message.success("删除成功");
              that.doSinkList();
            }
            that.setState({loading: false});
          });
          
        },
        onCancel() {
  
        },
      });
    }
  }

  /**
   * 子视图的显示/隐藏
   * @param viewKey 视图key(DdmGlobalConstants.viewKeyMap)
   * @param visible true:显示 false:隐藏
   * @param data 传递给子视图需要的数据
   */
  onSubViewVisibleHandler = (viewKey, visible, data) => {
    let viewObj;
    if (this.state.viewDdmSinkAdd.key == viewKey) {
      viewObj = this.state.viewDdmSinkAdd;
      viewObj.changeable = true;
      viewObj.visible = visible;
      viewObj.data = data;
      this.setState({viewDdmSinkAdd: viewObj,});
    } else if (this.state.viewDdmSinkOutputList.key == viewKey) {
      viewObj = this.state.viewDdmSinkOutputList;
      viewObj.changeable = true;
      viewObj.visible = visible;

      data.instanceNameList = this.state.instanceNameList;
      data.policyNameList = this.state.policyNameList;

      viewObj.data = data;
      this.setState({viewDdmKafkaTopicList: viewObj,});
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
        title: '输出源名称',
        render: (text, row, index) => {
          if (row.internal == 1) {
            return <div>{'内置存储器'}</div>
          } else {
            return <div>{row.sinkId}</div>
          }

        },
      },{    
        key : 4,
        title: '输出源类型',
        render: (text, row, index) => {
          let sinkTag = "";
          if (row.sinkItem == "kafka") {
            sinkTag = <div><Tag key={"kafka"} color="blue">{'kafka'}</Tag><a style={{fontWeight:'normal', marginLeft: '20px', }} onClick={()=>{
              this.onSubViewVisibleHandler(this.state.viewDdmSinkOutputList.key, true, row);
            }}>{'查看topic'}</a></div>;
          } else if (row.sinkItem == "elasticsearch") {
            sinkTag = <div><Tag key={"elasticsearch"} color="blue">{'elasticsearch'}</Tag><a style={{fontWeight:'normal', marginLeft: '20px', }} onClick={()=>{
              this.onSubViewVisibleHandler(this.state.viewDdmSinkOutputList.key, true, row);
            }}>{'查看索引'}</a></div>;
          } 
          return <div>{sinkTag}</div>
        },
      },{    
        key : 5,
        title: '输出源地址',
        render: (text, row, index) => {
          if (row.internal == 1) {
            return <div></div>
          } else {
            return <div>{row.bootstrapServer}</div>
          }
          
        },
      },{
        key : 7,
        title: '状态',
        width: '120px',
        render: (text, row, index) => {
          return  <Switch
            size={'small'}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={row.status == 1}
            onChange={(v)=>{
              const reqParam = {
                sinkId: row.sinkId,
              };
              this.setState({loading: true,});
              if (v) {
                sinkEnable(row, (response) => {
                  this.setState({loading: false,});
                  this.doSinkList();
                });
              } else {
                sinkDisable(row, (response) => {
                  this.setState({loading: false,});
                  this.doSinkList();
                });
              }
            }}
          />
        },
      },{
        key : 8,
        title: '操作',
        render: (text, row, index) => {
          if (row.internal == 1) {
            return <div></div>;
          } else {
            return <div>
              <a style={{fontWeight:'bold', marginLeft: '0px', color: 'red'}} onClick={()=>{this.onSubViewActionHandler(this.state.viewDdmSinkRemove.key, this.state.viewDdmSinkRemove.action.confirm, row);}}>{'删除'}</a>
            </div>;
          }

        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={this.doSinkList} layout="inline">
          <Row gutter={24}>
            <Col className='ant-col-offset-20' span={2}>
              <FormItem>
                <Button type="default" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
            <Col className='ant-col-offset-0' span={2}>
              <FormItem>
                <Button onClick={()=>{this.onSubViewVisibleHandler(this.state.viewDdmSinkAdd.key, true, {});}} type="primary" htmlType="button" style={{ width: '100%'}}>新增</Button>
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
            <DdmSinkAddDrawer destroyOnClose={true} viewObj={this.state.viewDdmSinkAdd}/>
            <DdmSinkOutputDrawer destroyOnClose={true} viewObj={this.state.viewDdmSinkOutputList}/>        
          </div>          
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}





