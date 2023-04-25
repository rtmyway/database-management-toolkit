import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, Popover, message} from 'antd';
import ReactJson from 'react-json-view'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DdmCustomizedInstanceAddDrawer from './DdmCustomizedInstanceAddDrawer';
import DdmCustomizedInstanceUpdateDrawer from './DdmCustomizedInstanceUpdateDrawer';
import styles from '../DdmGlobal.less';
import ViewCommon from '../../../commons/ViewCommon'
import DdmGlobalConstants from '../DdmGlobalConstants';

import { connectorProxyRequest, connectorProxy} from '../../../services/ddm-connector'

const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DdmCustomizedInstanceMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],
      sourceInstanceList: [],
      customizedInstanceList: [],
      views: ViewCommon.createViews([
        {key: 'ADD', title: '新增', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
        {key: 'UPDATE', title: '修改', visible: false, changeable: true, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
        {key: 'REMOVE', title: '删除', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
      ]),  
    };
  }

  //render前执行
  componentWillMount() {
    //默认执行一次查询
    this.connectorController.refreshInstance();
  }

  componentDidMount(){

  }

  connectorController = {
    that: this,
    instanceNameList: [],
    sourceInstanceList: [],
    customizedInstanceList: [],
    refreshInstance: async function() {
      this.that.setState({ loading: true, });
      this.instanceNameList = [];
      this.sourceInstanceList = [];
      this.customizedInstanceList = [];
      await this.loadInstanceNameList();
      await this.loadInstanceList();
      await this.loadInstanceStatusList();
      this.that.setState({
        loading:false,
        sourceInstanceList: this.sourceInstanceList,
        customizedInstanceList: this.customizedInstanceList,
      });
    },
    loadInstanceNameList:  async function() {
      const reqParam = {
        method: 'GET',
        path: '/connectors',
      };
      const response = await connectorProxy(reqParam);
      try {
        this.instanceNameList = JSON.parse(response.data);
      } catch (error) {
        
      }
    },
    loadInstanceList:  async function() {
      let sourceOracleInstanceList = [];
      let sourcePgInstanceList = [];
      let customizedInstanceList = [];
      for (let i = 0; i < this.instanceNameList.length; i++) {
        const reqParam = {
          method: 'GET',
          path: '/connectors/' + this.instanceNameList[i],
        };
        const response = await connectorProxy(reqParam);
        let tmpObj = JSON.parse(response.data);
        let tmpInstance = {
          key: tmpObj.name,
          name: tmpObj.name,
          class: tmpObj.config['connector.class'],
          lastClassName: '',
          tasks: tmpObj.tasks,
          type: tmpObj.type,
          config: tmpObj.config,
          isRunning: false, // 默认未启动
        };
        let classNameArray = tmpInstance.class.split('.');
        tmpInstance.lastClassName = classNameArray[classNameArray.length - 1];

        if (tmpInstance.class == 'io.debezium.connector.oracle.OracleConnector') {
          sourceOracleInstanceList.push(tmpInstance);
        } else if (tmpInstance.class == 'io.debezium.connector.postgresql.PostgresConnector') {
          sourcePgInstanceList.push(tmpInstance);
        } else {
          customizedInstanceList.push(tmpInstance);
        }       
        this.sourceInstanceList = sourceOracleInstanceList.concat(sourcePgInstanceList); 
        this.customizedInstanceList = customizedInstanceList;
      }
      return this;
    },
    loadInstanceStatusList: async function() {
      for (let i = 0; i < this.customizedInstanceList.length; i++) {
        let taskArray = this.customizedInstanceList[i].tasks;
        if (taskArray == null || taskArray.length == 0) {
          continue;
        }
        const reqParam = {
          method: 'GET',
          path: '/connectors/' + this.customizedInstanceList[i].name + '/tasks/' + this.customizedInstanceList[i].tasks[0].task + '/status',
        };
        const response = await connectorProxy(reqParam);
        let tmpObj = JSON.parse(response.data);
        let isRunning = tmpObj.state == 'RUNNING';
        this.customizedInstanceList[i].isRunning = isRunning;
      }
      return this;
    },
    finish: function() {

    }
  }

  /**
   * 子视图的显示/隐藏
   * @param viewKey 视图key
   * @param visible true:显示 false:隐藏
   * @param data 传递给子视图需要的数据
   */
  onSubViewVisibleHandler = (viewKey, visible, data) => {
    let tmpViews = this.state.views;
    for (let i = 0; i < tmpViews.length; i++) {
      if (viewKey == tmpViews[i].key) {
        tmpViews[i].visible = visible;
        tmpViews[i].data = data;
        tmpViews[i].changeable = true;
        this.setState({views: tmpViews});
        break;;
      }
    }
  }

  /**
   * 子视图上所有的事件
   * @param viewKey 视图key
   * @param actionKey 事件key
   * @param data 事件需要的数据
   */
  onSubViewActionHandler = (viewKey, actionKey, data) => {
    let tmpViews = this.state.views;
    let index = -1;
    for (let i = 0; i < tmpViews.length; i++) {
      if (viewKey == tmpViews[i].key) {
        index = i;
        break;
      }
    }

    if (index == -1) {
      return;
    }


    if (viewKey == 'ADD' && actionKey == 'CONFIRM') {
      const reqParam = {
        method: 'POST',
        path: '/connectors',
        body: data.config,
      };

      // 加载状态=>加载中
      tmpViews[index].changeable = false;
      tmpViews[index].spinning = true;
      this.setState({ views: tmpViews});
      connectorProxyRequest(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`${data.config.name} 已创建`);   
            that.connectorController.refreshInstance();

            // 加载状态=>完成
            tmpViews[index].spinning = false;
            tmpViews[index].visible = false;
            that.setState({ views: tmpViews, });
          }, 2000);
        } else {
          // 加载状态=>完成
            tmpViews[index].spinning = false;
            tmpViews[index].visible = true;
            that.setState({ views: tmpViews, });
        }
      });
    } else if (viewKey == 'UPDATE' && actionKey == 'CONFIRM') {
      const reqParam = {
        method: 'PUT',
        path: '/connectors/' + data.config.name + '/config',
        body: data.config.config,
      };

      // 加载状态=>加载中
      tmpViews[index].changeable = false;
      tmpViews[index].spinning = true;
      this.setState({ views: tmpViews});
      connectorProxyRequest(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`${data.config.name} 已更新`);   
            that.connectorController.refreshInstance();

            // 加载状态=>完成
            tmpViews[index].spinning = false;
            tmpViews[index].visible = false;
            that.setState({ views: tmpViews, });
          }, 2000);
        } else {
          // 加载状态=>完成
            tmpViews[index].spinning = false;
            tmpViews[index].visible = true;
            that.setState({ views: tmpViews, });
        }
      });
    }
  }

  onRemoveInstance = (item) => {
    let that = this;
    confirm({
      title: `确定要删除 【${item.name}】 吗?`,
      content: '删除后无法恢复,请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const reqParam = {
          method: 'DELETE',
          path: '/connectors/' + item.name,
          body: {},
        };
        // 加载状态=>完成
        that.setState({ loading: true, });
        connectorProxyRequest(reqParam, (response) => {
          if (response != undefined && response != null) {
            setTimeout(function () {
              message.success(`${item.name} 已删除`);   
              that.connectorController.refreshInstance();
              // 加载状态=>完成
              that.setState({ loading: false, });
            }, 2000);
          } else {
              // 加载状态=>完成
              that.setState({ loading: false, });
          }
        });        
        
      },
      onCancel() {

      },
    });
  }


  render() {
    const columns = [
      {
      //   key : 1,
      //   title: '编号',
      //   dataIndex: 'serialNo',
      // },{
        key : 2,
        title: '实例名称',
        render: (text, row, index) => {
          return <div>{row.name}</div>
        },
      },{   
        key : 3,
        title: '连接器类型',
        render: (text, row, index) => {
          return <div><Tag>{row.lastClassName}</Tag></div>
        },
      },{   
        key : 4,
        title: '连接信息',
        render: (text, row, index) => {
          let connectConfigDom = <ReactJson displayDataTypes={false} style={{width: '800px', height:'600px', overflow: 'auto'}} name={false} key={row.name} src={row.config}/>
          let popoverDom = <Popover content={connectConfigDom} title={row.name}>
            <a>查看详情</a>
          </Popover>
          return <div>{popoverDom}</div>;
        },
      },{
        key : 5,
        title: '运行状态',
        render: (text, row, index) => {
          let switchDom = <Switch
            size={'default'}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={row.isRunning}
            onChange={(v)=>{
              const reqParam = {
                method: 'PUT',
                path: v ? '/connectors/' + row.name + '/resume' : '/connectors/' + row.name + '/pause',
                body: {},
              };
              // 加载状态=>加载中
              this.setState({ loading: true, });
              connectorProxyRequest(reqParam, (response) => {
                if (response != undefined && response != null) {
                  let that = this;
                  setTimeout(function () {
                    if (v) {
                      message.success(`实例${row.name} 已启用`);   
                    } else {
                      message.warn(`实例${row.name} 已停用`);   
                    }
                    that.connectorController.refreshInstance();
                    // 加载状态=>完成
                    that.setState({ loading: false, });
                  }, 2000);
                } else {
                  // 加载状态=>完成
                  that.setState({ loading: false, });
                }
              });
            }}/>
          return <div>{switchDom}</div>
        },
      },{   
        key : 8,
        title: '操作',
        render: (text, row, index) => {
          return <div>
            <a style={{fontWeight:'bold', marginLeft: '0px'}} onClick={()=>{this.onSubViewVisibleHandler("ADD", true, {sourceInstanceList: this.state.sourceInstanceList, configObj: row.config});}}>{'克隆'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px'}} onClick={()=>{this.onSubViewVisibleHandler("UPDATE", true, {sourceInstanceList: this.state.sourceInstanceList, configObj: row.config});}}>{'修改'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px', color: 'red'}} onClick={()=>{this.onRemoveInstance(row);}}>{'删除'}</a>
          </div>
        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={null} layout="inline">
          <Row gutter={24}>
            <Col className='ant-col-offset-20' span={2}>
              <FormItem>
                <Button type="default" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
            <Col className='ant-col-offset-0' span={2}>              
              <FormItem>
                <Button onClick={()=>{this.onSubViewVisibleHandler("ADD", true, {sourceInstanceList: this.state.sourceInstanceList, configObj: {}});}} type="primary" htmlType="button" style={{ width: '100%'}}>新增</Button>
              </FormItem>
            </Col>            
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Table
                bordered
                loading={this.state.loading}
                dataSource={this.state.customizedInstanceList}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
          <div>
            <DdmCustomizedInstanceAddDrawer destroyOnClose={true} viewObj={this.state.views[0]} />   
            <DdmCustomizedInstanceUpdateDrawer destroyOnClose={true} viewObj={this.state.views[1]} />               
          </div>          
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}





