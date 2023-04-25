import {Row, Col, Table,} from 'antd';
import AdvancedConstants from './AdvancedConstants';
/**
 * 创建面板组件
 * @param parent
 * @param tabIndex
 */
export function getTabComponent(parent, tabIndex) {
  let result = '';
  let tabKey = parent.state.tabArray[tabIndex].key;
  switch (tabKey) {
    case AdvancedConstants.tabKeyMap.TAB_DATABASE :
      result = getTabDatabase(parent, tabIndex);
      break;
    case AdvancedConstants.tabKeyMap.TAB_ACCESS :
      result = getTabAccess(parent, tabIndex);
      break;
    case AdvancedConstants.tabKeyMap.TAB_APPLY :
        result = getTabApply(parent, tabIndex);
        break;
    case AdvancedConstants.tabKeyMap.TAB_DEPLOY :
        result = getTabDeploy(parent, tabIndex);
        break;
    case AdvancedConstants.tabKeyMap.TAB_OPS :
        result = getTabOps(parent, tabIndex);
        break;
    case AdvancedConstants.tabKeyMap.TAB_OTHER :
        result = getTabOther(parent, tabIndex);
        break;        
  }
  return result;
}

/**
 * 创建TAB_DATABASE
 * @param parent
 * @param tabIndex
 */
function getTabDatabase(parent, tabIndex) {
  let result = '';
  const columns = [
    {key : 1, title: '编号', dataIndex: 'serialNo',},
    {key : 2, title: '名称', render: (text, row, index) => {return <div>{row.name}</div>},},
    {key : 8, title: '操作', render: (text, row, index) => {return <div><a>{'查看Database'}</a></div>},},
  ];
  const tabObj = parent.state.tabArray[tabIndex];
  const pagination = {
    current: tabObj.pagination.current,
    pageSize: tabObj.pagination.pageSize,
    total: tabObj.pagination.total,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '50'],
  };

  const viewIndex = parent.getViewIndexByKey(AdvancedConstants.viewKeyMap.VIEW_DATABASE_DETAIL);
  const viewObj = parent.state.viewArray[viewIndex];

  result = <div>
    <Table
      bordered
      loading={tabObj.loading}
      pagination={pagination}
      dataSource={tabObj.data}
      columns={columns}
      onChange={(pagination, filtersArg, sorter) => parent.onPageChangeHandler(pagination, filtersArg, sorter, tabIndex)}
    />
  </div>;


  return result;
}

/**
 * 创建TAB_ACCESS
 * @param parent
 * @param tabIndex
 */
function getTabAccess(parent, tabIndex) {
  let result = '';
  const columns = [
    {key : 1, title: '编号', dataIndex: 'serialNo',},
    {key : 2, title: '名称', render: (text, row, index) => {return <div>{row.name}</div>},},
    {key : 8, title: '操作', render: (text, row, index) => {return <div><a>{'查看Access'}</a></div>},},
  ];
  const tabObj = parent.state.tabArray[tabIndex];
  const pagination = {
    current: tabObj.pagination.current,
    pageSize: tabObj.pagination.pageSize,
    total: tabObj.pagination.total,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '50'],
  };    

  result = <div>
    <Row gutter={24}>
      <Col span={24}>
        <Table
          bordered
          loading={tabObj.loading}
          pagination={pagination}
          dataSource={tabObj.data}
          columns={columns}
          onChange={(pagination, filtersArg, sorter) => parent.onPageChangeHandler(pagination, filtersArg, sorter, tabIndex)}
        />
      </Col>
    </Row>
  </div>;  
  return result;
}

/**
 * 创建TAB_APPLY
 * @param parent
 * @param tabIndex
 */
function getTabApply(parent, tabIndex) {
  let result = '';
  const columns = [
    {key : 1, title: '编号', dataIndex: 'serialNo',},
    {key : 2, title: '名称', render: (text, row, index) => {return <div>{row.name}</div>},},
    {key : 8, title: '操作', render: (text, row, index) => {return <div><a>{'查看Apply'}</a></div>},},
  ];
  const tabObj = parent.state.tabArray[tabIndex];
  const pagination = {
    current: tabObj.pagination.current,
    pageSize: tabObj.pagination.pageSize,
    total: tabObj.pagination.total,
    showQuickJumper: true,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '50'],
  };    

  result = <div>
    <Row gutter={24}>
      <Col span={24}>
        <Table
          bordered
          loading={tabObj.loading}
          pagination={pagination}
          dataSource={tabObj.data}
          columns={columns}
          onChange={(pagination, filtersArg, sorter) => parent.onPageChangeHandler(pagination, filtersArg, sorter, tabIndex)}
        />
      </Col>
    </Row>
  </div>;
  return result;
}

/**
 * 创建TAB_DEPLOY
 * @param parent
 * @param tabIndex
 */
function getTabDeploy(parent, tabIndex) {
  let result = '创建TAB_DEPLOY';
  return result;
}

/**
 * 创建TAB_OPS
 * @param parent
 * @param tabIndex
 */
function getTabOps(parent, tabIndex) {
  let result = '创建TAB_OPS';
  return result;
}

/**
 * 创建TAB_OTHER
 * @param parent
 * @param tabIndex
 */
function getTabOther(parent, tabIndex) {
  let result = '创建TAB_OTHER';
  return result;
}



export default {
  getTabComponent: getTabComponent,
};
