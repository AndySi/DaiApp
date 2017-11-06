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
		data = data.data || {};
		//保存登录信息
		localStorage.setItem('$user', JSON.stringify(data));
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

	var checkPhone = function(phone) {
		var reg = /^(0|86|17951)?(13[0-9]|15[0-9]|18[0-9]|14[57])[0-9]{8}$/;
		phone = phone || '';
		return !reg.test(phone);
	}
}(mui, window.app = {}));