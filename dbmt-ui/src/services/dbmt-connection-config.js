import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function add(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.connectionConfigApiUrl.add, params);
  requestCommon.processRequest(reqObj, callback);
}

export function update(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.connectionConfigApiUrl.update, params);
  requestCommon.processRequest(reqObj, callback);
}

export function remove(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.connectionConfigApiUrl.remove, params);
  requestCommon.processRequest(reqObj, callback);
}

export function list(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.dbmterver, apiUrlConfig.connectionConfigApiUrl.list, params);
  requestCommon.processRequest(reqObj, callback);
}


