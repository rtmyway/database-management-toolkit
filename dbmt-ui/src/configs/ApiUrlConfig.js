// connectionConfigApiUrl
const connectionConfigApiUrl = {
    add: '/connection-config/add', //新增
    update: '/connection-config/update', //更新
    remove: '/connection-config/remove', //删除
    list: '/connection-config/list', //列表    
    listPage: '/connection-config/list-page', //列表        
}

// backupConfigApiUrl
const backupApiUrl = {
    add: '/backup/add', //新增
    update: '/backup/remove', //删除
    listPage: '/backup/list-page', //分页列表    
}

// restoreConfigApiUrl
const restoreApiUrl = {
    add: '/restore/add', //新增
    remove: '/restore/remove', //删除
    listPage: '/restore/list-page', //分页列表    
}



export default {
    connectionConfigApiUrl,
    backupApiUrl,
    restoreApiUrl,
}
