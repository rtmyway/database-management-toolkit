import React, { Component } from 'react';
import { Row, Col, Form, Tag, Select, Button, Table, Popover, List, Descriptions, Modal, message } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ViewCommon from '../../../commons/ViewCommon'
import moment from 'moment';
import copy from 'copy-to-clipboard';
import { add, update, remove, listPage } from '../../../services/dbmt-connection-config'
import backupService from '../../../services/dbmt-backup'
import restoreService from '../../../services/dbmt-restore'

import DbmtConnectionConfigAddDrawer from './DbmtConnectionConfigAddDrawer';
import DbmtConnectionConfigUpdateDrawer from './DbmtConnectionConfigUpdateDrawer';

import styles from '../DbmtGlobal.less';


const FormItem = Form.Item;
const { Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DbmtConnectionConfigMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      backupLogList: [],
      restoreLogList: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 5,
      },
      views: ViewCommon.createViews([
        { key: 'ADD', title: '新增', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler },
        { key: 'UPDATE', title: '修改', visible: false, changeable: true, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler },
        { key: 'REMOVE', title: '删除', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler },
      ]),
    };
  }

  //render前执行
  componentWillMount() {
    this.doListPage(1, this.state.pagination.pageSize);
  }

  componentDidMount() {

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
        this.setState({ views: tmpViews });
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
    this.setState({ views: tmpViews });
    const reqParam = { ...data };
    // 新增
    if (viewKey == 'ADD') {
      add(reqParam, (response) => {
        if (response != undefined && response != null) {
          let that = this;
          setTimeout(function () {
            message.success(`已创建`);
            that.doListPage(1, that.state.pagination.pageSize);

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
            that.doListPage(1, that.state.pagination.pageSize);

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
  doListPage = (current, pageSize) => {
    const reqParam = {
      pageNum: current,
      pageSize: pageSize,
    };
    // 加载状态=>加载中
    this.setState({ loading: true, });

    // 开始请求,真实环境请移除setTimeout
    let that = this;
    let pageObj = that.state.pagination;
    listPage(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.data.list;
        for (let i = 0; i < list.length; i++) {
          list[i].key = list[i].id;
          list[i].serialNo = (pageObj.current - 1) * (pageObj.pageSize) + i + 1;
        }
        pageObj.total = response.data.total;
        that.setState({
          data: list,
          pagination: pageObj,
        });
      }
      // 加载状态=>完成
      that.setState({ loading: false, });
    });
  }


  /*发起删除*/
  doRemove = (config) => {
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
              that.doListPage(1, that.state.pagination.pageSize);
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

  // 加载备份记录
  loadBackupLogList = (sourceConnectionId) => {
    const reqParam = {
      pageNum: 1,
      pageSize: 10,
      params: {
        sourceConnectionId: sourceConnectionId,
      }
    };
    // 加载状态=>加载中
    this.setState({ loading: true, });
    backupService.listPage(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          backupLogList: response.data.list,
        });
      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }

  // 加载恢复记录
  loadRestoreLogList = (targetConnectionId) => {
    const reqParam = {
      pageNum: 1,
      pageSize: 10,
      params: {
        targetConnectionId: targetConnectionId,
      }
    };
    // 加载状态=>加载中
    this.setState({ loading: true, });
    restoreService.listPage(reqParam, (response) => {
      if (response != undefined && response != null) {
        this.setState({
          restoreLogList: response.data.list,
        });
      }
      // 加载状态=>完成
      this.setState({ loading: false, });
    });
  }  

  // 立即执行备份
  addBackup = (connectionObj) => {
    let that = this;
    confirm({
      title: `确定要立即备份 【${connectionObj.connectionName}】 吗?`,
      content: '',
      okText: '备份',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const reqParam = {
          sourceConnectionId: connectionObj.id,
        };
        // 加载状态=>完成
        that.setState({ loading: true, });
        backupService.add(reqParam, (response) => {
          if (response != undefined && response != null) {
            message.info("备份已开始,请耐心等待")
          }
          // 加载状态=>完成
          that.setState({ loading: false, });
        });

      },
      onCancel() {

      },
    });
  }

  // 终止备份
  cancelBackup = (backupLogObj) => {
    let that = this;
    confirm({
      title: `确定终止备份任务吗?`,
      content: '',
      okText: '终止',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // const reqParam = {
        //   backupLogId: backupLogObj.id,
        // };
        // // 加载状态=>完成
        // that.setState({ loading: true, });
        // restoreService.add(reqParam, (response) => {
        //   if (response != undefined && response != null) {
        //     message.info("恢复已开始,请耐心等待")
        //   }
        //   // 加载状态=>完成
        //   that.setState({ loading: false, });
        // });

      },
      onCancel() {

      },
    });
  }  

  // 删除备份
  removeBackup = (backupLogObj) => {
    let that = this;
    confirm({
      title: `确定删除备份 【${backupLogObj.backupFileName}】吗?`,
      content: '',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        // const reqParam = {
        //   backupLogId: backupLogObj.id,
        // };
        // // 加载状态=>完成
        // that.setState({ loading: true, });
        // restoreService.add(reqParam, (response) => {
        //   if (response != undefined && response != null) {
        //     message.info("恢复已开始,请耐心等待")
        //   }
        //   // 加载状态=>完成
        //   that.setState({ loading: false, });
        // });

      },
      onCancel() {

      },
    });
  }    



  // 立即执行恢复
  addRestore = (backupLogObj) => {
    let that = this;
    confirm({
      title: `确定使用 【${backupLogObj.backupFileName}】进行恢复吗?`,
      content: '',
      okText: '恢复',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        const reqParam = {
          backupLogId: backupLogObj.id,
        };
        // 加载状态=>完成
        that.setState({ loading: true, });
        restoreService.add(reqParam, (response) => {
          if (response != undefined && response != null) {
            message.info("恢复已开始,请耐心等待")
          }
          // 加载状态=>完成
          that.setState({ loading: false, });
        });

      },
      onCancel() {

      },
    });
  }  



  //分页事件触发
  pageChangeHandler = (pagination, filtersArg, sorter) => {
    let pageObj = this.state.pagination;
    pageObj.current = pagination.current;
    pageObj.pageSize = pagination.pageSize;
    this.setState({ pagination: pageObj, });
    this.doListPage(pagination.current, pagination.pageSize);
  }

  //查询单击事件
  pageSearchHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        loading: false,
        data: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10,
        },
      }, () => { this.doListPage(1, this.state.pagination.pageSize); });
    });
  }



  render() {
    let backupLogDom = <List
      itemLayout="horizontal"
      dataSource={this.state.backupLogList}
      renderItem={item => {
        let dateStr = moment(item.createdAt).format('YYYY-MM-DD HH:mm:SS');

        let backupOpDom = <div>
          <a style={{ textDecoration: 'underline' }} key={'a-' + item.id} onClick={() => { copy(item.id); message.info('已复制版本号')}}>{'版本号'}</a>
          <a style={{ textDecoration: 'underline', marginLeft: '20px', color: 'red' }} key={'b-' + item.id} onClick={() => { this.cancelBackup(item); }}>{'取消'}</a>
          <a style={{ textDecoration: 'underline', marginLeft: '20px', color: 'red' }} key={'b-' + item.id} onClick={() => { this.removeBackup(item); }}>{'删除'}</a>
          <a style={{ textDecoration: 'underline', marginLeft: '20px', color: 'red' }} key={'b-' + item.id} onClick={() => { this.addRestore(item); }}>{'恢复'}</a>
        </div>

        let backupItemDom = <Descriptions bordered title={''} size={'small'} column={5}>
          <Descriptions.Item label="备份时间">{dateStr}</Descriptions.Item>

          <Descriptions.Item label="文件名">{item.backupFileName}</Descriptions.Item>
          <Descriptions.Item label="字节">{item.backupFileSize}</Descriptions.Item>
          <Descriptions.Item label="操作">{backupOpDom}</Descriptions.Item>
        </Descriptions>

        return <List.Item>
          <List.Item.Meta
            description={backupItemDom}
          />
        </List.Item>
      }} />;

    let restoreLogDom = <List
      itemLayout="horizontal"
      dataSource={this.state.restoreLogList}
      renderItem={item => {
        let dateStr = moment(item.updatedAt).format('YYYY-MM-DD HH:MM:SS');
        let restoreOpDom = <div>
          <a style={{ textDecoration: 'underline' }} key={'a-' + item.id} onClick={() => { copy(item.id); }}>{'复制'}</a>
        </div>

        let restoreItemDom = <Descriptions bordered title={''} size={'small'} column={5}>
          <Descriptions.Item label="恢复时间">{dateStr}</Descriptions.Item>
          <Descriptions.Item label="文件名">{`${item.backupLogId}.tar`}</Descriptions.Item>
        </Descriptions>

        return <List.Item>
          <List.Item.Meta
            description={restoreItemDom}
          />
        </List.Item>
      }} />;      

    const columns = [
      {
        key: 1,
        title: '编号',
        dataIndex: 'serialNo',
      }, {
        key: 2,
        title: '数据库类型',
        render: (text, row, index) => {
          return <Tag color={'blue'}>{row.databaseItem}</Tag>
        },
      }, {
        key: 4,
        title: '连接名',
        render: (text, row, index) => {
          return <div>{row.connectionName}</div>
        },
      }, {
        key: 5,
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
      }, {
        key: 7,
        title: '备份',
        render: (text, row, index) => {
          return <div>
            <Popover trigger="click" placement="bottom" content={backupLogDom} title={`${row.connectionName}的备份历史`}>
              <a style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '0px', color: 'grey' }} onClick={() => { this.loadBackupLogList(row.id); }}>{'备份历史'}</a>
            </Popover>,

            <a style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '20px', }} onClick={() => { this.addBackup(row); }}>{'立即备份'}</a>
          </div>
        },
      }, {
        key: 8,
        title: '恢复',
        render: (text, row, index) => {
          return <div>
            <Popover trigger="click" placement="bottom"  content={restoreLogDom} title={`${row.connectionName}的恢复历史`}>
              <a style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '0px', color: 'grey' }} onClick={() => { this.loadRestoreLogList(row.id); }}>{'恢复历史'}</a>
            </Popover>
          </div>
        },
      }, {
        key: 9,
        title: '操作',
        render: (text, row, index) => {
          return <div>
            <a style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '0px' }} onClick={() => { this.onSubViewVisibleHandler('ADD', true, row); }}>{'克隆'}</a>
            <a style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '20px' }} onClick={() => { this.onSubViewVisibleHandler('UPDATE', true, row); }}>{'修改'}</a>
            <a style={{ textDecoration: 'underline', fontWeight: 'bold', marginLeft: '20px', color: 'red' }} onClick={() => { this.doRemove(row); }}>{'删除'}</a>
          </div>
        },
      },
    ];


    const pagination = {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['2', '10', '20', '50'],
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <PageHeaderWrapper title="">
        <div className={styles.tableListForm}>
          <Form onSubmit={this.pageSearchHandler} layout="inline">
            <Row gutter={24}>
              <Col className='ant-col-offset-20' span={2}>
                <FormItem>
                  <Button type="default" htmlType="submit" style={{ width: '100%' }}>查询</Button>
                </FormItem>
              </Col>
              <Col className='ant-col-offset-0' span={2}>
                <FormItem>
                  <Button onClick={() => { this.onSubViewVisibleHandler("ADD", true, {}); }} type="primary" htmlType="button" style={{ width: '100%' }}>新增</Button>
                </FormItem>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={24}>
                <Table
                  bordered
                  loading={this.state.loading}
                  dataSource={this.state.data}
                  onChange={this.pageChangeHandler}
                  columns={columns}
                  pagination={pagination}
                />
              </Col>
            </Row>
            <div>
              <DbmtConnectionConfigAddDrawer destroyOnClose={true} viewObj={this.state.views[0]} />
              <DbmtConnectionConfigUpdateDrawer destroyOnClose={true} viewObj={this.state.views[1]} />
            </div>
          </Form>
        </div>
      </PageHeaderWrapper>
    );
  }
}




