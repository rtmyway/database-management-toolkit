import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';

export function appStatus(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.appApiUrl.status, params);
  requestCommon.processRequest(reqObj, callback);
}


