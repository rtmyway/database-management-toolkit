import SecurityCommon from "../commons/SecurityCommon";

const encryptObj = {
	mode: 0, //0:不加密 1:加密
	salt: '2019', //
}

/**
 * 携带数据
 */
const carryObject = {
	data: {
		version: {},
		operator: {},
		businessData: {},
	},

	setDataItem: function(key, value) {
		this.data[key] = value;
		this.save();
	},
	load: function() {
		let data = localStorage.getItem("carryObject");
		let content;
		try {
			if (encryptObj.mode == 1) {
				content = unescape(SecurityCommon.decrypt(data, encryptObj.salt));
			} else {
				content = data;
			}
			let tmpData = JSON.parse(content);
			if (tmpData) {
				this.data = tmpData;
			}
		} catch (err) {

		}
		return this.data;
	},
	save: function() {
		let data = JSON.stringify(this.data);
		let content;
		if (encryptObj.mode == 1) {
			content = common.SecurityCommon(escape(data), encryptObj.salt);
		} else {
			content = data;
		}
		localStorage.setItem("carryObject", content);
	},
	remove: function() {
		localStorage.removeItem("carryObject");
	}
};

export default {
  carryObject:carryObject,
}
