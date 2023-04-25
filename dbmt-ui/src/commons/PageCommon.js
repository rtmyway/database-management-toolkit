import dataConfig from '../configs/DataConfig';
import pageConfig from '../configs/PageConfig';
import checkCommon from '../commons/CheckCommon';


/**
 * location文中获得参数
 * @param name 
 */
export function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var searchStr = decodeURIComponent(window.location.search.substr(1));
  var r =searchStr.match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

/**
 * 跳转默认页面
 */
export function jumpDefaultPage() {
  self.location = '/';
}

/**
 * 登出
 */
export function doLogout() {
  dataConfig.carryObject.setDataItem('operator', {});
  self.location = '/user/login';
}

/**
 * 初始化localStorage
 */
export function initCarryObject() {
  //1.初始化携带数据
  dataConfig.carryObject.load();
}

/**
 * 检查token
 * @param pagePath
 */
export function checkToken(pagePath) {
  let settings = pageConfig.checkTokenConfig;

  //需要检查token,但是先排除免检
  let flag = settings.uncheckUrlArray.some((item, index, array) => {
    return item == pagePath;
  });
  if (flag) {
    return; 
  }


  //判断token是否存在
  if (dataConfig.carryObject.data.operator == undefined || checkCommon.isEmpty(dataConfig.carryObject.data.operator.token)) {
    dataConfig.carryObject.setDataItem('operator', {});
    if (settings.callback.mode == 1) {
      self.location = settings.callback.content;
    }
  }
  return;
}




export default {
  getQueryString: getQueryString,
  doLogout: doLogout,
  jumpDefaultPage: jumpDefaultPage,
  initCarryObject: initCarryObject,
  checkToken: checkToken,
};
