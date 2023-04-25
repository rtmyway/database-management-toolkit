import React, { Component } from 'react';
import {Row, Col, Form, Tag, Select, Button, Table, Switch, Icon, Modal, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import DdmPolicyAddDrawer from './DdmPolicyAddDrawer';
import styles from '../DdmGlobal.less';
import DdmGlobalConstants from '../DdmGlobalConstants';
import {policyList, policyAdd, policyRemove, policyEnable, policyDisable} from '../../../services/ddm-policy'
import {sinkList} from '../../../services/ddm-sink'
import CheckCommon from '../../../commons/CheckCommon';

const FormItem = Form.Item;
const {Option } = Select;
const confirm = Modal.confirm;
@Form.create()
export default class DdmPolicyMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],
      sinkList: [],
      viewDdmPolicyAdd : {
        key: DdmGlobalConstants.viewKeyMap.VIEW_DDM_POLICY_ADD,
        title: '新增策略',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
        onSubViewActionHandler: this.onSubViewActionHandler,
        action: {
          confirm: DdmGlobalConstants.actionKeyMap.ACTION_DDM_POLICY_ADD_CONFIRM,
        },
      },
      viewDdmPolicyRemove : {
        key: DdmGlobalConstants.viewKeyMap.VIEW_DDM_POLICY_REMOVE,
        title: '删除策略',
        visible: false,
        changeable: false,
        spinning: false,
        data: [],
        onSubViewVisibleHandler: this.onSubViewVisibleHandler,
        onSubViewActionHandler: this.onSubViewActionHandler,
        action: {
          confirm: DdmGlobalConstants.actionKeyMap.ACTION_DDM_POLICY_REMOVE_CONFIRM,
        },
      },    
    };
  }

  //render前执行
  componentWillMount() {
    //默认执行一次查询
    this.doPolicyList();
    this.doSinkList();
  }

  componentDidMount(){

  }

  /*发起查询*/
  doPolicyList = () => {
    const reqParam = {
    };
    // 加载状态=>加载中
    this.setState({loading: true,});
    
    policyList(reqParam, (response) => {
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

  /*发起查询*/
  doSinkList = () => {
    const reqParam = {
    };
    // 加载状态=>加载中
    this.setState({loading: true,});
    
    sinkList(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.data;
        this.setState({
          sinkList: list
        });
      }
      // 加载状态=>完成
      this.setState({loading: false,});
    });
  }  

  /**
   * 子视图上所有的事件
   * @param viewKey 视图key(DdmGlobalConstants.viewKeyMap)
   * @param actionKey 事件key(DdmGlobalConstants.actionKeyMap)
   * @param data 事件需要的数据
   */
   onSubViewActionHandler = (viewKey, actionKey, data) => {
    let viewObj;
    let reqParam;
    if (this.state.viewDdmPolicyAdd.action.confirm == actionKey) {
      viewObj = this.state.viewDdmPolicyAdd;
      viewObj.changeable = false;
      viewObj.spinning = true;
      this.setState({viewDdmPolicyAdd: viewObj,});
      
      reqParam = {...data};
      policyAdd(reqParam, (response) => {
        if (response != undefined && response != null) {
          message.success("新增成功");
          viewObj.visible = false;
          this.doPolicyList();
        }
        viewObj.spinning = false;
        this.setState({viewDdmPolicyAdd: viewObj,});
      });
    } else if (this.state.viewDdmPolicyRemove.action.confirm == actionKey) {
      let that = this;
      confirm({
        title: `确定要删除 【${data.policyId}】 吗?`,
        content: '删除后无法恢复,请谨慎操作',
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          let reqParam = {
            policyId: data.policyId,
          }
          that.setState({loading: true});
          policyRemove(reqParam, (response) => {
            if (response != undefined && response != null) {
              message.success("删除成功");
              that.doPolicyList();
            }
            that.setState({loading: false});
          });
          
        },
        onCancel() {
  
        },
      });
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
    if (this.state.viewDdmPolicyAdd.key == viewKey) {
      viewObj = this.state.viewDdmPolicyAdd;
      viewObj.changeable = true;
      viewObj.visible = visible;
      viewObj.data = data;
      this.setState({viewDdmPolicyAdd: viewObj,});
    }
  }  

  render() {
    const columns = [
      {
      //   key : 1,
      //   title: '编号',
      //   dataIndex: 'serialNo',
      // },{
        key : 2,
        title: '策略名称',
        render: (text, row, index) => {
          return <div>{row.policyId}</div>
        },
      },{
        key : 3,
        title: '存储模式',
        render: (text, row, index) => {
          let storageDom = row.shareMode == 1 ? "共享" : "独享";
          return <div>{storageDom}</div>
        },
      },{
        key : 4,
        title: '存储目标',
        render: (text, row, index) => {
          if (CheckCommon.isEmpty(row.bindSinkIds)) {
            return <div>{'无'}</div>;
          }

          let bindSinkIdArray = row.bindSinkIds.split(',');
          let storageTargetDom = '';
          storageTargetDom = this.state.sinkList.filter((item) => {
            if (CheckCommon.isEmpty(row.bindSinkIds)) {
              return false;
            }
            if (row.bindSinkIds == '*') {
              return true;
            }

            let findIndex = bindSinkIdArray.findIndex((val, index, arr) => {
              return val == item.sinkId;
            });

            return findIndex != -1;
          }).map(item => {
            return <Tag key={item.sinkId}>{item.sinkId == 'internal' ? '内置存储器' : item.sinkId}</Tag>
          });
          return <div>
            <div>{storageTargetDom}</div>
          </div>
        },
      },{     
        key : 5,
        title: '分发类型',
        render: (text, row, index) => {
          let opTag = "";
          let opArray = row.opStr.split(",");
          opTag = opArray.map((item)=>{
            if (item == "r") {
              return <Tag key={"r"} color="orange">{'Initialize'}</Tag>;
            } else if (item == "c") {
              return <Tag key={"c"} color="blue">{'Insert'}</Tag>;
            } else if (item == "u") {
              return <Tag key={"u"} color="green">{'Update'}</Tag>;
            } else if (item == "d") {
              return <Tag key={"d"} color="red">{'Delete'}</Tag>;
            } 
            
          });
          return <div>{opTag}</div>
        },
      },{
        key : 6,
        title: '分发表名',
        render: (text, row, index) => {
          let tableDom = "";
          let tableArray = row.tableStr.split(",");
          tableDom = tableArray.map((item)=>{
            return <p key={item}>{item}</p>
            
          });
          return <div>{tableDom}</div>
        },
      },{
        key : 7,
        title: '状态',
        width: '120px',
        render: (text, row, index) => {
          return  <Switch
            size={'small'}
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={row.status == 1}
            onChange={(v)=>{
              const reqParam = {
                policyId: row.policyId,
              };
              this.setState({loading: true,});
              if (v) {
                policyEnable(row, (response) => {
                  this.setState({loading: false,});
                  this.doPolicyList();
                });
              } else {
                policyDisable(row, (response) => {
                  this.setState({loading: false,});
                  this.doPolicyList();
                });
              }
            }}
          />
        },
      },{
        key : 8,
        title: '操作',
        render: (text, row, index) => {
          return <div>
            <a style={{fontWeight:'bold', marginLeft: '0px', color: 'red'}} onClick={()=>{this.onSubViewActionHandler(this.state.viewDdmPolicyRemove.key, this.state.viewDdmPolicyRemove.action.confirm, row);}}>{'删除'}</a>
          </div>
        },
      },
    ];

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={this.doPolicyList} layout="inline">
          <Row gutter={24}>
            <Col className='ant-col-offset-20' span={2}>
              <FormItem>
                <Button type="default" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
            <Col className='ant-col-offset-0' span={2}>
              <FormItem>
                <Button onClick={()=>{this.onSubViewVisibleHandler(this.state.viewDdmPolicyAdd.key, true, {sinkList: this.state.sinkList});}} type="primary" htmlType="button" style={{ width: '100%'}}>新增</Button>
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
            <DdmPolicyAddDrawer destroyOnClose={true} viewObj={this.state.viewDdmPolicyAdd}/>
          </div>          
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}





