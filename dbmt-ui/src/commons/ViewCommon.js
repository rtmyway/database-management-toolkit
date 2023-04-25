/**
 * 创建视图对象
 * @param {*} viewConfigs 
 */
export function createViews(viewConfigs = []) {
    let viewTemplate = {
        key: '', // 视图全局唯一码
        title: '', // 视图名称
        visible: false, // 视图是否显示
        changeable: false, // 视图数据是否有变化(通常更新用)
        spinning: false, // 加载中
        data: [], // 视图数据
        onSubViewVisibleHandler: null, // 视图可见性处理
        onSubViewActionHandler: null, // 视图事件处理
        actionKeys: ['CONFIRM', 'REFUSE', 'CANCEL'], // 视图的事件key列表
    };

    let views = [];

    viewConfigs.forEach(element => {
        let tmpView = {...viewTemplate};
        tmpView.key = element.key;
        tmpView.title = element.title;
        tmpView.visible = element.visible;
        tmpView.changeable = element.changeable;
        tmpView.onSubViewVisibleHandler = element.onSubViewVisibleHandler;
        tmpView.onSubViewActionHandler = element.onSubViewActionHandler;
        views.push(tmpView);
    });
    return views;
}



export default {
    createViews : createViews,
};