import { notification } from 'antd';
import request from '../utils/request';

/**
 * 生成网络请求对象-post方式
 * @param serverObj 服务器信息(host,version)
 * @param apiUrl 接口
 * @param params 参数
 */
export function getPostReqObj(serverObj, apiUrl, params) {
  let reqObj = {
    reqUrl : serverObj.host + apiUrl,
    dataObj : params
  }
  return reqObj;
}

/**
 * 延时处理
 * @param ms 
 */
function timeout(ms) {
  return new Promise((r)=>{
    setTimeout(r, ms);
  });
}

/**
 * 处理服务器请求
 * @param reqObj
 */
 export async function processClassicRequest(reqObj) {
  const response = await request(reqObj.reqUrl, reqObj.dataObj);
  return response;
}

/**
 * 处理服务器请求
 * @param reqObj
 * @param callback
 */
export async function processRequest(reqObj, callback) {
  //默认延迟1秒执行 
  await timeout(300);
  const response = await request(reqObj.reqUrl, reqObj.dataObj);
  processResponse(response, callback);
}


/**
 * 处理服务器响应
 * @param response
 * @param callback
 */
export function processResponse(response, callback) {
  if (response == null || response == undefined) {
    notification.error({
      message: '网络错误',
      description: '网络错误'
    });
    callback(response);
  } else {
    let responseState = response.state;
    if (responseState == 'success') {
      callback(response);
    } else if (responseState == 'error') {
      notification.error({
        message: response.message,
        description: response.message
      });
      callback(null);
    }
  }

}

export default {
    getPostReqObj : getPostReqObj,
    processResponse : processResponse,
    processRequest : processRequest,
    processClassicRequest: processClassicRequest,
};
