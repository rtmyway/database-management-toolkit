import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function connectorStatus(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.connectorApiUrl.status, params);
  requestCommon.processRequest(reqObj, callback);
}

export function connectorStart(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.connectorApiUrl.start, params);
  requestCommon.processRequest(reqObj, callback);
}

export function connectorStop(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.connectorApiUrl.stop, params);
  requestCommon.processRequest(reqObj, callback);
}

export function connectorProxyRequest(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.connectorApiUrl.proxyRequest, params);
  requestCommon.processRequest(reqObj, callback);
}

export function connectorProxy(params){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.connectorApiUrl.proxyRequest, params);
  return requestCommon.processClassicRequest(reqObj);
}

export function getConnectorDownloadUrl(){
  return serverConfig.ddmServer.host + apiUrlConfig.connectorApiUrl.downloadLog;
}
