import React, {Component } from 'react';
import {Form, Alert,Tag, Row, Col,Spin, Drawer, Button, Radio, Checkbox, message} from 'antd';
import serverConfig from '../../../../configs/ServerConfig';
import styles from './index.less';
import InfiniteScroll from 'react-infinite-scroller';
import moment from 'moment';
const FormItem = Form.Item;

export default class DdmLogDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLog: null,
      logList: [],
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    if (viewObj.visible && viewObj.changeable) {
      let url = serverConfig.wsServer.host + '/' + new Date().getTime();
      console.info(url);
      let websocket  = new WebSocket(url);
      //打开事件
      websocket.onopen = function () {
        console.log("websocket已打开");
      }
      //发现消息进入
      let that = this;
      websocket.onmessage = function (msg) {
        let tmpData = JSON.parse(msg.data);
        let logList = that.state.logList;
        tmpData.key = logList.length + 1;
        logList.push(tmpData);
        that.setState({
          currentLog: tmpData,
          logList: logList
        });
      }
      //关闭事件
      websocket.onclose = function() {
        console.log("websocket已关闭");
      };
      //发生了错误事件
      websocket.onerror = function() {
        console.log("websocket发生了错误");
      }
    }
  }


  getSingleLogDom = (obj) => {
    if (obj == null) {
      return '';
    }
    // let timeStr = moment(new Date()).format('MM月DD日 HH:mm:ss')
    let timeStr = moment(obj.timestamp).format('HH:mm:ss');

    let contentStr = '';
    if (obj.logItem == 'instance') {
      contentStr = `【连接器】${obj.itemId}, 从${obj.tableName}, 同步了${obj.cnt}条记录.`;
    } else if (obj.logItem == 'policy') {
      contentStr = `【策略】${obj.itemId}, 分发了${obj.cnt}条记录.`;
    }
    return <p key={obj.key}>
      <span style={{display:'inline-block', width:'70px'}}>{timeStr}</span>
      <span style={{display:'inline-block', width: '600px'}}>{contentStr}</span>
    </p>
  }




  render() {
    let outputDom = this.state.logList.map((item)=>{
      return this.getSingleLogDom(item);
    });

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
          {/* <Alert style={{ marginBottom: '30px' }} message="分发日志"
            description={''} /> */}

            <InfiniteScroll
              loadMore={(obj) => {}}
              useWindow={false}>
                {outputDom} 
            </InfiniteScroll>
        </Drawer>
      </div>
    );
  }
}
