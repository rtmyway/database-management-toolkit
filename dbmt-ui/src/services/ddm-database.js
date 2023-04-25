import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';


export function connect(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.databaseApiUrl.connect, params);
  requestCommon.processRequest(reqObj, callback);
}

export function checkEnvironment(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.ddmServer, apiUrlConfig.databaseApiUrl.checkEnvironment, params);
  requestCommon.processRequest(reqObj, callback);
}



