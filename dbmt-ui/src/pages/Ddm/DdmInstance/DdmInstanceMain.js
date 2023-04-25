import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DdmInstanceAddDrawer from './DdmInstanceAddDrawer';
import DdmInstanceUpdateDrawer from './DdmInstanceUpdateDrawer';
import styles from '../DdmGlobal.less';
import ViewCommon from '../../../commons/ViewCommon'
import DdmGlobalConstants from '../DdmGlobalConstants';
import { connectorProxyRequest, connectorProxy} from '../../../services/ddm-connector'

const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DdmInstanceMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      instanceList: [],
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
    instanceList: [],
    refreshInstance: async function() {
      this.that.setState({ loading: true, });
      this.instanceNameList = [];
      this.instanceList = [];
      await this.loadInstanceNameList();
      await this.loadInstanceList();
      await this.loadInstanceStatusList();
      this.that.setState({
        loading:false,
        instanceList: this.instanceList,
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
        }
        this.instanceList = sourceOracleInstanceList.concat(sourcePgInstanceList); 
      }
      return this;
    },
    loadInstanceStatusList: async function() {
      for (let i = 0; i < this.instanceList.length; i++) {
        let taskArray = this.instanceList[i].tasks;
        if (taskArray == null || taskArray.length == 0) {
          continue;
        }
        const reqParam = {
          method: 'GET',
          path: '/connectors/' + this.instanceList[i].name + '/tasks/' + this.instanceList[i].tasks[0].task + '/status',
        };
        const response = await connectorProxy(reqParam);
        try {
          let tmpObj = JSON.parse(response.data);
          let isRunning = tmpObj.state == 'RUNNING';
          this.instanceList[i].isRunning = isRunning;          
        } catch (error) {
          console.info(error);
        }

      }
      return this;
    },
    finish: function() {

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
      let configObj = this.buildConfig(data, 'ADD');
      const reqParam = {
        method: 'POST',
        path: '/connectors',
        body: configObj,
      };

      // 加载状态=>加载中
      tmpViews[index].changeable = false;
      tmpViews[index].spinning = true;
      this.setState({ views: tmpViews});
      connectorProxyRequest(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`${configObj.name} 已创建`);   
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
      let configObj = this.buildConfig(data, 'UPDATE');
      const reqParam = {
        method: 'PUT',
        path: '/connectors/' + configObj.name + '/config',
        body: configObj.config,
      };

      // 加载状态=>加载中
      tmpViews[index].changeable = false;
      tmpViews[index].spinning = true;
      this.setState({ views: tmpViews});
      connectorProxyRequest(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`${configObj.name} 已更新`);   
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


  /**
   * 页面配置转成连接器配置
   * @param {*} content 
   */
  buildConfig = (content, mode) => {
    let configObj = {
      name: content.instanceId,
      config: {
      },
    };

    if (mode == 'ADD') {
      configObj.name = `ddm-${content.databaseItem}-${content.instanceId}`;
    } else if (mode == 'UPDATE') {
      configObj.name = content.instanceId;
    }

    if (content.databaseItem == 'oracle') {
      configObj.config = {
        'connector.class': 'io.debezium.connector.oracle.OracleConnector',
        'database.server.name': configObj.name,
        'topic.prefix': configObj.name,
        'database.hostname': content.databaseHost,
        'database.port': content.databasePort,
        'database.user': content.databaseUser,
        'database.password': content.databasePassword,
        'snapshot.mode': content.snapshotMode,
        'database.dbname': content.databaseDbName,
        'schema.include.list': content.schemaIncludeList,
        'table.include.list': content.tableIncludeList,
        'decimal.handling.mode': 'double',
        'binary.handling.mode': 'bytes',
        'time.precision.mode': 'connect',
        'heartbeat.interval.ms': 10000,
        'topic.heartbeat.prefix': 'heartbeat',
        // 'database.url': '',  // oracle专用
        'database.pdb.name': content.databasePdbName, // oracle专用
        'schema.history.internal.kafka.bootstrap.servers': 'localhost:9092', // oracle专用
        'schema.history.internal.kafka.topic': `schema-changes.${configObj.name}`, // oracle专用
        'log.mining.strategy': 'online_catalog', // 同步策略 oracle专用
      };
    } else if (content.databaseItem == 'postgres') {
      configObj.config = {
        'connector.class': 'io.debezium.connector.postgresql.PostgresConnector',
        'database.server.name': configObj.name,
        'topic.prefix': configObj.name,        
        'database.hostname': content.databaseHost,
        'database.port': content.databasePort,
        'database.user': content.databaseUser,
        'database.password': content.databasePassword,
        'snapshot.mode': content.snapshotMode,
        'database.dbname': content.databaseDbName,
        'schema.include.list': content.schemaIncludeList,
        'table.include.list': content.tableIncludeList,
        'decimal.handling.mode': 'double',
        'binary.handling.mode': 'bytes',
        'time.precision.mode': 'connect',
        'heartbeat.interval.ms': 10000,
        'topic.heartbeat.prefix': 'heartbeat',
        'plugin.name': 'decoderbufs', // pg专用
        'slot.name': configObj.name.replaceAll('-', '_'), // pg专用
        'slot.drop.on.stop': false, // 复制槽,测试环境建议打开，防止槽满
      };

    } else if (content.databaseItem == 'mysql') {
      configObj.config = {

      };
    } else {

    }



    return configObj;
  }

  /**
   * 连接器配置解析成页面配置
   * @param {*} content 
   */
  parseConfig = (content, resetInstanceId) => {
    let databaseItem = 'oracle';
    if (content.lastClassName == 'OracleConnector') {
      databaseItem = 'oracle';
    } else if (content.lastClassName == 'PostgresConnector') {
      databaseItem = 'postgres';
    }



    let dataObj = {
      instanceId: resetInstanceId ? 'new' : content.name,
      databaseItem: databaseItem,
      databaseHost: content.config["database.hostname"],
      databasePort: content.config["database.port"],
      databaseUser: content.config["database.user"],
      databasePassword: content.config["database.password"],
      databaseDbName: content.config["database.dbname"],
      databasePdbName: content.config["database.pdb.name"],
      schemaIncludeList: content.config["schema.include.list"],
      tableIncludeList: content.config["table.include.list"],
      snapshotMode: 'initial',
      status: 1
    };


    return dataObj;
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
        title: '数据源实例名称',
        render: (text, row, index) => {
          return <div>{row.name}</div>
        },
      },{   
        key : 3,
        title: '数据库类型',
        render: (text, row, index) => {
          let databaseItemTag = '';
          if (row.lastClassName == "OracleConnector") {
            databaseItemTag = <Tag key={"oracle"} color="#f50">{'oracle'}</Tag>;
          } else if (row.lastClassName == "PostgresConnector") {
            databaseItemTag = <Tag key={"postgres"} color="#2db7f5">{'postgres'}</Tag>;
          } else if (row.lastClassName == "MysqlConnector") {
            databaseItemTag = <Tag key={"mysql"} color="#87d068">{'mysql'}</Tag>;
          } else {
            databaseItemTag = <Tag key={"unknown"} color="#000">{'unknown'}</Tag>;
          }
          return <div>{databaseItemTag}</div>
        },
      },{   
        key : 4,
        title: '连接信息',
        render: (text, row, index) => {
          let dbDom = '';
          if (row.lastClassName == "OracleConnector") {
            dbDom = <div>
              <p>{`地址：${row.config["database.hostname"]}:${row.config["database.port"]}`}</p>
              <p>{`CDB：${row.config["database.dbname"]}`}</p>
              <p>{`PDB：${row.config["database.pdb.name"]}`}</p>
              <p>{`用户名/密码：${row.config["database.user"]}/${row.config["database.password"]}`}</p>
            </div>;
          } else if (row.lastClassName == "PostgresConnector") {
            dbDom = <div>
              <p>{`地址：${row.config["database.hostname"]}:${row.config["database.port"]}`}</p>
              <p>{`数据库名：${row.config["database.dbname"]}`}</p>
              <p>{`用户名/密码：${row.config["database.user"]}/${row.config["database.password"]}`}</p>
            </div>;
          } else if (row.lastClassName == "MysqlConnector") {
          } else {
          }    
          return <div>{dbDom}</div>;
        },
      },{
        key : 5,
        title: '同步对象',
        render: (text, row, index) => {
          let targetDom = "";
          if (row.lastClassName == "OracleConnector") {
            targetDom = <div>
              <p>{`schemas：${row.config["schema.include.list"]}`}</p>
              <p>{`tables：${row.config["table.include.list"]}`}</p>
            </div>;
          } else if (row.lastClassName == "PostgresConnector") {
            targetDom = <div>
              <p>{`schemas：${row.config["schema.include.list"]}`}</p>
              <p>{`tables：${row.config["table.include.list"]}`}</p>
            </div>;
          } else if (row.lastClassName == "MysqlConnector") {
          } else {
          }    
          return <div>{targetDom}</div>
        },
      },{
        key : 6,
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
            <a style={{fontWeight:'bold', marginLeft: '0px'}} onClick={()=>{this.onSubViewVisibleHandler('ADD', true, this.parseConfig(row, true));}}>{'克隆'}</a>            
            <a style={{fontWeight:'bold', marginLeft: '20px'}} onClick={()=>{this.onSubViewVisibleHandler('UPDATE', true, this.parseConfig(row, false));}}>{'修改'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px', color: 'red'}} onClick={()=>{this.onRemoveInstance(row);}}>{'删除'}</a>
          </div>
        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={this.connectorController.refreshInstance} layout="inline">
          <Row gutter={24}>
            <Col className='ant-col-offset-20' span={2}>
              <FormItem>
                <Button type="default" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
            <Col className='ant-col-offset-0' span={2}>              
              <FormItem>
                <Button onClick={()=>{this.onSubViewVisibleHandler("ADD", true, {});}} type="primary" htmlType="button" style={{ width: '100%'}}>新增</Button>
              </FormItem>
            </Col>            
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Table
                bordered
                loading={this.state.loading}
                dataSource={this.state.instanceList}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
          <div>
            <DdmInstanceAddDrawer destroyOnClose={true} viewObj={this.state.views[0]}/>
            <DdmInstanceUpdateDrawer destroyOnClose={true} viewObj={this.state.views[1]}/>            
          </div>          
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}





