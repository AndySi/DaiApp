(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		if(loginInfo.account.length != 11) {
			return callback('手机号最短为 11 个字符');
		}
		if(loginInfo.password.length < 6) {
			return callback('密码最短为 6 个字符');
		}
		if(checkPhone(loginInfo.account)) {
			return callback('请输入有效的手机号码');
		}
		
		plus.nativeUI.toast('登录成功');
		return owner.createUser(loginInfo, callback);
		
		
		/*$.ajax("http://localhost:8080/", {
			data: loginInfo,
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 10000, //超时时间设置为10秒；
			success: function(data) {
				if(data.Code == 1) {
					plus.nativeUI.toast('登录成功');
					var state = owner.defaultState; //登录后用默认State覆盖现有的State
					state.isLogin = true; //标记已登录
					state.user = data.Data; //保存用户信息
					owner.setState(state);
					//保存登录信息
					localStorage.setItem('$user', JSON.stringify(loginInfo));

					//通知资金变动页面刷新
					var moneyChange = plus.webview.getWebviewById('moneyChange');
					if(moneyChange) {
						mui.fire(moneyChange, 'show');
					}
					//通知其他用户相关页面更新
				}
				return callback(data);
			},
			error: function(xhr, type, errorThrown) {
				return callback({
					Code: -3,
					Msg: '无法连接到服务器'
				});
			}
		});*/
	};
	
	/**
	 * 创建用户信息
	 * @param {Object} data
	 * @param {Object} callback
	 */
	owner.createUser = function(data, callback){
		data = data || {};
		localStorage.setItem('$user', JSON.stringify(data));
		localStorage.setItem('$account', data.account);
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
	 * 新用户注册
	 **/
	owner.reg = function(regInfo, callback) {
		callback = callback || $.noop;
		regInfo = regInfo || {};
		regInfo.account = regInfo.account || '';
		regInfo.password = regInfo.password || '';
		if(regInfo.account.length < 5) {
			return callback('用户名最短需要 5 个字符');
		}
		if(regInfo.password.length < 6) {
			return callback('密码最短需要 6 个字符');
		}
		if(!checkEmail(regInfo.email)) {
			return callback('邮箱地址不合法');
		}
		var user = JSON.parse(localStorage.getItem('$user') || '[]');
		user.push(regInfo);
		localStorage.setItem('$user', JSON.stringify(user));
		return callback();
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
		var reg = /^(((13[0-9]|15[0-9]|18[0-9]{1})|147|170|177)+\d{8})$/;
		phone = phone || '';
		return !reg.test(phone);
	}
}(mui, window.app = {}));