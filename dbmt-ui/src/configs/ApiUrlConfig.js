// app
const appApiUrl = {
    status: '/app/status', //状态
}

// kafka
const kafkaApiUrl = {
    status: '/kafka/status', //状态
    start: '/kafka/start', //启动
    stop: '/kafka/stop', //停止
}

// connector
const connectorApiUrl = {
    status: '/connector/status', //状态
    start: '/connector/start', //启动
    stop: '/connector/stop', //停止
    proxyRequest: '/connector/proxy-request', // 代理请求连接器
    downloadLog: '/connector/download-log' // 日志下载
}

// instance
const instanceApiUrl = {
    list: '/instance/list', //获得连接实例列表
    listRunning: '/instance/list-running', //获得真实连接实例列表
    add: '/instance/add', //新增实例
    update: '/instance/update', //更新实例
    remove: '/instance/remove', //删除实例
}

// policy
const policyApiUrl = {
    list: '/policy/list', //获得策略列表
    add: '/policy/add', // 新增策略
    remove: '/policy/remove', //删除策略
    enable: '/policy/enable', //启用策略
    disable: '/policy/disable', //停用策略
}

// distribution
const distributionApiUrl = {
    status: '/distribution/status', //状态
    start: '/distribution/start', //启动
    stop: '/distribution/stop', //停止
    pause: '/distribution/pause', //暂停
    resume: '/distribution/resume', //恢复
}

// sink
const sinkApiUrl = {
    list: '/sink/list', //获得输出源列表
    add: '/sink/add', // 新增输出源
    remove: '/sink/remove', //删除输出源
    enable: '/sink/enable', //启用输出源
    disable: '/sink/disable', //停用输出源
    outputList: '/sink/output-list', //输出物列表
}

const databaseApiUrl = {
    connect: '/database/connect', //检测数据库连接
    checkEnvironment: '/database/checkEnvironment', //检测数据库环境
}



export default {
    appApiUrl,
    kafkaApiUrl,
    connectorApiUrl,
    instanceApiUrl,
    policyApiUrl,
    distributionApiUrl,
    sinkApiUrl,
    databaseApiUrl
}
