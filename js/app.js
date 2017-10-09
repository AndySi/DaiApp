(function($, owner) {
	/**
	 * 用户登录
	 **/
	owner.login = function(loginInfo, callback) {
		callback = callback || $.noop;
		loginInfo = loginInfo || {};
		loginInfo.account = loginInfo.account || '';
		loginInfo.password = loginInfo.password || '';
		loginInfo.token = "gkgkepwqgtgan";
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
		return owner.createState(loginInfo.account, callback);
		
		
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

	owner.createState = function(name, callback) {
		var state = owner.getState();
		state.account = name;
		state.token = "token123456789";
		state.isLogin = true;
		owner.setState(state);
		return callback();
	};
	
	var checkPhone = function(phone) {
		var reg = /^(((13[0-9]|15[0-9]|18[0-9]{1})|147|170|177)+\d{8})$/;
		phone = phone || '';
		return !reg.test(phone);
	}

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
		var users = JSON.parse(localStorage.getItem('$users') || '[]');
		users.push(regInfo);
		localStorage.setItem('$users', JSON.stringify(users));
		return callback();
	};

	/**
	 * 设置当前状态
	 **/
	owner.setState = function(state) {
		state = state || {};
		localStorage.setItem('$state', JSON.stringify(state));
	};

	/**
	 * 获取当前状态
	 **/
	owner.getState = function() {
		var stateText = localStorage.getItem('$state') || "{}";
		return JSON.parse(stateText);
	};

	/**
	 * 要求登陆后才能执行回调函数 
	 */
	owner.loginRequired = function(callback) {
		var state = owner.getState();
		console.log("判断是否登录");
		if(state.isLogin) { //已登录，直接执行
			callback();
		} else {
			// 打开登录页
			$.openWindow({
				url: 'login.html',
				id: 'login',
				show: {
					autoShow: true, //页面loaded事件发生后自动显示，默认为true  
					aniShow: animationType, //页面显示动画，默认为”slide-in-right“；  
					duration: animationTime //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；  
				}
			});
			/*owner.tryAutoLogin(function(data) {
				if(data.Code == 1) { //自动登录成功则执行回调函数
					callback();
				} else { //自动登录失败，显示登录页面
					var v = plus.webview.getWebviewById('login');
					if(!v) {
						mui.toast('error:cannot find login');
					} else {
						v.show('slide-in-right', 300);
					}
				}
			});*/
		}
	}

	/**
	 * 尝试自动登录
	 * @param {Object} callback 接收一个字典参数data，data.Code>0表示登录成功
	 */
	owner.tryAutoLogin = function(callback) {
		var state = owner.getState();
		if(state.isLogin) {
			callback({
				Code: 1
			});
			return;
		}
		var user = JSON.parse(localStorage.getItem('$user'));
		//需要在登录或注册成功时将用户信息保存在localStorage中
		var settings = owner.getSettings();
		if(settings.autoLogin && user && user.name) {
			owner.login(user, callback);
		} else {
			callback({
				Code: -1
			});
		}
	}

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

	/**
	 * 获取应用本地配置
	 **/
	owner.setSettings = function(settings) {
		settings = settings || {};
		localStorage.setItem('$settings', JSON.stringify(settings));
	}

	/**
	 * 设置应用本地配置
	 **/
	owner.getSettings = function() {
		var settingsText = localStorage.getItem('$settings') || "{}";
		return JSON.parse(settingsText);
	}

}(mui, window.app = {}));