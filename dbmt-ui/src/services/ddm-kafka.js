import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function kafkaStatus(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.kafkaApiUrl.status, params);
  requestCommon.processRequest(reqObj, callback);
}

export function kafkaStart(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.kafkaApiUrl.start, params);
  requestCommon.processRequest(reqObj, callback);
}

export function kafkaStop(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.kafkaApiUrl.stop, params);
  requestCommon.processRequest(reqObj, callback);
}


