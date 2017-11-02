/**
 * 
 * @param {Object} percent：绘制圆环百分比, 范围[0, 100] 
 */
var drawRing = function(percent) {
	//创建canvas元素
	var canvas = document.getElementById('canvas');
	//获取画图环境，指明为2d
	var context = canvas.getContext('2d');
	//Canvas中心点x轴坐标
	var centerX = canvas.width / 2;
	//Canvas中心点y轴坐标
	var centerY = canvas.height / 2;
	//将360度分成100份，那么每一份就是rad度
	var rad = Math.PI * 2 / 10000;
	var speed = 0;

	// 绘制背景圆圈
	function bgCircle() {
		// save和restore可以保证样式属性只运用于该段canvas元素
		context.save();
		// 起始一条路径
		context.beginPath();
		// 设置当前线条的宽度
		context.lineWidth = 25;
		// 设置笔触的颜色
		context.strokeStyle = "#ccc";
		context.lineCap = "round";
		var radius = centerX - context.lineWidth;
		// 用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
		context.arc(centerX, centerY, radius, 0, Math.PI * 2, false);
		// 绘制已定义的路径
		context.stroke();
		// 路径结束
		context.closePath();
		context.restore();
	}

	//绘制运动圆环
	function blueCircle(n) {
		context.save();
		context.strokeStyle = "#3399FF"; //设置描边样式
		context.lineWidth = 25; //设置线宽
		context.lineCap = "round";
		var radius = centerX - context.lineWidth;
		context.beginPath(); //路径开始
		context.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + n * rad, false);
		// 绘制
		context.stroke();
		context.closePath();
		context.restore();
	}

	function fillTxt() {
		context.save();
		var fontSize = 40;
		context.font = fontSize + "px Arial"; //设置字体大小和字体
		context.fillStyle = "#3399FF"; //设置描边样式
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		// 绘制字体，并且指定位置
		context.fillText('贷款额度', centerX, centerY - 30); // 执行绘制
		context.restore();
	}
	//百分比文字绘制
	function fillNum(n) {
		context.save();
		var fontSize = 40;
		context.font = fontSize + "px Arial"; //设置字体大小和字体
		context.fillStyle = "#3399FF"; //设置描边样式
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		var textWidth = context.measureText(n.toFixed(0) + "%").width;
		// 绘制字体，并且指定位置
		context.fillText(n.toFixed(0), centerX, centerY + fontSize / 2); // 执行绘制
		context.restore();
	}

	//动画循环
	(function drawFrame() {
		window.requestAnimationFrame(drawFrame);
		context.clearRect(0, 0, canvas.width, canvas.height);
		bgCircle();
		fillTxt();
		fillNum(speed);
		blueCircle(speed);
		if(speed >= percent) return; //speed = 0 一直循环
		speed += 100;
	}());
}