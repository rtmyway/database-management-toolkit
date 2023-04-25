import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Collapse, Descriptions, Badge, Icon, Modal, Card, List} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from '../DemoGlobal.less';
import DemoGlobalConstants from '../DemoGlobalConstants';

const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
const { Panel } = Collapse;
@Form.create()
export default class DemoBizcacheMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      nodes: [
        {serviceCode: 'fw-platform-app', id: '1001', url: 'http://192.168.2.148:8080'},
        {serviceCode: 'fw-platform-app', id: '1002', url: 'http://192.168.2.149:8080'},
        {serviceCode: 'prj-mstdata-app', id: '2001', url: 'http://192.168.2.151:8080'},
        {serviceCode: 'prj-mstdata-app', id: '2002', url: 'http://192.168.2.152:8080'},
        {serviceCode: 'prj-bommgmt-app', id: '3001', url: 'http://192.168.2.163:8080'},
        {serviceCode: 'prj-bommgmt-app', id: '3002', url: 'http://192.168.2.164:8080'},
      ],

      policies: [
        {serviceCode: 'fw-platform-app', tableName: 'CORE.TS_ACCT_USER', columnList: ['id', 'name','type'],
          isActive: true, isInit: true, isRefresh: true, refreshMode: 'INTERVAL', intervalSecond: 300,
          fetchSql: 'select * from CORE.TS_ACCT_USER', fetchPageSize: 100000, storageMode: 'MEMORY'},
        {serviceCode: 'fw-platform-app', tableName: 'CORE.TS_CODE_TYPE', columnList: ['id', 'code','text'],
          isActive: false, isInit: true, isRefresh: true, refreshMode: 'NOTIFICATION', intervalSecond: 300,
          fetchSql: 'select * from CORE.TS_CODE_TYPE', fetchPageSize: 100000, storageMode: 'ROCKSDB'},     
        {serviceCode: 'fw-platform-app', tableName: 'CORE.TS_CODE_ITEM', columnList: ['id', 'code','text'],
          isActive: false, isInit: true, isRefresh: true, refreshMode: 'HIBRID', intervalSecond: 300,
          fetchSql: 'select * from CORE.TS_CODE_TYPE', fetchPageSize: 100000, storageMode: 'ROCKSDB'},                   

        {serviceCode: 'prj-mstdata-app', tableName: 'MSTDATA.MD_MATERIAL', columnList: [],
          isActive: false, isInit: true, isRefresh: true, refreshMode: 'NOTIFICATION', intervalSecond: 300,
          fetchSql: 'select * from MSTDATA.MD_MATERIAL', fetchPageSize: 100000, storageMode: 'MEMORY'},

        {serviceCode: 'prj-bommgmt-app', tableName: 'BOMMGMT.BM_COMPONENT', columnList: [],
          isActive: true, isInit: true, isRefresh: true, refreshMode: 'NOTIFICATION', intervalSecond: 300,
          fetchSql: 'select * from BOMMGMT.BM_COMPONENT', fetchPageSize: 100000, storageMode: 'MEMORY'},                     
      ],

      cacheStatus: [
        {nodeId: '1001', startTime: '2023-03-31 14:20:33', 
          cacheInfo: {initSize: 7190, currentSize: 10390},
          freshCnt: 39,
          lastFreshInfo: {mode: 'INTERVAL', time: '2023-03-31 16:12:45', cnt: 25},
        },
        {nodeId: '1002', startTime: '2023-03-31 14:22:39', 
          cacheInfo: {initSize: 7385, currentSize: 10390},
          freshCnt: 37,
          lastFreshInfo: {mode: 'INTERVAL', time: '2023-03-31 16:12:45', cnt: 25},
        }        
      ],


      data : [

      ],              
    };
  }

  //render前执行
  componentWillMount() {
    
  }

  componentDidMount(){

  }

   

 


  render() {
    let serviceCodeArr = this.state.policies.map((item) => {return item.serviceCode}).reduce((prev, cur) => prev.includes(cur) ? prev : [...prev, cur], []);

    // 每个微服务一个card
    let serviceDom = serviceCodeArr.map((item) => {
      let currentPolicyArray = this.state.policies.filter((subItem) => {return subItem.serviceCode == item});
      // let policyDom = currentPolicyArray.map((policyItem) => {
      let policyDom =  <List
          itemLayout="horizontal"
          dataSource={currentPolicyArray}
          renderItem={policyItem => {
            let freshModeTag = '';
            if (policyItem.refreshMode == 'INTERVAL') {
              freshModeTag = <Tag color='blue'>{'定时刷新'}</Tag>;
            } else if (policyItem.refreshMode == 'NOTIFICATION'){
              freshModeTag = <Tag color='blue'>{'消息刷新'}</Tag>;
            } else if (policyItem.refreshMode == 'HIBRID') {
              freshModeTag = <Tag color='blue'>{'混合刷新'}</Tag>;
            }

            let storageModeTag = <Tag color='green'>{policyItem.storageMode}</Tag>;
            let controlIcon = policyItem.isActive ? <Icon type="pause-circle"/> : <Icon type="play-circle"/>;
 

            return <List.Item actions={[
              <a key="list-loadmore-eye"><Icon type="eye" style={{color:'grey'}}/></a>,
              <a key="list-loadmore-play">{controlIcon}</a>,
              <a key="list-loadmore-edit"><Icon type="edit"/></a>,
              <a key="list-loadmore-close"><Icon type="close" style={{color:'red'}}/></a>
            ]}>
              <List.Item.Meta
                title={<p>
                        <span><Icon type="table" /></span><span style={{marginLeft:'10px', marginRight: '20px'}}>{policyItem.tableName}</span>
                        {freshModeTag}{storageModeTag}

                        </p>}
                // description={<p>{freschModeTag}{storageModeTag}</p>}
              />
            </List.Item>
          }}
        />

      return <Card title={<Row>
                            <Col span={12}><span><Icon type="cloud-server" /></span><span style={{marginLeft:'10px', fontWeight:'bold'}}>{item}</span></Col>
                            <Col offset={11} span={1}><a><Icon type="plus"/></a></Col>
                            {/* <Col span={1}><a><Icon type="close" style={{color:'red'}}/></a></Col> */}
                          </Row>} style={{ marginTop: 20}}>
        {policyDom}
      </Card>;
    });

    let statusDom = <Collapse bordered={false} style={{ marginTop: 20}}>
      <Panel header="http://192.168.0.1:8080" key="1">
        <Descriptions title="" size={'small'} column={1} bordered>
          <Descriptions.Item label="缓存对象">{'CORE.TS_ACCT_USER'}</Descriptions.Item>
          <Descriptions.Item label="运行状态"><Badge status="processing" text="运行中" /></Descriptions.Item>          
          <Descriptions.Item label="首次加载时间">{'2023-04-15 18:54'}</Descriptions.Item>
          <Descriptions.Item label="刷新总次数"><a>{87}</a></Descriptions.Item>
        </Descriptions>        
      </Panel>
      <Panel header="http://192.168.0.2:8080" key="2">
        <Descriptions title="" size={'small'} column={1} bordered>
          <Descriptions.Item label="缓存对象">{'CORE.TS_ACCT_USER'}</Descriptions.Item>
          <Descriptions.Item label="运行状态"><Badge status="processing" text="运行中" /></Descriptions.Item>          
          <Descriptions.Item label="首次加载时间">{'2023-04-15 18:54'}</Descriptions.Item>
          <Descriptions.Item label="刷新总次数"><a>{87}</a></Descriptions.Item>
        </Descriptions>   
      </Panel>
      <Panel header="http://192.168.0.4:8080" key="3">
        <Descriptions title="" size={'small'} column={1} bordered>
          <Descriptions.Item label="缓存对象">{'CORE.TS_ACCT_USER'}</Descriptions.Item>
          <Descriptions.Item label="运行状态"><Badge status="processing" text="运行中" /></Descriptions.Item>          
          <Descriptions.Item label="首次加载时间">{'2023-04-15 18:54'}</Descriptions.Item>
          <Descriptions.Item label="刷新总次数"><a>{87}</a></Descriptions.Item>
        </Descriptions>   
      </Panel>
    </Collapse>;

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <Row>
        <Col span={12}>{serviceDom}</Col>
        <Col offset={1} span={11}>{statusDom}</Col>
      </Row>
        
    </PageHeaderWrapper>
    );
  }
}





