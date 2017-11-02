mui.init({
	swipeBack: false //启用右滑关闭功能
})
var sign = false;
mui.plusReady(function() {
	//通讯录
	var telPicker = new mui.PopPicker();
	//第一步操作
	document.getElementById('btn_step1').addEventListener('tap', function() {
		// var next_index = Array.prototype.indexOf.call(document.querySelectorAll('.div-step'),this.parentNode.nextElementSibling);
		if(validStep1Form()) {
			this.parentNode.classList.add('mui-hidden');
			this.parentNode.nextElementSibling.classList.remove('mui-hidden');
			document.querySelectorAll("#progressbar li")[1].classList.add('active');
		}
	});
	//第二步操作
	document.getElementById('btn_step2').addEventListener('tap', function() {
		if(validStep2Form()) {
			this.parentNode.classList.add('mui-hidden');
			this.parentNode.nextElementSibling.classList.remove('mui-hidden');
			document.querySelectorAll("#progressbar li")[2].classList.add('active');
		}
	});
	//完成
	document.getElementById('btn_ok').addEventListener('tap', function() {
		mui(this).button('loading');
		if(true == sign) return false; //防止重复点击
		// 提交认证
		vm.usercredit.utel = localStorage.getItem('$account');
		app.fn_ajax('/addUserCredit', vm.usercredit, function(rsp) {
			sign = true;
			if(rsp && rsp.code === 0) {
				mui.alert('提交成功,审核中', '温馨提示', function() {
					mui('#btn_ok').button('reset');
					mui.back();
				});
			} else {
				sign = false;
				mui.toast(rsp.msg);
			}
		});
	}, false);
	//添加关系人
	document.getElementById('relativeTelPicker').addEventListener('tap', function(event) {
		plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
			var telArr = new Array();
			addressbook.find(["displayName", "phoneNumbers"], function(contacts) {
				for(var i = 0, n = contacts.length; i < n; i++) {
					var dataObj = new Object();
					dataObj.text = contacts[i].displayName;
					if(contacts[i].phoneNumbers.length > 0) {
						dataObj.value = contacts[i].phoneNumbers[0].value;
					}
					telArr[i] = dataObj;
				}
				telPicker.setData(telArr);
				telPicker.show(function(items) {
					if(!items[0]) {
						document.getElementById('inp_party').value = items[0].text;
						document.getElementById('inp_partyTel').value = items[0].value;
					}
					//返回 false 可以阻止选择框的关闭
					//return false;
				});
			}, function() {
				alert("error");
			}, {
				multiple: true
			});
		}, function(e) {
			alert("Get address book failed: " + e.message);
		});
	}, true);
	//添加联系人
	document.getElementById('contactsPicker').addEventListener('tap', function(event) {
		plus.contacts.getAddressBook(plus.contacts.ADDRESSBOOK_PHONE, function(addressbook) {
			var telArr = new Array();
			addressbook.find(["displayName", "phoneNumbers"], function(contacts) {
				for(var i = 0, n = contacts.length; i < n; i++) {
					var dataObj = new Object();
					dataObj.text = contacts[i].displayName;
					if(contacts[i].phoneNumbers.length > 0) {
						dataObj.value = contacts[i].phoneNumbers[0].value;
					}
					telArr[i] = dataObj;
				}
				telPicker.setData(telArr);
				telPicker.show(function(items) {
					if(!items[0]) {
						document.getElementById('inp_contacts').value = items[0].text;
						document.getElementById('inp_contactTel').value = items[0].value;
					}
					//返回 false 可以阻止选择框的关闭
					//return false;
				});
			}, function() {
				alert("error");
			}, {
				multiple: true
			});
		}, function(e) {
			alert("Get address book failed: " + e.message);
		});
	}, true);
	// 点击上传图片
	mui('.xs-div-step2').on('tap', '.list-img .xs-div-card', function() {
		var size = null;
		var self = this;
		plus.gallery.pick(function(e) {
			var name = e.substr(e.lastIndexOf('/') + 1);
			plus.zip.compressImage({
				src: e,
				dst: '_doc/' + name,
				overwrite: true,
				quality: 50
			}, function(zip) {
				size += zip.size
				//console.log("filesize:" + zip.size + ",totalsize:" + size);
				if(size > (10 * 1024 * 1024)) {
					return mui.toast('文件超大,请重新选择');
				}
				self.innerHTML = '<img src="' + zip.target + '" style="width:100%;height:100%;" />'
				switch(self.id) {
					case 'd-card-1':
						vm.usercredit.cardFront = name;
						break;
					case 'd-card-2':
						vm.usercredit.cardBack = name;
						break;
					case 'd-card-3':
						vm.usercredit.cardHand = name;
						break;
					default:
						break;
				}
			}, function(zipe) {
				mui.toast('压缩失败！')
			});
		}, function(e) {
			mui.toast('取消选择图片');
		}, {
			filter: "image",
			multiple: false
		});
	});
});

var vm = new Vue({
	el: '#v_app',
	data: {
		usercredit: {}
	}
})
/**
 * step1表单验证 
 */
function validStep1Form() {
	vm.usercredit.metel = document.getElementById("inp_tel").value;
	vm.usercredit.telpwd = document.getElementById("inp_telpwd").value;
	vm.usercredit.alipay = document.getElementById('inp_alipay').value;
	vm.usercredit.qq = document.getElementById('inp_qq').value;
	vm.usercredit.partyName = document.getElementById('inp_party').value;
	vm.usercredit.partyTel = document.getElementById('inp_partyTel').value;
	vm.usercredit.contactsName = document.getElementById('inp_contacts').value;
	vm.usercredit.contactsTel = document.getElementById('inp_contactsTel').value;

	if(!vm.usercredit.metel) {
		mui.toast("借款本人手机号不能为空");
		return false;
	}
	if(vm.usercredit.metel.length != 11) {
		mui.toast("借款本人手机号为11位");
		return false;
	}
	if(checkPhone(vm.usercredit.metel)) {
		mui.toast("请输入有效的手机号码");
		return false;
	}
	if(!vm.usercredit.telpwd) {
		mui.toast("手机服务密码不能为空");
		return false;
	}
	if(!vm.usercredit.alipay) {
		mui.toast("支付宝帐号不能为空");
		return false;
	}
	if(!vm.usercredit.qq) {
		mui.toast("QQ号码不能为空");
		return false;
	}
	/*if(!vm.usercredit.partyName && !vm.usercredit.partyTel) {
		mui.toast("关系人不能为空");
		return false;
	}
	if(!vm.usercredit.contactsName && !vm.usercredit.contactsTel) {
		mui.toast("常用联系人不能为空");
		return false;
	}*/
	return true;
}

function validStep2Form() {
	if(!vm.usercredit.cardFront) {
		mui.toast("身份证正面照片不能为空");
		return false;
	}
	if(!vm.usercredit.cardBack) {
		mui.toast("身份证反面照片不能为空");
		return false;
	}
	if(!vm.usercredit.cardHand) {
		mui.toast("手持身份证照片不能为空");
		return false;
	}
	return true;
}