import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function distributionStatus(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.distributionApiUrl.status, params);
  requestCommon.processRequest(reqObj, callback);
}

export function distributionStart(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.distributionApiUrl.start, params);
  requestCommon.processRequest(reqObj, callback);
}

export function distributionStop(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.distributionApiUrl.stop, params);
  requestCommon.processRequest(reqObj, callback);
}

export function distributionPause(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.distributionApiUrl.start, params);
  requestCommon.processRequest(reqObj, callback);
}

export function distributionResume(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.distributionApiUrl.stop, params);
  requestCommon.processRequest(reqObj, callback);
}


