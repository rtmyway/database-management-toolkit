import React, { Component } from 'react';

import { Row, Col, Form, message, Select, Empty, Switch, Card, Spin, Tag, List, Button, Icon, Modal, Menu, Dropdown} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../DdmGlobal.less';
import DdmGlobalConstants from '../DdmGlobalConstants';
import DdmSinkOutputDrawer from '../DdmSink/DdmSinkOutputDrawer';
import { appStatus } from '../../../services/ddm-app'
import { kafkaStatus} from '../../../services/ddm-kafka'
import { connectorStatus, connectorStart, connectorStop, connectorProxyRequest, connectorProxy, getConnectorDownloadUrl} from '../../../services/ddm-connector'
import { distributionStatus, distributionStart, distributionStop} from '../../../services/ddm-distribution'
import { policyList, policyEnable, policyDisable } from '../../../services/ddm-policy'
import { sinkList, sinkEnable, sinkDisable } from '../../../services/ddm-sink'

const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;


@Form.create()
export default class DdmDashbordMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      viewDdmSinkOutputList: {
        key: DdmGlobalConstants.viewKeyMap.VIEW_DDM_SINK_OUTPUT_LIST,
        title: '输出列表',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
      },
      appObj: {
        isStarted: false,
      },
      kafkaObj: {
        isStarted: false,
        host: '',
      },
      connectorObj: {
        isStarted: false,
      },
      distributionObj: {
        isStarted: false,
        isActive: false,
        policyList: [],
      },
      instanceList: [],
      policyList: [],
      sinkList: [],
      pluginList: [],
    };
  }

  componentWillMount() {


    // 获取整个ddm的运行状态
    this.loadAppStatus();

  }

  componentDidMount() {

  }

  loadAppStatus = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({ loading: true, });
    appStatus(reqParam, (response) => {
      if (response != undefined && response != null) {
        let tmpObj = this.state.appObj;
        tmpObj.isStarted = response.data;


        if (tmpObj.isStarted) {
          this.setState({
            appObj: tmpObj
          });
          // 加载状态=>完成
          this.setState({ loading: false, });

          // kafka状态
          this.loadKafkaStatus(); 

          // 连接器状态
          this.loadConnectorStatus();

          // 分发器状态
          this.loadDistributionStatus();
        } else {
          let that = this;
          // 重新查询app状态
          setTimeout(function () {
            that.loadAppStatus();
          }, 2000);
        }
      }

    });
  }


  loadKafkaStatus = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({ loading: true, });
    kafkaStatus(reqParam, (response) => {
      if (response != undefined && response != null) {
        let tmpObj = this.state.kafkaObj;
        tmpObj.isStarted = response.data;
        this.setState({
          kafkaObj: tmpObj
        });
      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }

  loadConnectorStatus = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({ loading: true, });
    connectorStatus(reqParam, (response) => {
      if (response != undefined && response != null) {
        let tmpObj = this.state.connectorObj;
        tmpObj.isStarted = response.data;
        this.setState({
          connectorObj: tmpObj
        });

        if (tmpObj.isStarted) {
          // 连接器已启动,获取实例信息和插件信息
          this.connectorController.refreshInstance();
          this.connectorController.refreshPlugin();
        }

      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }

  loadDistributionStatus = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({ loading: true, });
    distributionStatus(reqParam, (response) => {
      if (response != undefined && response != null) {
        let tmpObj = this.state.distributionObj;
        tmpObj.isStarted = response.data.started;
        tmpObj.active = response.data.active;
        this.setState({
          distributionObj: tmpObj
        });

        if (tmpObj.isStarted) {
          // 分发器已启动,获取策略信息和输出信息
          this.loadPolicyList();
          this.loadSinkList();
        }
      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }

  connectorController = {
    that: this,
    instanceList: [],
    instanceNameList: [],
    pluginList: [],
    refreshInstance: async function() {
      this.that.setState({ loading: true, });
      this.instanceNameList = [];
      this.instanceList = [];
      await this.loadInstanceNameList();
      await this.loadInstanceList();
      await this.loadInstanceStatusList();
      let currentInstanceList = this.instanceList;
      this.that.setState({loading:false, instanceList: currentInstanceList});
    },
    refreshPlugin: async function() {
      this.that.setState({ loading: true, });
      this.pluginList = [];
      const reqParam = {
        method: 'GET',
        path: '/connector-plugins',
      };
      const response = await connectorProxy(reqParam);
      try {
        this.pluginList = JSON.parse(response.data);
      } catch (error) {
        
      }
      let currentPluginList = this.pluginList.filter((item) => {return item.type == 'sink' && item.class.indexOf('com.gantang') == 0});
      this.that.setState({loading:false, pluginList: currentPluginList});
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
      let customizeInstanceList = [];
      for (let i = 0; i < this.instanceNameList.length; i++) {
        const reqParam = {
          method: 'GET',
          path: '/connectors/' + this.instanceNameList[i],
        };
        const response = await connectorProxy(reqParam);
        let tmpObj = JSON.parse(response.data);
        let tmpInstance = {
          name: tmpObj.name,
          class: tmpObj.config['connector.class'],
          host: tmpObj.config['database.hostname'],
          port: tmpObj.config['database.port'],
          tasks: tmpObj.tasks,
          type: tmpObj.type,
          isRunning: false, // 默认未启动
        };
        if (tmpInstance.class == 'io.debezium.connector.oracle.OracleConnector') {
          sourceOracleInstanceList.push(tmpInstance);
        } else if (tmpInstance.class == 'io.debezium.connector.postgresql.PostgresConnector') {
          sourcePgInstanceList.push(tmpInstance);
        } else {
          customizeInstanceList.push(tmpInstance);
        }
        this.instanceList = sourceOracleInstanceList.concat(sourcePgInstanceList).concat(customizeInstanceList);
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

  loadPolicyList = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({ loading: true, });
    policyList(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          policyList: response.data
        });
      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }

  loadSinkList = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({ loading: true, });
    sinkList(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          sinkList: response.data
        });
      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }

  switchStatus = (item) => {
    // 加载状态=>加载中
    this.setState({ loading: true, });
    let reqParam = {};
    let tmpObj;
    if (item == 'connector') {
      tmpObj = this.state.connectorObj;
      if (tmpObj.isStarted) {
        connectorStop(reqParam, (response) => {
          if (response != undefined && response != null) {
            message.success("数据源连接器已关闭");
            tmpObj.isStarted = !response.data;
            this.setState({
              connectorObj: tmpObj
            });
            this.connectorController.refreshInstance();
            this.connectorController.refreshPlugin();
          }
          // 加载状态=>完成
          this.setState({ loading: false, });
        });
      } else {
        connectorStart(reqParam, (response) => {
          if (response != undefined && response != null) {
            message.success("数据源连接器已启动");
            tmpObj.isStarted = response.data;
            this.setState({
              connectorObj: tmpObj
            });
            this.connectorController.refreshInstance();
            this.connectorController.refreshPlugin();
          }
          // 加载状态=>完成
          this.setState({ loading: false, });
        });
      }
    } else if (item == 'distribution') {
      tmpObj = this.state.distributionObj;
      if (tmpObj.isStarted) {
        distributionStop(reqParam, (response) => {
          if (response != undefined && response != null) {
            message.success("分发处理器已关闭");
            tmpObj.isStarted = response.data.started;
            tmpObj.active = response.data.active;
            this.setState({
              distributionObj: tmpObj
            });
          }
          // 加载状态=>完成
          this.setState({ loading: false, });
        });
      } else {
        distributionStart(reqParam, (response) => {
          if (response != undefined && response != null) {
            message.success("分发处理器已启动");
            tmpObj.isStarted = response.data.started;
            tmpObj.active = response.data.active;
            this.setState({
              distributionObj: tmpObj
            });
          }
          // 加载状态=>完成
          this.setState({ loading: false, });
        });
      }
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
    if (this.state.viewDdmSinkOutputList.key == viewKey) {
      viewObj = this.state.viewDdmSinkOutputList;
      viewObj.changeable = true;
      viewObj.visible = visible;
      viewObj.data = data;
      this.setState({ viewDdmKafkaTopicList: viewObj, });
    }
  }


  buildInstanceDom = (connectors) => {
    let currentInstanceList = this.state.instanceList.filter(item => {
      if (connectors == null || connectors == undefined) {
        return false;
      }

      let findIndex = connectors.findIndex(c => {
        return item.class.indexOf(c) != -1;
      });

      return findIndex != -1;
    });


    if (currentInstanceList.length == 0) {
      return <Empty></Empty>;
    }
    return <List
      itemLayout="horizontal"
      dataSource={currentInstanceList}
      renderItem={item => {
        let itemDetail = '';
        if (item.host != undefined && item.host != null & item.port != undefined && item.port != null) {
          itemDetail = `${item.host}:${item.port}`;
        }
        let classNameArray = item.class.split('.');
        let lastClassName = classNameArray[classNameArray.length - 1];
        let itemTag = <Tag>{lastClassName}</Tag>;
        // if (lastClassName == 'OracleConnector' || lastClassName == 'PostgresConnector') {
        //   itemTag = <Tag color='blue'>{lastClassName}</Tag>;
        // }
        let itemOp = <Switch style={{marginLeft:'20px', marginTop: '-15px'}}
          size={'default'}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          disabled={!this.state.connectorObj.isStarted}
          checked={item.isRunning}
          onChange={(v)=>{
            const reqParam = {
              method: 'PUT',
              path: v ? '/connectors/' + item.name + '/resume' : '/connectors/' + item.name + '/pause',
              body: {},
            };
            // 加载状态=>加载中
            this.setState({ loading: true, });
            connectorProxyRequest(reqParam, (response) => {
              if (response != undefined && response != null) {
                let that = this;
                setTimeout(function () {
                  if (v) {
                    message.success(`实例${item.name} 已启用`);   
                  } else {
                    message.warn(`实例${item.name} 已停用`);   
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
          }}
        />
        
        let itemRestart = <Button style={{marginLeft:'30px', marginTop: '-15px'}} type="danger" icon="reload" size='small' onClick={(v)=>{
          let that = this;
          confirm({
            title: `确定重启实例 【${item.name}】 吗?`,
            content: '',
            okText: '重启',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
              const reqParam = {
                method: 'POST',
                path: '/connectors/' + item.name + '/restart?includeTasks=true',
                body: {}
              };
              // 加载状态=>加载中
              that.setState({ loading: true, });
              connectorProxyRequest(reqParam, (response) => {
                if (response != undefined && response != null) {
                  setTimeout(function () {
                    message.warn(`实例${item.name} 已重启`);   
                    that.connectorController.refreshInstance();
                    // 加载状态=>完成
                    that.setState({ loading: false, });
                  }, 5000);
                } else {
                  // 加载状态=>完成
                  that.setState({ loading: false, });
                }
              });              
            },
            onCancel() {
      
            },
          });
        }}>重启</Button>
        return <List.Item actions={[<a key=""></a>]}>
          <List.Item.Meta
            avatar={itemTag}
            title={<p><span style={{ fontWeight: 'Bold' }}>{item.name}</span><span style={{ marginLeft: '30px' }}>{itemDetail}</span></p>}
          />{itemOp}{itemRestart}
        </List.Item>
      }
      }
    />;
  }

  buildPluginDom = () => {
    if (this.state.pluginList.length == 0) {
      return <Empty></Empty>;
    }
    return <List
      itemLayout="horizontal"
      dataSource={this.state.pluginList}
      renderItem={item => {
        return <List.Item actions={[<a key=""></a>]}>
          <List.Item.Meta
            title={item.class}
          />
        </List.Item>
        }
      }
    />;
  }

  buildPolicyDom = () => {
    if (this.state.policyList.length == 0) {
      return <Empty></Empty>;
    }
    return <List
      itemLayout="horizontal"
      dataSource={this.state.policyList}
      renderItem={item => {
        let itemTag = <Empty></Empty>;
        if (item.shareMode == 1) {
          itemTag = <Tag>{'共享'}</Tag>;
        } else if (item.shareMode == 0) {
          itemTag = <Tag>{'独享'}</Tag>;
        }

        let itemOp = <Switch
          size={'small'}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={item.status == 1}
          onChange={(v)=>{
            const reqParam = {
              policyId: item.policyId,
            };
            this.setState({loading: true,});
            if (v) {
              policyEnable(item, (response) => {
                message.success(`策略${item.policyId}已启用`);
                this.setState({loading: false,});
                this.loadPolicyList();
              });
            } else {
              policyDisable(item, (response) => {
                message.warn(`策略${item.policyId}已停用`);
                this.setState({loading: false,});
                this.loadPolicyList();
              });
            }
          }}
        />

        return <List.Item actions={[<a key=""></a>]}>
          <List.Item.Meta
            avatar={itemTag}
            title={item.policyId}
          />{itemOp}
        </List.Item>
      }
      }
    />;
  }

  buildSinkDom = () => {
    if (this.state.sinkList.length == 0) {
      return <Empty></Empty>;
    }
    return <List
      itemLayout="horizontal"
      dataSource={this.state.sinkList}
      renderItem={item => {
        let itemTag = <Empty></Empty>;
        let itemLink = '';
        if (item.sinkItem == 'kafka') {
          itemTag = <Tag style={{width:'100px'}}>{'kafka'}</Tag>;
          itemLink = <a style={{ textDecoration: 'underline', color: '#f50', fontWeight: 'bold', marginLeft: '0px' }} onClick={() => {
            this.onSubViewVisibleHandler(this.state.viewDdmSinkOutputList.key, true, item);
          }}>{'topic信息'}</a>
        } else if (item.sinkItem == 'elasticsearch') {
          itemTag = <Tag style={{width:'100px'}}>{'elasticsearch'}</Tag>;
          itemLink = <a style={{ textDecoration: 'underline', color: '#2db7f5', fontWeight: 'bold', marginLeft: '0px' }} onClick={() => {
            this.onSubViewVisibleHandler(this.state.viewDdmSinkOutputList.key, true, item);
          }}>{'index信息'}</a>
        }

        let itemOp = <Switch
        size={'small'}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={item.status == 1}
          onChange={(v)=>{
            const reqParam = {
              sinkId: item.sinkId,
            };
            this.setState({loading: true,});
            if (v) {
              sinkEnable(item, (response) => {
                message.success(`输出${item.sinkId}已启用`);
                this.setState({loading: false,});
                this.loadSinkList();
              });
            } else {
              sinkDisable(item, (response) => {
                message.warn(`输出${item.sinkId}已停用`);
                this.setState({loading: false,});
                this.loadSinkList();
              });
            }
          }}
        />

        return <List.Item actions={[<a key=""></a>]}>
          <List.Item.Meta
            avatar={itemTag}
            title={item.internal == 1 ? '内置存储器' : item.sinkId}
            // description={<span><span>{item.internal == 1 ? '' : item.bootstrapServer}</span></span>}
          />{itemOp}
        </List.Item>
      }
      }
    />;
  }

  render() {
    let logUrl = getConnectorDownloadUrl() + '?logType=';
    let connectorMenuItems = <Menu>
      <Menu.Item>
        <a target="_blank" rel="" href={`${logUrl}CONNECTOR_TODAY_LOG`}>最新日志</a>
      </Menu.Item>
      <Menu.Item>
      <a target="_blank" rel="" href={`${logUrl}CONNECTOR_ALL_LOG`}>全部日志</a>
      </Menu.Item>      
    </Menu>

    let connectorDropdownMenu = <Dropdown overlay={connectorMenuItems}>
      <a className="ant-dropdown-link" style={{color: 'red'}} onClick={e => e.preventDefault()}>日志下载<Icon type="down" /></a>
    </Dropdown>


    let connectorBadge = <Switch checked={this.state.connectorObj.isStarted} onChange={(v) => { this.switchStatus('connector'); }} />;
    let distributionBadge = <Switch checked={this.state.distributionObj.isStarted} onChange={(v) => { this.switchStatus('distribution'); }} />;

    return (
      <PageHeaderWrapper title={''}>
        <div style={{ fontSize: '20px', color: 'blue', marginTop: '20px' }}>
          <Spin spinning={this.state.loading}>
            <Row>
              <Col span={12}>
                <Card title={<div><Icon type="link" style={{color:'#108ee9'}}/><span style={{marginLeft:'10px', marginRight:'50px', fontWeight: 'Bold', color:'#108ee9'}}>连接器</span>{connectorDropdownMenu}</div>} extra={connectorBadge}>
                  <Card title={<span style={{color:'#108ee9'}}>数据源连接器实例</span>} style={{ marginTop: 3}}>
                    {this.buildInstanceDom(['OracleConnector', 'PostgresConnector'])}
                  </Card>
                  <Card title={<span style={{color:'#108ee9'}}>自定义连接器实例</span>} style={{ marginTop: 20}}>
                    {this.buildInstanceDom(['JdbcSinkConnector'])}
                  </Card>
                  {/* <Card title={<span style={{color:'#108ee9'}}>自定义连接器({this.state.pluginList.length})</span>} style={{ marginTop: 50 }}>
                    {this.buildPluginDom()}
                  </Card> */}
                </Card>
              </Col>

              <Col offset={1} span={10}>
                <Card title={<div><Icon type="pull-request" style={{color:'#108ee9'}}/><span style={{marginLeft:'10px', fontWeight: 'Bold', color:'#108ee9'}}>分发器</span></div>} extra={distributionBadge}>
                  <Card title={<span style={{color:'#108ee9'}}>分发策略</span>}  style={{ marginTop: 3 }}>
                    {this.buildPolicyDom()}
                  </Card>
                  <Card title={<span style={{color:'#108ee9'}}>分发输出</span>}  style={{ marginTop: 20 }}>
                    {this.buildSinkDom()}
                  </Card>
                </Card>
              </Col>
            </Row>
          </Spin>
        </div>
        <div>
          <DdmSinkOutputDrawer destroyOnClose={true} viewObj={this.state.viewDdmSinkOutputList} />
        </div>
      </PageHeaderWrapper>
    );
  }
}
