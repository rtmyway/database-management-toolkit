import React, {Component } from 'react';
import {Form, Descriptions, Alert,Row, Col,Spin, Drawer, Button} from 'antd';
import { checkEnvironment } from '../../../../services/ddm-database'
const FormItem = Form.Item;

export default class DdmDbCheckDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      spinning: false,
      checkResult: null, 
      dbInfo: {
        databaseItem: 'postgres',
        databaseHost: '',
        databasePort: '',
        databaseUser: '',
        databasePassword: '',
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    let viewObj = nextProps.viewObj;
    let tmpDbInfo = {...viewObj.data};


    this.setState({
      visible: viewObj.visible,
      dbInfo: tmpDbInfo,
      checkResult: null,
    });
  }

  onCheckHandler = (e) => {
    let dbInfo = this.state.dbInfo;
    let reqParam = {
      databaseItem: dbInfo.databaseItem,
      url: '',
      userName: dbInfo.databaseUser,
      password: dbInfo.databasePassword,
    };
    if (dbInfo.databaseItem == 'oracle') {
      reqParam.url = `jdbc:oracle:thin:@${dbInfo.databaseHost}:${dbInfo.databasePort}/${dbInfo.databasePdbName}`;
    } else if (dbInfo.databaseItem == 'postgres') {
      reqParam.url = `jdbc:postgresql://${dbInfo.databaseHost}:${dbInfo.databasePort}/${dbInfo.databaseDbName}`;
    }

    this.setState({spinning: true, checkResult: null});
    checkEnvironment(reqParam, (response) => {
      if (response != undefined) {
        this.setState({ checkResult: response.data });
      }
      this.setState({spinning: false});
    });
  }  

  render() {
    let dbInfo = this.state.dbInfo;
    let dbName = '';
    if (dbInfo.databaseItem == 'oracle') {
      dbName = dbInfo.databasePdbName;
    } else if (dbInfo.databaseItem == 'postgres') {
      dbName = dbInfo.databaseDbName;
    }


    let checkResultDom = '';
    let checkResult = this.state.checkResult;
    let connectionDom = '';
    let checkItemDomList = '';
    if (checkResult != null) {
        connectionDom = <Alert
          key={'d1'}
          message={`数据库连接${checkResult.connectionAvailable ? '成功' : '失败'}`}
          type={checkResult.connectionAvailable ? 'success' : 'error'}
          showIcon
        />
      if (checkResult.connectionAvailable) {
        if (dbInfo.databaseItem == 'oracle') {
          checkItemDomList = checkResult.checkItemDtoList.map((item) => {
            if (item.checkItemCode == 'ORACLE_LOG_MODE'
              || item.checkItemCode == 'SUPPLEMENTAL_LOG_DATA'
              || item.checkItemCode == 'DDM_USER_PRIVILEGE') {
              let tmpContent = item.resultList.map((item) => {
                return item.join(',');
              }).join('|');
              return <p key={item.checkItemCode}><span style={{fontWeight: 'bold'}}>{item.checkItemText}</span>{`: ${tmpContent}`}</p>;
            }
          });          

        } else if (dbInfo.databaseItem == 'postgres') {
          checkItemDomList = checkResult.checkItemDtoList.map((item) => {
            if (item.checkItemCode == 'POSTGRES_WAL_LEVEL'
              || item.checkItemCode == 'POSTGRES_DECODE_PLUGIN'
              || item.checkItemCode == 'ROLE_CAN_LOGIN'
              || item.checkItemCode == 'ROLE_CAN_REPLICATION'
              || item.checkItemCode == 'REPLICATION_SLOTS_MAX'
              || item.checkItemCode == 'ROLE_USAGE_SCHEMA') {
              let tmpContent = item.resultList.map((item) => {
                return item.join(',');
              }).join('|');
              return <p key={item.checkItemCode}><span style={{fontWeight: 'bold'}}>{item.checkItemText}</span>{`: ${tmpContent}`}</p>;
            } else if (item.checkItemCode == 'REPLICATION_SLOTS_USED_INFO') {
              return <p key={item.checkItemCode}><span style={{fontWeight: 'bold'}}>{'复制槽已使用数量'}</span>{`: ${item.resultList.length}`}</p>;
            }
          });
        }
      }
      
      checkResultDom = <div>
        {connectionDom}
        <Alert
          style={{marginTop: '20px'}}
          key={'d2'}
          message={'检测项'}
          description={checkItemDomList}
          type={'info'}
          showIcon
        />
      </div>;
    } else {
      checkResultDom = <div></div>;
    }


    return (

        <Drawer
          title={'环境检测'}
          placement={'right'}
          width={600}
          maskClosable={true}
          mask={true}
          onClose={() => this.props.viewObj.onDbCheckVisibleHandler(false)}
          visible={this.state.visible}>
            <Spin spinning={this.state.spinning}>
              <Row style={{ marginLeft: '20px' }} gutter={24}>
                <Descriptions column={1} size={'small'} title="数据库信息" bordered>
                    <Descriptions.Item label="类型">{this.state.dbInfo.databaseItem}</Descriptions.Item>
                    <Descriptions.Item label="主机:端口号">{`${this.state.dbInfo.databaseHost}:${this.state.dbInfo.databasePort}`}</Descriptions.Item>
                    <Descriptions.Item label="数据库名">{dbName}</Descriptions.Item>
                    <Descriptions.Item label="用户名">{this.state.dbInfo.databaseUser}</Descriptions.Item>
                    <Descriptions.Item label="密码">{this.state.dbInfo.databasePassword}</Descriptions.Item>
                  </Descriptions>
              </Row>
              <Row style={{ marginLeft: '10px', marginTop: '20px' }} gutter={24}>
                <Col span={2} className='ant-col-offset-0'>
                  <Button style={{ marginLeft: '0px' }} type="primary" onClick={this.onCheckHandler}>开始检查</Button>
                </Col>
              </Row>
              <Row style={{ marginLeft: '10px', marginTop: '20px' }} gutter={24}>
                  {checkResultDom}
              </Row>              
          </Spin>
        </Drawer>
    );
  }
}
