/**
 * 输出本地文件
 * @param val
 */
export function outputFile(fileName, str) {
    let pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
    pom.setAttribute('download', fileName);
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

/**
 * 延时处理
 * @param ms 
 */
 export function timeout(ms) {
    return new Promise((r)=>{
      setTimeout(r, ms);
    });
  }



export default {
    outputFile : outputFile,
    timeout : timeout,
};
