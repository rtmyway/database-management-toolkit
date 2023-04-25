import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function instanceList(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.instanceApiUrl.list, params);
  requestCommon.processRequest(reqObj, callback);
}

export function instanceAdd(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.instanceApiUrl.add, params);
  requestCommon.processRequest(reqObj, callback);
}

export function instanceUpdate(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.instanceApiUrl.update, params);
  requestCommon.processRequest(reqObj, callback);
}

export function instanceRemove(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.instanceApiUrl.remove, params);
  requestCommon.processRequest(reqObj, callback);
}


