import React, { Component } from 'react';
import {Row, Col, Form, Input, Select, Button, Table} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './BasicMain.less';
import {loadListPage,} from './BasicService';

const FormItem = Form.Item;
const {Option } = Select;

@Form.create()
export default class BasicMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      data : [],
      searchObj : {
        searchValue : '',
        searchType : '',
      },
      pagination : {
        total : 0,
        current : 1,
        pageSize : 10,
      },
    };
  }

  //render前执行
  componentWillMount() {
    //默认执行一次查询
    this.loadListForPageLaunch(1, this.state.pagination.pageSize);
  }

  componentDidMount(){

  }

  /*发起查询*/
  loadListForPageLaunch = (current, pageSize) => {
    const reqParam = {
      pageNum : current,
      pageSize : pageSize,
      searchValue : this.state.searchObj.searchValue,
      searchType : this.state.searchObj.searchType,
    };
    // 加载状态=>加载中
    this.setState({loading: true,});
    
    // 开始请求,真实环境请移除setTimeout
    let that = this;
    let pageObj = that.state.pagination;
    setTimeout(function (){
      loadListPage(reqParam, (response) => {
        debugger
        if (response != undefined && response != null) {
          let list = response.list;
          for (let i = 0; i < list.length; i++) {
            list[i].key = list[i].id;
            list[i].serialNo = (pageObj.current - 1) * (pageObj.pageSize) + i + 1;
          }
          pageObj.total = response.total;
          that.setState({
            data: list,
            pagination: pageObj,
          });
        }
        // 加载状态=>完成
        that.setState({loading: false,});
      });
    }, 600);
  }


  //分页事件触发
  pageChangeHandler = (pagination, filtersArg, sorter) => {
    let pageObj = this.state.pagination;
    pageObj.current = pagination.current;
    pageObj.pageSize = pagination.pageSize;
    this.setState({pagination: pageObj,});
    this.loadListForPageLaunch(pagination.current, pagination.pageSize);
  }

  //查询单击事件
  pageSearchHandler = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.setState({
        loading : false,
        data : [],
        searchObj : {
          searchValue : values.searchValue == undefined ? '' : values.searchValue,
          searchType : values.searchType == undefined ? '' : values.searchType,
        },
        pagination : {
          total : 0,
          current : 1,
          pageSize : 10,
        },
      }, ()=>{this.loadListForPageLaunch(1, this.state.pagination.pageSize);});
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
        title: '名称',
        render: (text, row, index) => {
          return <div>{row.name}</div>
        },
      },{
        key : 3,
        title: '类型',
        render: (text, row, index) => {
          let typeStr = '未分类';
          if (row.type == 1) {
            typeStr = 'A类';
          } else if (row.type == 2) {
            typeStr = 'B类';
          } else if (row.type == 3) {
            typeStr = 'C类';
          }
          return <div>{typeStr}</div>
        },
      },{
        key : 8,
        title: '操作',
        render: (text, row, index) => {
          return <div><a>{'操作'}</a></div>
        },
      },
    ];
    const pagination = {
      current: this.state.pagination.current,
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: ['10', '20', '50'],
    };    

    const { getFieldDecorator } = this.props.form;
    return (
    <PageHeaderWrapper title="">
      <div className={styles.tableListForm}>
        <Form onSubmit={this.pageSearchHandler} layout="inline">
          <Row gutter={24}>
            <Col span={4}>
              <FormItem label="检索内容:">
                {getFieldDecorator('searchValue')(
                  <Input placeholder="请输入检索内容" />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem label="类型:">
                {getFieldDecorator('searchType', {initialValue:'-1'})(
                  <Select style={{ width: '100%'}} >
                    <Option value="-1">全部</Option>
                    <Option value="1">A类</Option>
                    <Option value="2">B类</Option>
                    <Option value="3">C类</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col className='ant-col-offset-0' span={2}>
              <FormItem>
                <Button type="default" htmlType="submit" style={{ width: '100%'}}>查询</Button>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24}>
              <Table
                bordered
                loading={this.state.loading}
                pagination={pagination}
                dataSource={this.state.data}
                columns={columns}
                onChange={this.pageChangeHandler}
              />
            </Col>
          </Row>
        </Form>
      </div>
    </PageHeaderWrapper>
    );
  }
}


/**
 * 延时处理
 * @param ms 
 */
function timeout(ms) {
  return new Promise((r)=>{
    setTimeout(r, ms);
  });
}

/**
 * 延时处理
 * @param ms 
 */
function doWait(obj) {
  console.info(new Date());
  console.info(obj);
}

function runAsync(flag){
  var p = new Promise(function(resolve, reject){
      //做一些异步操作
      setTimeout(function(){
          console.log('执行完成');
          if (flag) {
            resolve('ok');
          } else {
            reject('error');
          }
      }, 2000);
  });
  return p;            
}



