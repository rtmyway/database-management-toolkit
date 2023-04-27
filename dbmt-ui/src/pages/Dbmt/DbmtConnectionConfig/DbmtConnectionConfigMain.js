import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ViewCommon from '../../../commons/ViewCommon'
import {add, update, remove, list} from '../../../services/dbmt-connection-config'

import DbmtConnectionConfigAddDrawer from './DbmtConnectionConfigAddDrawer';
import DbmtConnectionConfigUpdateDrawer from './DbmtConnectionConfigUpdateDrawer';

import styles from '../DbmtGlobal.less';


const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DbmtConnectionConfigMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],
      views: ViewCommon.createViews([
        {key: 'ADD', title: '新增', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
        {key: 'UPDATE', title: '修改', visible: false, changeable: true, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
        {key: 'REMOVE', title: '删除', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
      ]),          
    };
  }

  //render前执行
  componentWillMount() {
    this.doConnectionConfigList();
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

    tmpViews[index].changeable = false;
    tmpViews[index].spinning = true;
    this.setState({ views: tmpViews});
    const reqParam = {...data};
    // 新增
    if (viewKey == 'ADD') {
      add(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`已创建`);   
            that.doConnectionConfigList();

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
    } else if (viewKey == 'UPDATE') {
      update(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`已更新`);   
            that.doConnectionConfigList();

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

  /*发起查询*/
  doConnectionConfigList = () => {
    const reqParam = {
    };
    // 加载状态=>加载中
    this.setState({loading: true,});
    
    list(reqParam, (response) => {
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

  /*发起删除*/
  doConnectionConfigRemove = (config) => {
    let that = this;
    confirm({
      title: `确定要删除 【${config.connectionName}】 吗?`,
      content: '删除后无法恢复,请谨慎操作',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const reqParam = {
          id: config.id,
        };
        // 加载状态=>完成
        that.setState({ loading: true, });
        remove(reqParam, (response) => {
          if (response != undefined && response != null) {
            setTimeout(function () {
              message.success(`${config.connectionName} 已删除`);   
              that.doConnectionConfigList();
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
        key : 1,
        title: '编号',
        dataIndex: 'serialNo',
      },{
        key : 2,
        title: '数据库类型',
        render: (text, row, index) => {
          return <Tag color={'blue'}>{row.databaseItem}</Tag>
        },
      },{
        key : 3,
        title: '环境',
        render: (text, row, index) => {
          let envStr = '';
          if (row.env == 'PROD') {
            envStr = '正式';
          } else if (row.env == 'DEV') {
            envStr = '临时';
          }
          return <Tag color={'blue'}>{envStr}</Tag>
        },
      },{
        key : 4,
        title: '连接名',
        render: (text, row, index) => {
          return <div>{row.connectionName}</div>
        },
      },{
        key : 5,
        title: '连接信息',
        render: (text, row, index) => {
          let dbDom = '';
          if (row.databaseItem == "POSTGRES") {
            dbDom = <div>
              <p>{`地址：${row.host}:${row.port}`}</p>
              <p>{`数据库名：${row.databaseName}`}</p>
              <p>{`用户名/密码：${row.userName}/${row.password}`}</p>
            </div>;
          }
          return <div>{dbDom}</div>;          
        },
      },{
        key : 9,
        title: '操作',
        render: (text, row, index) => {
          return <div>
            <a style={{fontWeight:'bold', marginLeft: '0px'}} onClick={()=>{this.onSubViewVisibleHandler('ADD', true, row);}}>{'克隆'}</a>            
            <a style={{fontWeight:'bold', marginLeft: '20px'}} onClick={()=>{this.onSubViewVisibleHandler('UPDATE', true, row);}}>{'修改'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px', color: 'red'}} onClick={()=>{this.doConnectionConfigRemove(row);}}>{'删除'}</a>
          </div>
        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form  onSubmit={this.doConnectionConfigList} layout="inline">
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
                dataSource={this.state.data}
                columns={columns}
                pagination={false}
              />
            </Col>
          </Row>
          <div>
            <DbmtConnectionConfigAddDrawer destroyOnClose={true} viewObj={this.state.views[0]}/>
            <DbmtConnectionConfigUpdateDrawer destroyOnClose={true} viewObj={this.state.views[1]}/>
          </div>               
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}




