import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function add(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.restoreApiUrl.add, params);
  requestCommon.processRequest(reqObj, callback);
}


export function remove(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.restoreApiUrl.remove, params);
  requestCommon.processRequest(reqObj, callback);
}

export function listPage(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.restoreApiUrl.listPage, params);
  requestCommon.processRequest(reqObj, callback);
}

export default {
  add : add,
  listPage : listPage,
};