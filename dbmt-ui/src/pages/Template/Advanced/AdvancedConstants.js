/**
 * 子视图操作
 */
const actionKeyMap = {
  /** 数据修改分页查询 */
  ACTION_DATABASE_LOAD_LIST_PAGE: 'ACTION_DATABASE_LOAD_LIST_PAGE',

}

/**
 * 视图key
 */
const viewKeyMap = {
  /** 主视图 */
  VIEW_MAIN: 'VIEW_MAIN',
  /** 数据修改详情 */
  VIEW_DATABASE_DETAIL: 'VIEW_DATABASE_DETAIL',
  /** 访问权限详情 */
  VIEW_DATABASE_DETAIL: 'VIEW_ACCESS_DETAIL',
  /** 应用申请详情 */
  VIEW_APPLY_DETAIL: 'VIEW_APPLY_DETAIL',
}


/**
 * 面板key
 */
const tabKeyMap = {
  TAB_DATABASE: 'TAB_DATABASE',
  TAB_ACCESS: 'TAB_ACCESS',
  TAB_APPLY: 'TAB_APPLY',
  TAB_DEPLOY: 'TAB_DEPLOY',
  TAB_OPS: 'TAB_OPS',
  TAB_OTHER: 'TAB_OTHER',
};

/**
 * 视图
 */
const viewMap = [
  {key: viewKeyMap.VIEW_DATABASE_DETAIL, title: '数据修改详情',},
  {key: viewKeyMap.VIEW_ACCESS_DETAIL, title: '访问权限详情',},
  {key: viewKeyMap.VIEW_APPLY_DETAIL, title: '应用申请详情',},
];

/**
 * 面板
 */
const tabMap = [
  {key: tabKeyMap.TAB_DATABASE, title: '数据修改', type: '1'},
  {key: tabKeyMap.TAB_ACCESS, title: '访问权限', type: '1'},
  {key: tabKeyMap.TAB_APPLY, title: '应用申请', type: '1'},
  {key: tabKeyMap.TAB_DEPLOY, title: '应用发布', type: '1'},
  {key: tabKeyMap.TAB_OPS, title: '重启-暂停-操作', type: '1'},
  {key: tabKeyMap.TAB_OTHER, title: '其他', type: '2'},
];

export default {
  actionKeyMap: actionKeyMap,
  viewKeyMap: viewKeyMap,  
  viewMap: viewMap,
  tabKeyMap: tabKeyMap,
  tabMap: tabMap,
};
