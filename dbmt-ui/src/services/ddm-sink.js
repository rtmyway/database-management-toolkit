import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function sinkList(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.sinkApiUrl.list, params);
  requestCommon.processRequest(reqObj, callback);
}

export function sinkAdd(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.sinkApiUrl.add, params);
  requestCommon.processRequest(reqObj, callback);
}

export function sinkRemove(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.sinkApiUrl.remove, params);
  requestCommon.processRequest(reqObj, callback);
}

export function sinkEnable(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.sinkApiUrl.enable, params);
  requestCommon.processRequest(reqObj, callback);
}

export function sinkDisable(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.sinkApiUrl.disable, params);
  requestCommon.processRequest(reqObj, callback);
}


export function sinkOutputList(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.sinkApiUrl.outputList, params);
  requestCommon.processRequest(reqObj, callback);
}

