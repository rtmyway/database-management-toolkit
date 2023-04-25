/** token检查配置 */
const checkTokenConfig = {
    active: true, //是否检查token
    checkUrlArray: [], //必检名单(必检和免检重复，按必检的来,暂不使用)
    uncheckUrlArray: ['/user/login'], //免检名单
    callback: {
        mode: 1, //1:跳转页面 2:警告提示
        content: '/user/login', //跳转页面或警告内容
    },
};

/** 版本检查配置 */
const checkVersionConfig = {
    active: true, //是否检查版本
    checkUrlArray: [], //必检名单(必检和免检重复，按必检的来,暂不使用)
    uncheckUrlArray: ['/user/login'], //免检名单
    callback: {
        mode: 1, //1:跳转页面 2:警告提示
        content: '/user/login', //跳转页面或警告内容
    },
};



export default {
    checkTokenConfig,
    checkVersionConfig,
};