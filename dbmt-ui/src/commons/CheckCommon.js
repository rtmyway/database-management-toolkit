/**
 * 判断是否空值
 * @param val
 */
export function isEmpty(val) {
	return val == undefined || val == null || val == '' || val.toLowerCase == 'null';
}

export default {
    isEmpty : isEmpty,
};
