import React, { Component } from 'react';
import {Spin, Card, Row, Col, Form, Input, Select, Button, Table, Tabs} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import AdvancedConstants from './AdvancedConstants';
import AdvancedComponentTabs from './AdvancedComponentTabs';
import AdvancedActions from './AdvancedActions';

import styles from './AdvancedMain.less';
import {loadListPage,} from './AdvancedService';

const FormItem = Form.Item;
const {Option } = Select;
const TabPane = Tabs.TabPane;
@Form.create()
export default class AdvancedMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      tabArray : AdvancedConstants.tabMap.map((item) => {
        let obj = {
          key: item.key,
          title: item.title,
          initFlag : false,
          loading: false,
          data : [],
          extraData: {},
          searchValue : '',
          pagination : {
            total : 0,
            current : 1,
            pageSize : 10,
          },
        };
        return obj;
      }),
      viewArray : AdvancedConstants.viewMap.map((item) => {
        let obj = {
          key: item.key,
          title: item.title,
          visible: false,
          spinning: false,
          data : [],
          onSubViewVisibleHandler: this.onSubViewVisibleHandler,
          onSubViewActionHandler: this.onSubViewActionHandler,
        };
        return obj;
      }),
    };
  }

  //render前执行
  componentWillMount() {
    // 默认加载数据修改面板
    let tabIndex = this.getTabIndexByKey(AdvancedConstants.tabKeyMap.TAB_DATABASE);
    let tabObj = this.state.tabArray[tabIndex];
    AdvancedActions.loadDatabaseListPageLauncher(this, tabObj.pagination.current, tabObj.pagination.pageSize);


  }

  componentDidMount(){

  }

  /**
   * 根据KEY获得面板index
   */
  getTabIndexByKey = (key) => {
    let findIndex = this.state.tabArray.findIndex((item)=>{
      return item.key == key;
    });
    return findIndex;
  }

  /**
   * 根据KEY获得视图index
   */
  getViewIndexByKey = (key) => {
    let findIndex = this.state.viewArray.findIndex((item)=>{
      return item.key == key;
    });
    return findIndex;
  }  

  /**
   * 主视图上所有的事件
   * @param viewKey 视图key(参照AdvancedConstants.viewKeyMap)
   * @param actionKey 事件key(参照AdvancedConstants.actionKeyMap)
   * @param data 事件需要的数据
   */
  onMainViewActionHandler = (viewKey, actionKey, data) => {

  }

  /**
   * 子视图上所有的事件
   * @param viewKey 视图key(参照AdvancedConstants.viewKeyMap)
   * @param actionKey 事件key(参照AdvancedConstants.actionKeyMap)
   * @param data 事件需要的数据
   */
  onSubViewActionHandler = (viewKey, actionKey, data) => {

  }

  /**
   * 子视图的显示/隐藏
   * @param viewKey 视图key(参照AdvancedConstants.viewKeyMap)
   * @param visible true:显示 false:隐藏
   * @param data 传递给子视图需要的数据
   */
  onSubViewVisibleHandler = (viewKey, visible, data) => {

  }

  /**
   * 面板切换事件
   * @param tabKey
   */  
  onTabChangeHandler = (tabKey) => {
    let tabIndex = this.getTabIndexByKey(tabKey);
    let tabObj = this.state.tabArray[tabIndex];
    if (!tabObj.initFlag) {
      switch (tabKey) {
        case AdvancedConstants.tabKeyMap.TAB_DATABASE:
          AdvancedActions.loadDatabaseListPageLauncher(this, tabObj.pagination.current, tabObj.pagination.pageSize);
          break;
        case AdvancedConstants.tabKeyMap.TAB_ACCESS:
          AdvancedActions.loadAccessListPageLauncher(this, tabObj.pagination.current, tabObj.pagination.pageSize);
          break;
        case AdvancedConstants.tabKeyMap.TAB_APPLY:
            AdvancedActions.loadApplyListPageLauncher(this, tabObj.pagination.current, tabObj.pagination.pageSize);
            break;
        case AdvancedConstants.tabKeyMap.TAB_DEPLOY:
          break;
        case AdvancedConstants.tabKeyMap.TAB_OPS:
          break;
        case AdvancedConstants.tabKeyMap.TAB_OTHER:
            break;
      }
    }
  }

  /**
   * 分页切换事件
   * @param tabKey
   */  
  onPageChangeHandler = (pagination, filtersArg, sorter, tabIndex) => {
    let tabObj = this.state.tabArray[tabIndex];
    switch (tabObj.key) {
      case AdvancedConstants.tabKeyMap.TAB_DATABASE:
        AdvancedActions.loadDatabaseListPageLauncher(this, pagination.current, pagination.pageSize);
        break;
      case AdvancedConstants.tabKeyMap.TAB_ACCESS:
        AdvancedActions.loadAccessListPageLauncher(this, pagination.current, pagination.pageSize);
        break;
      case AdvancedConstants.tabKeyMap.TAB_APPLY:
          AdvancedActions.loadApplyListPageLauncher(this, pagination.current, pagination.pageSize);
          break;
      case AdvancedConstants.tabKeyMap.TAB_DEPLOY:
        break;
      case AdvancedConstants.tabKeyMap.TAB_OPS:
        break;
      case AdvancedConstants.tabKeyMap.TAB_OTHER:
          break;
    }
  }    

  render() {
  
    let tabArray = this.state.tabArray;

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <Spin spinning={this.state.loading}>
        <Card title={"header"} style={{marginBottom: 24}} bordered={false}>
            {'header'}
        </Card>
        <Card title={"body"} style={{marginBottom: 24}} bordered={true}>
          <Tabs defaultActiveKey={'TAB_DATABASE'} onChange={(v)=>this.onTabChangeHandler(v)}>
            {
              tabArray.map((item, index) => {
                return <TabPane tab={item.title} key={item.key}>{AdvancedComponentTabs.getTabComponent(this, index)}</TabPane>
              })
            }
          </Tabs>
        </Card>
      </Spin>
    </PageHeaderWrapper>
    );
  }
}
