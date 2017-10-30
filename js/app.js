var v = "v1.0";
var httpUrl = "http://192.168.0.78:8080/api";
// app唯一键
var app_key = "idou";
var app_secret = "QEPWQUSEPRVDVY5dfa5b32e92a484f95c897513dc624e5";

/**
 * 获取时间戳
 */
function getTimestamp() {
	return(Date.parse(new Date()) / 1000).toString();
}

/**
 * 获取sign签名 
 * 签名(md5(param+key+secret))
 * @param {Object} params
 */
function getSign(params) {
	return b64_md5(params + app_key + app_secret);
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
		timestamp: getTimestamp(), //时间戳
		digest: getSign(params), //签名摘要
		version: v //app版本
	}
	return data;
}

(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.utel = loginInfo.utel || '';
		var upwd = loginInfo.upwd || '';

		if(loginInfo.utel.length != 11) {
			return callback('手机号最短为 11 个字符');
		}
		if(upwd.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		if(checkPhone(loginInfo.utel)) {
			return callback('请输入有效的手机号码');
		}
		loginInfo.upwd = hex_md5(upwd);
		$.ajax(httpUrl + "/login", {
			data: loginInfo,
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			success: function(data) {
				if(data.code == 0) {
					plus.nativeUI.toast('登录成功');
					return owner.createUser(loginInfo, data, callback);
				} else {
					return callback({
						Code: data.code,
						Msg: data.msg
					});
				}
			},
			error: function(xhr, type, errorThrown) {
				return callback({
					Code: -3,
					Msg: '无法连接到服务器'
				});
			}
		});
	};

	/**
	 * 创建用户信息
	 * @param {Object} data
	 * @param {Object} callback
	 */
	owner.createUser = function(info, data, callback) {
		info = info || {};
		data = data || {};
		//保存登录信息
		localStorage.setItem('$user', JSON.stringify(info));
		localStorage.setItem('$credit', data.isCredit);
		localStorage.setItem('$account', info.utel);
		return callback();
	}

	/**
	 * 获取当前用户信息
	 **/
	owner.getUser = function() {
		var userInfo = localStorage.getItem('$user') || "{}";
		return JSON.parse(userInfo);
	};

	/**
	 * 退出登录
	 */
	owner.logout = function(options, callback) {
		callback = callback || $.noop;
		var data = getReqData()
		//		mui.ajax(httpUrl,{
		//			data:data,
		//			dataType:'json',//服务器返回json格式数据
		//			type:'get',//HTTP请求类型
		//			timeout:10000,//超时时间设置为10秒；
		//			success:function(data){
		//				logData(data);
		//				logoutSuccess(data);
		//			},
		//			error:function(xhr,type,errorThrown){
		//				
		//			}
		//		});
		return callback();
	}
	/**
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		
		regInfo.utel = regInfo.utel || '';
		regInfo.upwd = regInfo.upwd || '';
		regInfo.code = regInfo.code || '';
		
		if(regInfo.utel.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.upwd.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		mui.post(httpUrl + "/reg", regInfo, function(data) {
			return callback();
		}, 'json');
	};

	/**
	 * 找回密码
	 **/
	owner.forgetPassword = function(email, callback) {
		callback = callback || $.noop;
		if(!checkEmail(email)) {
			return callback('邮箱地址不合法');
		}
		return callback(null, '新的随机密码已经发送到您的邮箱，请查收邮件。');
	};

	//一般情况下设置anishow
	owner.getaniShow = function() {
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
	var checkPhone = function(phone) {
		var reg = /^(0|86|17951)?(13[0-9]|15[0-9]|18[0-9]|14[57])[0-9]{8}$/;
		phone = phone || '';
		return !reg.test(phone);
	}
}(mui, window.app = {}));