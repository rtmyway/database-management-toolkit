import React, {Component} from 'react';
import moment from 'moment';
import {Table, Row, Col, Card, Tag, Button, Select } from 'antd';
import { Radar } from '@/components/Charts';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Zabbix.less';
import common from '@/commons/BaseCommon';
import {
  loadZabbixProblemListPage,
  loadUleProjectInfo,
} from '@/services/dashboard';
const {Option } = Select;
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

export default class Zabbix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      projectList: [],
      data : [],
      totalRadarVo : {},
      acknowledgedRadarVo : {},
      waitAcknowledgingRadarVo : {},
      searchObj : {
        searchValue : '',
      },
      pagination : {
        total : 0,
        current : 1,
        pageSize : 10,
      },

    
    };
  }

  componentWillMount() {
    //初始化获取所有项目信息
    this.setState({
      loading: true,
    });
    loadUleProjectInfo({}, (response) => {
      if (response != undefined && response != null) {
        try {
          let resultObj = JSON.parse(response.projectJsonStr);
          let projectObj = JSON.parse(resultObj.result);
          this.setState({projectList: projectObj});
        } catch(err){

        }
      }
      //默认执行一次查询
      this.loadListForPageLaunch(1, this.state.pagination.pageSize);
    });



  }
 
  /*发起查询*/
  loadListForPageLaunch = (current, pageSize) => {
    const reqParam = {
      pageNum : current,
      pageSize : pageSize,
      searchValue : this.state.searchObj.searchValue,
      
    };
    this.setState({
      loading: true,
    });
    loadZabbixProblemListPage(reqParam, this.loadListForPageCallback);
  }

  /*查询结果回调*/
  loadListForPageCallback = (response) => {
    if (response != undefined && response != null) {
      let list = response.list;
      for (let i = 0; i < list.length; i++) {
        list[i].serialNo = (this.state.pagination.current - 1) * this.state.pagination.pageSize + (i + 1) ;
        list[i].key = list[i].serialNo;
      }
      this.setState({
        loading: false,
        data: list,
        totalRadarVo : response.totalRadarVo,
        acknowledgedRadarVo : response.acknowledgedRadarVo,
        waitAcknowledgingRadarVo : response.waitAcknowledgingRadarVo,
        pagination: {
          total: response.total,
          current: this.state.pagination.current,
          pageSize: this.state.pagination.pageSize,
        },
      });
    }
    this.setState({
      loading: false,
    });
  }

  //分页事件触发
  pageChangeHandle = (pagination, filtersArg, sorter) => {
    this.setState({
      pagination: pagination,
    });
    this.loadListForPageLaunch(pagination.current, pagination.pageSize);
  }

  getRadarData = () => {
    let radarData = [];
    let radarTitleMap = {
      informationCnt: '正常',
      warningCnt: '警告',
      averageCnt: '一般严重',
      highCnt: '严重',
      disasterCnt: '灾难',
    };
    let radarOriginData = [
      this.state.totalRadarVo,
      this.state.waitAcknowledgingRadarVo,
      this.state.acknowledgedRadarVo,
    ];

    radarOriginData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'name') {
          radarData.push({
            name: item.name,
            label: radarTitleMap[key],
            value: item[key],
          });
        }
      });
    });
    return radarData;

  }

  render() {

    let levelOption = [];
    levelOption.push(<Option key={`1`}>{`正常`}</Option>);
    levelOption.push(<Option key={`2`}>{`警告`}</Option>);
    levelOption.push(<Option key={`3`}>{`一般严重`}</Option>);
    levelOption.push(<Option key={`4`}>{`严重`}</Option>);
    levelOption.push(<Option key={`5`}>{`灾难`}</Option>);

    let confirmOption = [];
    confirmOption.push(<Option key={`-1`}>{`全部`}</Option>);
    confirmOption.push(<Option key={`1`}>{`已确认`}</Option>);
    confirmOption.push(<Option key={`0`}>{`未确认`}</Option>);


    const columns = [
      // {
      //   key : 1,
      //   title: '编号',
      //   dataIndex: 'serialNo',
      // },
      {
        key : 2,
        title: '时间',
        render: (text, row, index) => {
          return <div className={styles.normalText}>{moment.unix(row.clock).format(dateFormat)}</div>
        },
      },      
      // {
      //   key : 3,
      //   title: '主机',
      //   render: (text, row, index) => {
      //     return <div className={styles.normalText}>{row.host}</div>
      //   },
      // },
      {
        key : 4,
        title: '项目信息',
        render: (text, row, index) => {
          let domContent = '';
          let appObj = '';
          let projectArray = this.state.projectList;
          let matchArray = [];
          let host = row.host;
          // host = '172.25.184.238';

          if (projectArray != null) {
            matchArray = projectArray.filter((item,index)=>{
              let flag = false;
              try {
                let serverArray = item.profile.env.prd.servers;
                flag = serverArray.includes(host, 0);
              } catch (e) {

              }
              return flag;
            });
          }
          if (matchArray.length > 0) {
            appObj = matchArray[0];
            domContent = <div>
              <span style={{display:'inline-block', width:'80px', fontWeight:'bold'}}>主机：</span><span>{host}</span>
              <h1></h1>
              <span style={{display:'inline-block', width:'80px', fontWeight:'bold'}}>模块：</span><span>{appObj.module}</span>
              <h1></h1>
              <span style={{display:'inline-block', width:'80px', fontWeight:'bold'}}>应用：</span><span>{appObj.app}</span>
              <h1></h1>
              <span style={{display:'inline-block', width:'80px', fontWeight:'bold'}}>负责：</span><span>{appObj.leader}</span>
            </div>;
          } else {
            domContent = <div>
            <span>{host}</span>
          </div>;
          }
          return <div className={styles.normalText}>{domContent}</div>
        },
      },      
      {
        key : 5,
        title: <div>
          <span style={{marginRight:'20px'}}>问题</span>
          {/* <Select
            mode="multiple"
            style={{ width: '250px' }}
            placeholder=""
            defaultValue={['5', '4', '3']}>
            {levelOption}
          </Select> */}
        </div>,
        render: (text, row, index) => {
          let priority = row.priority;
          let priorityTag = '';
          if (priority == 1) {
            priorityTag = <Tag color="#99FF99">{`正常`}</Tag>;
          } else if (priority == 2) {
            priorityTag = <Tag color="#FFD700">{`警告`}</Tag>;
          } else if (priority == 3) {
            priorityTag = <Tag color="#FF9999">{`一般严重`}</Tag>;
          } else if (priority == 4) {
            priorityTag = <Tag color="#FF3333">{`严重`}</Tag>;
          } else if (priority == 5) {
            priorityTag = <Tag color="#DD0000">{`灾难`}</Tag>;
          }
          return <div className={styles.normalText}>{priorityTag}<span>{row.description}</span></div>
        },
      },
      {
        key : 6,
        title: '持续时间',
        render: (text, row, index) => {
          let diffTime = 0;
          let now = new Date();
          if (row.rClock == null || row.rClock == 0) {
            diffTime = now.getTime() - row.clock * 1000;
          } else {
            diffTime = row.rClock * 1000 - row.clock * 1000;
          }

          return <div className={styles.normalText}>{common.functionCommon.getElapseTimeStr(diffTime)}</div>

        },
      },
      // {
      //   key : 7,
      //   title: <div>
      //   <span style={{marginRight:'20px'}}>确认状态</span>
      //   {/* <Select
      //     // mode="multiple"
      //     style={{ width: '200px' }}
      //     placeholder=""
      //     defaultValue={['-1']}>
      //     {confirmOption}
      //   </Select> */}
      // </div>,
      //   render: (text, row, index) => {
      //     let dom = '';
      //     if (row.acknowledged == 1) {
      //       dom = <Badge status={"success"} text={"已确认"} />;
      //     } else {
      //       dom = <Badge status={"error"} text={"未确认"} />;
      //     }
      //     return <div className={styles.normalText}>{dom}</div>
      //   },
      // },                
    ];




    return (
      <PageHeaderWrapper
        loading={''}
        content={''}
        extraContent={''}
      >
        <Row gutter={24}>
          <Col xl={24} lg={24} md={24} sm={24} xs={24}>
            <Card
              bodyStyle={{ padding: 0 }}
              bordered={false}
              className={styles.activeCard}
              title={<div>
                      <span>{'zabbix报警'}</span>
                      <Button onClick={()=>{
                          this.loadListForPageLaunch(this.state.pagination.current, this.state.pagination.pageSize);
                        }} style={{marginLeft:'20px'}}
                        size="small" icon="reload">

                      </Button>
              </div>}
              loading={false}
            >
              <Table
                bordered={true}
                loading={this.state.loading}
                pagination={this.state.pagination}
                dataSource={this.state.data}
                columns={columns}
                onChange={this.pageChangeHandle}
                // rowClassName={
                //   (record, index)=>{
                //     return styles.highlightRow;
                //   }
                // }                
              />
            </Card>
            
          </Col>
          {/* <Col xl={6} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{ marginBottom: 24 }}
              bordered={false}
              title="警报指数"
              loading={false}
            >
              <div className={styles.chart}>
                <Radar hasLegend height={343} data={this.getRadarData()} />
              </div>
            </Card>
          </Col> */}
        </Row>
      </PageHeaderWrapper>
    );
  }
}
