import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import ViewCommon from '../../../commons/ViewCommon'
import {add, update, remove, list} from '../../../services/dbmt-backup'

import DbmtBackupConfigAddDrawer from './DbmtBackupConfigAddDrawer';
import DbmtBackupConfigUpdateDrawer from './DbmtBackupConfigUpdateDrawer';

import styles from '../DbmtGlobal.less';


const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DbmtBackupRestoreMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      backupLogList : [],
      backupPagination : {
        total : 0,
        pageNum : 1,
        pageSize : 10,
      },
      restoreLogList: [],
      restorePagination : {
        total : 0,
        pageNum : 1,
        pageSize : 10,
      },      
      views: ViewCommon.createViews([
        {key: 'ADD', title: '新增', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
        {key: 'UPDATE', title: '修改', visible: false, changeable: true, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
        {key: 'REMOVE', title: '删除', visible: false, changeable: false, onSubViewVisibleHandler: this.onSubViewVisibleHandler, onSubViewActionHandler: this.onSubViewActionHandler},
      ]),          
    };
  }

  //render前执行
  componentWillMount() {
    this.loadBackupLogListPage();
    // this.loadRestoreLogList();
  }

  componentDidMount(){

  }

// //分页事件触发
// pageChangeHandler = (pagination, filtersArg, sorter) => {
//   let pageObj = this.state.pagination;
//   pageObj.current = pagination.current;
//   pageObj.pageSize = pagination.pageSize;
//   this.setState({pagination: pageObj,});
//   this.loadListForPageLaunch(pagination.current, pagination.pageSize);
// }

// //查询单击事件
// pageSearchHandler = (e) => {
//   e.preventDefault();
//   this.props.form.validateFields((err, values) => {
//     let searchObj = this.state.searchObj;
//     searchObj.searchValue = values.searchValue == undefined ? '' : values.searchValue;
//     searchObj.active = values.active == undefined ? '' : values.active;
//     this.setState({
//       searchObj: searchObj,
//     }, ()=>{this.loadListForPageLaunch(1, this.state.pagination.pageSize);});
//   });
// }


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
            that.doList();

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
            that.doList();

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

  /*发起备份日志分页查询*/
  loadBackupLogListPage = (pageNum, pageSize) => {
    const reqParam = {
      pageNum : pageNum,
      pageSize : pageSize,
    };
    // 加载状态=>加载中
    this.setState({loading: true,});
    
    list(reqParam, (response) => {
      if (response != undefined && response != null) {
        let data = response.data;
        let list = data.list;
        let pageInfo = {
          total: data.total,
          pageNum: data.pageNum,
          pageSize: data.pageSize,
        };
        for (let i = 0; i < list.length; i++) {
          list[i].key = list[i].id;
          list[i].serialNo = (pageInfo.pageNum - 1) * (pageInfo.pageSize) + i + 1;

        }
        this.setState({
          backupLogList: list,
          pagination: pageInfo
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }

  /*发起删除*/
  doRemove = (config) => {
    let that = this;
    confirm({
      title: `确定要删除 【${config.backupName}】 吗?`,
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
              message.success(`${config.backupName} 已删除`);   
              that.doList();
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
        title: '备份名称',
        render: (text, row, index) => {
          return <div>{row.backupName}</div>
        },
      },{
        key : 3,
        title: '备份周期',
        render: (text, row, index) => {
          let frequencyTypeStr = '';
          if (row.frequencyType == 'DAY') {
            frequencyTypeStr = '天';
          } else if (row.frequencyType == 'WEEK') {
            frequencyTypeStr = '周';
          } else if (row.frequencyType == 'MONTH') {
            frequencyTypeStr = '月';
          }
          return <Tag color={'blue'}>{`${row.frequencyValue}${frequencyTypeStr}1次`}</Tag>
        },
      },{
        key : 4,
        title: '备份时间段',
        render: (text, row, index) => {
          return <div>{row.timeSlots}</div>
        },
      },{
        key : 9,
        title: '操作',
        render: (text, row, index) => {
          return <div>
            <a style={{fontWeight:'bold', marginLeft: '0px'}} onClick={()=>{this.onSubViewVisibleHandler('ADD', true, row);}}>{'克隆'}</a>            
            <a style={{fontWeight:'bold', marginLeft: '20px'}} onClick={()=>{this.onSubViewVisibleHandler('UPDATE', true, row);}}>{'修改'}</a>
            <a style={{fontWeight:'bold', marginLeft: '20px', color: 'red'}} onClick={()=>{this.doRemove(row);}}>{'删除'}</a>
          </div>
        },
      },
    ];

    const pagination = {
      current: this.state.backupPagination.current,
      pageSize: this.state.backupPagination.pageSize,
      total: this.state.backupPagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['2', '10', '20', '50'],
    };   
    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form  onSubmit={this.doList} layout="inline">
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
                pagination={pagination}
              />
            </Col>
          </Row>
          <div>
            <DbmtBackupConfigAddDrawer destroyOnClose={true} viewObj={this.state.views[0]}/>
            <DbmtBackupConfigUpdateDrawer destroyOnClose={true} viewObj={this.state.views[1]}/>
          </div>               
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}




