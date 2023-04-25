import React, { Component } from 'react';

import { Row, Col, Form, Input, Select, Button, Icon, message} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


import config from '@/configs/BaseConfig';
import common from '@/commons/BaseCommon';
import {
  loadLogSummaryListPage,
} from '@/services/log';
import styles from './AppLogSummary.less';
import AppLogTable from '../../components/BusinessTable/AppLogTable';

const FormItem = Form.Item;
const {Option } = Select;

@Form.create()
export default class AppLogSummary extends Component {
  state = {
    loading : false,
    data : [],
    searchObj : {
      searchValue : '',
      groupLevel : '-1'
    },
    pagination : {
      total : 0,
      current : 1,
      pageSize : 10,
    },
  };

  //render前执行
  componentWillMount() {
    if (common.functionCommon.loadCarryObject()) {
      //默认执行一次查询
      this.loadListForPageLaunch(1, this.state.pagination.pageSize);
    }
  }

  componentDidMount(){

  }

  /*发起查询*/
  loadListForPageLaunch = (current, pageSize) => {
    const reqParam = {
      pageNum : current,
      pageSize : pageSize,
      
    };
    this.setState({
      loading: true,
    });
    loadLogSummaryListPage(reqParam, this.loadListForPageCallback);
  }

  /*查询结果回调*/
  loadListForPageCallback = (response) => {
    if (response != undefined && response != null) {
      let data = response.data;
      for (let i = 0; i < data.list.length; i++) {
        data.list[i].key = data.list[i].appName;
        data.list[i].serialNo = (this.state.pagination.current - 1) * this.state.pagination.pageSize + (i + 1) ;
      }
      this.setState({
        loading: false,
        data: data.list,
        pagination: {
          total: data.total,
          current: this.state.pagination.current,
          pageSize: this.state.pagination.pageSize,
        },
      });
    } else {
      this.setState({
        loading: false,
    });
    }





  }

  //分页事件触发
  pageChangeHandle = (pagination, filtersArg, sorter) => {
    this.setState({
      pagination: pagination,
    });
    this.loadListForPageLaunch(pagination.current, pagination.pageSize);
  }

  //查询单击事件
  pageSearchHandle = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        loading : false,
        data : [],
        searchObj : {

        },
        pagination : {
          total : 0,
          current : 1,
          pageSize : 10,
        },
      }, ()=>{this.loadListForPageLaunch(0, this.state.pagination.pageSize);});
    });
  }

 

  
 



  render() {
    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={this.pageSearchHandle} layout="inline">
          <Row gutter={24}>
            <Col xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
              <FormItem label="检索内容:">
                {getFieldDecorator('searchValue')(
                  <Input placeholder="应用名称" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col className='ant-col-offset-20' span={4}>
              <FormItem>
                <Button type="primary" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <AppLogTable
                  data={this.state.data}
                  loading={this.state.loading}
                  pagination={this.state.pagination}
                  pageChangeHandle={this.pageChangeHandle}
                />
            </Col>
          </Row>
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}
