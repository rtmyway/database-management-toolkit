import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function policyList(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.policyApiUrl.list, params);
  requestCommon.processRequest(reqObj, callback);
}

export function policyAdd(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.policyApiUrl.add, params);
  requestCommon.processRequest(reqObj, callback);
}

export function policyRemove(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.policyApiUrl.remove, params);
  requestCommon.processRequest(reqObj, callback);
}

export function policyEnable(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.policyApiUrl.enable, params);
  requestCommon.processRequest(reqObj, callback);
}

export function policyDisable(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.policyApiUrl.disable, params);
  requestCommon.processRequest(reqObj, callback);
}


