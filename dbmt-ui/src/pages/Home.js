import React, { Component } from 'react';

import { Row, Col, Form, Tag, Select, Empty, Switch, Card, Spin, Badge, List, Avatar} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {kafkaStatus, kafkaStart, kafkaStop} from '../services/ddm-kafka'
import {connectorStatus, connectorStart, connectorStop} from '../services/ddm-connector'
import {distributionStatus, distributionStart, distributionStop, distributionPause, distributionResume} from '../services/ddm-distribution'
import {instanceList, instanceAdd, instanceRemove} from '../services/ddm-instance'
import {policyList, policyAdd, policyRemove} from '../services/ddm-policy'
import {sinkList, sinkAdd, sinkRemove} from '../services/ddm-sink'


const FormItem = Form.Item;
const {Option } = Select;

@Form.create()
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
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
    };
  }



  //render前执行
  componentWillMount() {
    this.loadConnectorStatus();
    this.loadDistributionStatus();
    this.loadInstanceList();
    this.loadPolicyList();
    this.loadSinkList();
  }

  componentDidMount(){

  }

  loadConnectorStatus = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({loading: true,});
    connectorStatus(reqParam, (response) => {
      if (response != undefined && response != null) {
        let tmpObj = this.state.connectorObj;
        tmpObj.isStarted = response.data;
        this.setState({
          connectorObj: tmpObj
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }

  loadDistributionStatus = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({loading: true,});
    distributionStatus(reqParam, (response) => {
      if (response != undefined && response != null) {
        let tmpObj = this.state.distributionObj;
        tmpObj.isStarted = response.data.started;
        tmpObj.active = response.data.active;
        this.setState({
          distributionObj: tmpObj
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }

  loadInstanceList = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({loading: true,});
    instanceList(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          instanceList: response.data
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }  

  loadPolicyList = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({loading: true,});
    policyList(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          policyList: response.data
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }    

  loadSinkList = () => {
    const reqParam = {};
    // 加载状态=>加载中
    this.setState({loading: true,});
    sinkList(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          sinkList: response.data
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }

  render() {
    let connectorBadge = this.state.connectorObj.isStarted ? <Badge status="success" text="运行中"/> : <Badge status="default" text="未启动"/>;
    let distributionBadge = this.state.distributionObj.isStarted ? <Badge status="success" text="运行中"/> : <Badge status="default" text="未启动"/>;
    let sinkBadge = <Badge status="success" text="运行中"/>;

    let instanceContent = <Empty></Empty>;
    if (this.state.instanceList.length > 0) {
      instanceContent = <List
        itemLayout="horizontal"
        dataSource={this.state.instanceList}
        renderItem={item => {
            let itemAvatar = '';
            if (item.databaseItem == 'oracle') {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#f50' }}>ora</Avatar>;
            } else if (item.databaseItem == 'postgres') {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#2db7f5' }}>pg</Avatar>;
            } else if (item.databaseItem == 'mysql') {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#87d068' }}>mysql</Avatar>;
            } else {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#000' }}>unknown</Avatar>;
            }
            return <List.Item actions={[<a key="">详情</a>]}>
              <List.Item.Meta
                avatar={itemAvatar}
                title={item.instanceId}
                description={<span><span>{`${item.databaseHost}:${item.databasePort}`}</span></span>}
              />
            </List.Item>
          }
        }
      />;
    }

    let policyContent = <Empty></Empty>;
    if (this.state.policyList.length > 0) {
      policyContent = <List
        itemLayout="horizontal"
        dataSource={this.state.policyList}
        renderItem={item => {
            let itemAvatar = '';
            if (item.shareMode == 1) {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#f50' }}>共享</Avatar>;
            } else if (item.shareMode == 0) {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#2db7f5' }}>独享</Avatar>;
            }
            return <List.Item actions={[<a key="">详情</a>]}>
              <List.Item.Meta
                avatar={itemAvatar}
                title={item.policyId}
                description={<span><span>{`${item.opStr}`}</span></span>}
              />
            </List.Item>
          }
        }
      />;
    }    

    let sinkContent = <Empty></Empty>;
    if (this.state.sinkList.length > 0) {
      sinkContent = <List
        itemLayout="horizontal"
        dataSource={this.state.sinkList}
        renderItem={item => {
            let itemAvatar = '';
            if (item.sinkItem == 'kafka') {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#f50' }}>kafka</Avatar>;
            } else if (item.sinkItem == 'elasticsearch') {
              itemAvatar = <Avatar style={{ color: '#fff', backgroundColor: '#2db7f5' }}>elasticsearch</Avatar>;
            }
            return <List.Item actions={[<a key="">详情</a>]}>
              <List.Item.Meta
                avatar={itemAvatar}
                title={item.sinkId}
                description={<span><span>{`${item.bootstrapServer}`}</span></span>}
              />
            </List.Item>
          }
        }
      />;
    }        

    return (
    <PageHeaderWrapper title={''}>
      <div style={{fontSize:'20px',color:'blue', marginTop:'20px'}}>
        <Spin spinning={this.state.loading}>
          <Row>
            <Col span={12}>
              <Card title="分发处理器" extra={distributionBadge} style={{width: '90%' }}>
                {policyContent}
              </Card>
            </Col>
            <Col span={12}>
              <Row>
                  <Card title="数据源实例" extra={connectorBadge} style={{width: '90%' }}>
                    {instanceContent}
                  </Card>
              </Row>
              <div style={{height: '30px'}}></div>
              <Row>
                  <Card title="输出源实例" extra={sinkBadge} style={{width: '90%' }}>
                    {sinkContent}
                  </Card>                 
              </Row>              
            </Col>            
          </Row>
        </Spin> 
      </div>  
    </PageHeaderWrapper>
    );
  }
}
