
import AdvancedConstants from './AdvancedConstants';
import {loadListPage,} from './AdvancedService';

/**
 * 加载数据修改列表
 * @param parent
 * @param tabIndex
 */
export function loadDatabaseListPageLauncher(parent, current, pageSize) {
  let tabIndex = parent.getTabIndexByKey(AdvancedConstants.tabKeyMap.TAB_DATABASE);
  let tabArray = parent.state.tabArray;
  const reqParam = {
    pageNum : current,
    pageSize : pageSize,
    searchValue : tabArray[tabIndex].searchValue,
  };

  // 开始加载
  tabArray[tabIndex].loading = true;
  parent.setState({tabArray: tabArray,});
  
  // 开始请求,真实环境请移除setTimeout
  setTimeout(function (){
    loadListPage(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.list;
        for (let i = 0; i < list.length; i++) {
          list[i].key = list[i].id;
          list[i].serialNo = (current - 1) * pageSize + i + 1;
        }
        tabArray[tabIndex].initFlag = true;
        tabArray[tabIndex].data = list;
        tabArray[tabIndex].pagination.total = response.total;
        tabArray[tabIndex].pagination.current = current;
        tabArray[tabIndex].pagination.pageSize = pageSize;
      }
      tabArray[tabIndex].loading = false;
      // 加载完成
      parent.setState({tabArray: tabArray,});
    });
  }, 1000);
}

/**
 * 加载访问列表
 * @param parent
 * @param tabIndex
 */
export function loadAccessListPageLauncher(parent, current, pageSize) {
  let tabIndex = parent.getTabIndexByKey(AdvancedConstants.tabKeyMap.TAB_ACCESS);
  let tabArray = parent.state.tabArray;
  const reqParam = {
    pageNum : current,
    pageSize : pageSize,
    searchValue : tabArray[tabIndex].searchValue,
  };

  // 开始加载
  tabArray[tabIndex].loading = true;
  parent.setState({tabArray: tabArray,});
  
  // 开始请求,真实环境请移除setTimeout
  setTimeout(function (){
    loadListPage(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.list;
        for (let i = 0; i < list.length; i++) {
          list[i].key = list[i].id;
          list[i].serialNo = (current - 1) * pageSize + i + 1;
        }
        tabArray[tabIndex].initFlag = true;
        tabArray[tabIndex].data = list;
        tabArray[tabIndex].pagination.total = response.total;
        tabArray[tabIndex].pagination.current = current;
        tabArray[tabIndex].pagination.pageSize = pageSize;
      }
      tabArray[tabIndex].loading = false;
      // 加载完成
      parent.setState({tabArray: tabArray,});
    });
  }, 1000);
}

/**
 * 加载应用申请列表
 * @param parent
 * @param tabIndex
 */
export function loadApplyListPageLauncher(parent, current, pageSize) {
  let tabIndex = parent.getTabIndexByKey(AdvancedConstants.tabKeyMap.TAB_APPLY);
  let tabArray = parent.state.tabArray;
  const reqParam = {
    pageNum : current,
    pageSize : pageSize,
    searchValue : tabArray[tabIndex].searchValue,
  };

  // 开始加载
  tabArray[tabIndex].loading = true;
  parent.setState({tabArray: tabArray,});
  
  // 开始请求,真实环境请移除setTimeout
  setTimeout(function (){
    loadListPage(reqParam, (response) => {
      if (response != undefined && response != null) {
        let list = response.list;
        for (let i = 0; i < list.length; i++) {
          list[i].key = list[i].id;
          list[i].serialNo = (current - 1) * pageSize + i + 1;
        }
        tabArray[tabIndex].initFlag = true;
        tabArray[tabIndex].data = list;
        tabArray[tabIndex].pagination.total = response.total;
        tabArray[tabIndex].pagination.current = current;
        tabArray[tabIndex].pagination.pageSize = pageSize;
      }
      tabArray[tabIndex].loading = false;
      // 加载完成
      parent.setState({tabArray: tabArray,});
    });
  }, 1000);
}




export default {
  loadDatabaseListPageLauncher: loadDatabaseListPageLauncher,
  loadAccessListPageLauncher: loadAccessListPageLauncher,
  loadApplyListPageLauncher: loadApplyListPageLauncher,
};
