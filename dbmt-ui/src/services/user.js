import serverConfig from '../configs/ServerConfig';
import apiUrlConfig from '../configs/ApiUrlConfig';
import requestCommon from '../commons/RequestCommon';
import request from '../utils/request';

export async function accountLogin(params, callback){
  let reqObj = requestCommon.getPostReqObj(serverConfig.passportServer, apiUrlConfig.passportApiUrl.accountLogin, params);
  requestCommon.processRequest(reqObj, callback);
}
