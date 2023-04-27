// connectionConfigApiUrl
const connectionConfigApiUrl = {
    add: '/connection-config/add', //新增
    update: '/connection-config/update', //更新
    remove: '/connection-config/remove', //删除
    list: '/connection-config/list', //列表    
}

// backupConfigApiUrl
const backupConfigApiUrl = {
    add: '/backup-config/add', //新增
    update: '/backup-config/update', //更新
    remove: '/backup-config/remove', //删除
    list: '/backup-config/list', //列表    
}

// restoreConfigApiUrl
const restoreConfigApiUrl = {
    add: '/restore-config/add', //新增
    update: '/restore-config/update', //更新
    remove: '/restore-config/remove', //删除
    list: '/restore-config/list', //列表    
}

// flashbackPolicyApiUrl
const flashbackPolicyApiUrl = {
    add: '/flashback-policy/add', //新增
    update: '/flashback-policy/update', //更新
    remove: '/flashback-policy/remove', //删除
    list: '/flashback-policy/list', //列表    
}

export default {
    connectionConfigApiUrl,
    backupConfigApiUrl,
    restoreConfigApiUrl,
    flashbackPolicyApiUrl
}
