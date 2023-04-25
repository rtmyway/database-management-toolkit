import React, {Component } from 'react';
import {Form, Tag, Row, Col,Spin, Drawer, Button, Radio, Card, message, Collapse, Empty} from 'antd';
import copy from 'copy-to-clipboard';
import {sinkOutputList} from '../../../../services/ddm-sink'
import styles from './index.less';
const FormItem = Form.Item;
const { Panel } = Collapse;

export default class DdmSinkOutputDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      sink: {internal: 0, instanceNameList: [], policyNameList: []},
      outputList: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      // 设置sink
      this.setState({sink: viewObj.data});
      // 加载状态=>加载中
      this.setState({loading: true,});
  
      sinkOutputList(viewObj.data, (response) => {
        if (response != undefined && response != null) {
          let list = response.data;
          this.setState({
            outputList: list
          });
        }
        // 加载状态=>完成
        this.setState({loading: false,});
      });
    }
  }


  generateInternalSinkDom = () => {
    // 后端返回的topic列表    
    let outputList = this.state.outputList;

    // 数据源生成的topic
    let instanceContentList = this.state.sink.instanceNameList.map((item) => {
        return {
          instanceName: item,
          tableList: [], // 业务表信息
          cdcList: [], // 同步信息
        }
    });

    // 历史数据源topic
    let historyInstanceContentList = [];

    // 分发策略生成的topic
    let policyContentList = [];

    // 其他topic
    let otherContentList = [];


    // 匹配运行中数据源生成的topic
    for (let i = 0; i < outputList.length; i++) {
      let isMatch = false;
      for (let m = 0; m < instanceContentList.length; m++) {
        let tmpName = instanceContentList[m].instanceName;
        // 有效cdc信息
        if (outputList[i] == tmpName 
          || outputList[i] == ('schema-changes.' + tmpName)
          || outputList[i] == ('heartbeat.' + tmpName)) {
          instanceContentList[m].cdcList.push(outputList[i]);
          isMatch = true;
          continue;
        }

        // 有效table信息
        if (outputList[i].startsWith(tmpName + '.')) {
          instanceContentList[m].tableList.push(outputList[i]);
          isMatch = true;
          continue;
        }
      }
      if (isMatch) {
        continue;
      }


      // 历史数据源生成的topic
      let regTable = /^ddm-(oracle|postgres|mysql)-(.+)$/g;
      let regCdc = /^(heartbeat|schema-changes).ddm-(oracle|postgres|mysql)-(.+)$/g;
      if (regTable.test(outputList[i]) || regCdc.test(outputList[i])) {
        historyInstanceContentList.push(outputList[i]);
        isMatch = true;
        continue;
      }

      // 匹配分发策略生成的topic
      if (this.state.sink.policyNameList.includes(outputList[i])) {
        policyContentList.push(outputList[i]);
        continue;
      }

      // 其他topic
      otherContentList.push(outputList[i]);
    }
    
    // 组装展示DOM
    let internalSinkDom = <Collapse defaultActiveKey={['1']}>
  
      <Panel header={<span style={{fontWeight: 'bold', color: '#108ee9'}}>{'数据源topic'}</span>} key="1">
        {instanceContentList.filter((item) => {
          return item.cdcList.length > 0 || item.tableList.length > 0;
        }).map((item) => {
          return <Card style={{marginTop: '10px'}} 
                  title={<span style={{fontWeight: 'bold', color: 'grey'}}>{`${item.instanceName}(${item.tableList.length})`}</span>} 
                  extra={<a onClick={()=>{copy(item.tableList.join(','));}} >复制</a>}
                  key={item.instanceName}
                  size="small" >
            {item.cdcList.map((cdcItem) => {
              return <Tag color='red' key={cdcItem}>{cdcItem}</Tag>;
            })}

            {item.tableList.map((tableItem) => {
              return <Tag style={{marginTop: '10px'}} key={tableItem}>{tableItem}</Tag>;
            })}            
          </Card>
        })}

        {
          <Card style={{marginTop: '10px'}} title={<span style={{fontWeight: 'bold', color: 'grey'}}>{'非活跃'}</span>} key={'history'} size="small" >
            {
              historyInstanceContentList.map((item) => {
                return <Tag style={{marginTop: '10px'}} key={item}>{item}</Tag>;
              })
            }
          </Card>
        }
      </Panel>   

      <Panel header={<span style={{fontWeight: 'bold', color: '#108ee9'}}>{`分发策略topic(${policyContentList.length})`}</span>} key="2">
        {policyContentList.map((item) => {
          return <Tag style={{marginTop: '10px'}} key={item}>{item}</Tag>;
        })}
      </Panel>         

      <Panel header={<span style={{fontWeight: 'bold', color: '#108ee9'}}>{`其他topic(${otherContentList.length})`}</span>} key="4">
        {otherContentList.map((item) => {
          return <Tag style={{marginTop: '10px'}} key={item}>{item}</Tag>;
        })}
      </Panel>        
    </Collapse>;

    return internalSinkDom;

  }

  generateExternalSinkDom = () => {
    // 后端返回的topic列表    
    let outputList = this.state.outputList;


    // 分发策略生成的topic
    let policyContentList = [];

    // 其他topic
    let otherContentList = [];

    for (let i = 0; i < outputList.length; i++) {
      // 匹配分发策略生成的topic
      if (this.state.sink.policyNameList.includes(outputList[i])) {
        policyContentList.push(outputList[i]);
      } else {
        otherContentList.push(outputList[i]);
      }
    }

    // 组装展示DOM
    
    let externalSinkDom = <Collapse defaultActiveKey={['1']}>
      <Panel header={<span style={{fontWeight: 'bold', color: '#108ee9'}}>{`分发策略(${policyContentList.length})`}</span>} key="1">
        {policyContentList.map((item) => {
          return <Tag style={{marginTop: '10px'}} key={item}>{item}</Tag>;
        })}
      </Panel>         

      <Panel header={<span style={{fontWeight: 'bold', color: '#108ee9'}}>{`其他(${otherContentList.length})`}</span>} key="2">
        {otherContentList.map((item) => {
          return <Tag style={{marginTop: '10px'}} key={item}>{item}</Tag>;
        })}
      </Panel>        
    </Collapse>;
    return externalSinkDom;    
  }



  render() {
    let sinkDom = <Empty></Empty>;
    if (this.state.sink.internal == 1) {
      sinkDom = this.generateInternalSinkDom();
    } else {
      sinkDom = this.generateExternalSinkDom();
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
          <Spin spinning={this.state.loading}>
            <div>{sinkDom}</div>
          </Spin>
        </Drawer>
      </div>
    );
  }
}
