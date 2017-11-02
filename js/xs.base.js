var v = "v1.0";
var httpUrl = "http://192.168.1.85:8080/api";
// app唯一键
var app_key = "idou";
var app_secret = "QEPWQUSEPRVDVY5dfa5b32e92a484f95c897513dc624e5";

function getaniShow() {
	var aniShow = 'pop-in';
	if(mui.os.android) {
		var androidlist = document.querySelectorAll('ios-only');
		if(androidlist) {
			mui.each(androidlist, function(num, obj) {
				obj.style.display = 'none';
			});
		}

		if(parseFloat(mui.os.version) < 4.4) {
			aniShow = 'slide-in-right';
		}
	}
	return aniShow;
}

/**
 * 手机号码检验
 * @param {Object} phone
 */
function checkPhone(phone) {
	var reg = /^(0|86|17951)?(13[0-9]|15[0-9]|18[0-9]|14[57])[0-9]{8}$/;
	phone = phone || '';
	return !reg.test(phone);
}
/**
 * 获取当前时间戳(以s为单位)
 * 
 */
function getTimestampS() {
	return(Date.parse(new Date()) / 1000).toString();
}

/**
 * 获取当前时间戳(以毫秒为单位)
 */
function getTimestampMs() {
	//return new Date().getTime();
	return (new Date()).valueOf();
}

/**
 * 获取sign签名 
 * 签名(md5(param+key+secret))
 * @param {Object} params
 */
function getSign(params) {
	return b64_md5(JSON.stringify(params) + app_key + app_secret);
}

/**
 * 获取请求数据的
 * @param {Object} params
 */
function getReqData(params) {
	params = params || {};
	var data = {
		appkey: app_key, //appID
		params: JSON.stringify(params), //Json字符串
		timestamp: getTimestampMs(), //时间戳
		digest: getSign(params), //签名摘要
		version: v //app版本
	}
	return data;
}

/**
 * ajax请求封装
 */
window.app = {
	fn_ajax: function(api, data, callback) {
		data = data || {};
		callback = callback || $.noop;
		mui.ajax(httpUrl + api, {
			data: getReqData(data),
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			success: function(data) {
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				return callback({
					code: -3,
					msg: '无法连接到服务器'
				});
			}
		});
	}
}

/**
 * 检测对象是否是空对象
 * 
 * @param {Object} obj
 */
function isEmpty(obj){
	for (var v in obj) {
		return false;
	}
	return true;
}
