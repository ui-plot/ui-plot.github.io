function draw_axis() {
    // 坐标轴箭头大小
    var arrow_angle = 30;
    var arrow_length = 10;
    context.font = "bold 14px Arial"; // 字体设置

    
    // 坐标轴及原点
    context.beginPath();
    context.moveTo(x0 - axis_xminus, y0);
    context.lineTo(x0 + x_total + x_bound/2, y0); // x轴，比最大bar突出一半的页边距bound.
    context.moveTo(x0, y0 + axis_yminus);
    context.lineTo(x0, height - y0 - y_bound/2); // y轴.
    context.fillText("0", x0+xlabel_right, y0 + xlabel_down);
  
    //x arrow:
    context.moveTo(x0 + x_total + x_bound/2, y0);
    context.lineTo(x0 + x_total + x_bound/2 - arrow_length * Math.cos(arrow_angle / 180 * Math.PI), y0 - arrow_length * Math.sin(arrow_angle / 180 * Math.PI));
    context.moveTo(x0 + x_total + x_bound/2, y0);
    context.lineTo(x0 + x_total + x_bound/2 - arrow_length * Math.cos(arrow_angle / 180 * Math.PI), y0 + arrow_length * Math.sin(arrow_angle / 180 * Math.PI));
    //y arrow:
    context.moveTo(x0, height - y0 - y_bound/2); // x轴,偏上，也就是小了。
    context.lineTo(x0 - arrow_length * Math.sin(arrow_angle / 180 * Math.PI), height - y0 - y_bound/2 + arrow_length * Math.cos(arrow_angle / 180 * Math.PI));//y轴，
    context.moveTo(x0, height - y0 - y_bound/2); // x轴,偏上，也就是小了。
    context.lineTo(x0 + arrow_length * Math.sin(arrow_angle / 180 * Math.PI), height - y0 - y_bound/2 + arrow_length * Math.cos(arrow_angle / 180 * Math.PI));//y轴，
  
    context.stroke();
    // label在端点
    context.textAlign = "left";
    context.fillText("U (V)", x0 + x_total + x_bound/2, y0);
    context.fillText("I (mA)", x0, y0 - y_total - y_bound/2);
}

function draw_label() {  
  var ui_text = document.getElementById('ui_text');
  var ori_cont = ui_text.value;
  var cont = ToCDB(ori_cont);
  allTextLines = cont.split(/\r\n|\n/); //全局变量, plot_line等函数要访问.

  // 自动判断x、y坐标轴的画图范围
  var line = allTextLines[0].split(',');
  var volt = parseFloat(line[0]);
  var current = parseFloat(line[1]);
  var xmin = volt;
  var xmax = volt;
  var ymin = current;
  var ymax = current;
  for (var i = 1; i < allTextLines.length; i++) {
    var line = allTextLines[i].split(',');
    var volt = parseFloat(line[0]);
    var current = parseFloat(line[1]);
    if (volt > xmax) { xmax = volt; }
    if (volt < xmin) { xmin = volt; }
    if (current > ymax) { ymax = current; }
    if (current < ymin) { ymin = current; }
  }
  
  var x_range = parseInt(xmax * 10 ** floatn) / 10 ** floatn - parseInt(xmin ** 10 ** floatn) / 10 ** floatn;
  var y_range = parseInt(ymax * 10 ** floatn) / 10 ** floatn - parseInt(ymin ** 10 ** floatn) / 10 ** floatn;
  var x_step = parseInt((x_range / x_ntick + 0.5 / 10**x_dec) * 10**x_dec) / 10**x_dec;
  var y_step = parseInt((y_range / y_ntick + 0.5 / 10**y_dec) * 10**y_dec) / 10**y_dec;
  x_ratio = x_total / x_range; // 全局变量，画点和直线时要用到.
  y_ratio = y_total / y_range;

  //画坐标轴
  // xlabel
  context.textAlign = "center";
  for (i = 1; i <= x_ntick; i++) {
    var x_tick = parseInt((x_step + 0.1 / 10**x_dec) * i * 10**x_dec) / 10**x_dec; // 确定xlabel的值
    context.fillText(x_tick.toFixed(3), x0 + x_step * x_ratio * i + xlabel_right, y0 + xlabel_down);
  }

  // ylabel
  context.textAlign = "right";
  for (i = 1; i <= y_ntick; i++) {
    var y_tick = parseInt((y_step + 0.1 / 10**y_dec) * i * 10**y_dec) / 10**y_dec; // 确定ylabel的值
    context.fillText(y_tick.toFixed(2), x0+xlabel_right, y0 - y_step * y_ratio * i + ylabel_down);
  }

  // x_ticks_bar and y_ticks_bar.
  context.beginPath();
  // x ticks
  for (i = 1; i <= x_ntick; i++) {
    context.moveTo(x0 + x_step * x_ratio * i, y0);
    context.lineTo(x0 + x_step * x_ratio * i, y0 - y_bar);
  }
  // y ticks
  for (i = 1; i <= y_ntick; i++) {
    context.moveTo(x0, y0 - y_step * y_ratio * i);
    context.lineTo(x0 + x_bar, y0 - y_step * y_ratio * i);
  }
  context.stroke();
}

function draw_point(px, py) {
  context.beginPath();
  // point_size为叉号的大小。
  // x0,y0为坐标原点。
  // floatn为所画点的精度。
  // x_ratio, y_ratio代表所画点的真实坐标到在画布上坐标的转化系数。
  context.moveTo(x0 + (parseInt(px * 10 ** floatn) / 10 ** floatn * x_ratio - 0.5 * point_size), y0 - (parseInt(py * 10 ** floatn) / 10 ** floatn * y_ratio + 0.5 * point_size));
  context.lineTo(x0 + (parseInt(px * 10 ** floatn) / 10 ** floatn * x_ratio + 0.5 * point_size), y0 - (parseInt(py * 10 ** floatn) / 10 ** floatn * y_ratio - 0.5 * point_size));

  context.moveTo(x0 + (parseInt(px * 10 ** floatn) / 10 ** floatn * x_ratio + 0.5 * point_size), y0 - (parseInt(py * 10 ** floatn) / 10 ** floatn * y_ratio + 0.5 * point_size));
  context.lineTo(x0 + (parseInt(px * 10 ** floatn) / 10 ** floatn * x_ratio - 0.5 * point_size), y0 - (parseInt(py * 10 ** floatn) / 10 ** floatn * y_ratio - 0.5 * point_size));
  context.stroke();
}

function draw_line(px1, py1, px2, py2) {
  context.moveTo(x0 + (parseInt(px1 * 10 ** floatn) / 10 ** floatn * x_ratio), y0 - (parseInt(py1 * 10 ** floatn) / 10 ** floatn * y_ratio));

  context.lineTo(x0 + (parseInt(px2 * 10 ** floatn) / 10 ** floatn * x_ratio), y0 - (parseInt(py2 * 10 ** floatn) / 10 ** floatn * y_ratio));

}

function ToCDB(str) {
  var tmp = "";
  for (var i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 65248 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248);
    }
    else {
      tmp += String.fromCharCode(str.charCodeAt(i));
    }
  }
  return tmp;
}


function plot_line() {
  // 画点
  for (var i = 0; i < allTextLines.length; i++) {
    var line = allTextLines[i].split(',');
    var volt = parseFloat(line[0]);
    var current = parseFloat(line[1]);
    draw_point(volt, current);
  }

  //画线
  context.beginPath();
  for (var i = 1; i < allTextLines.length; i++) {
    var line1 = allTextLines[i].split(',');
    var line0 = allTextLines[i - 1].split(',');
    var volt0 = parseFloat(line0[0]);
    var current0 = parseFloat(line0[1]);
    var volt1 = parseFloat(line1[0]);
    var current1 = parseFloat(line1[1]);
    draw_line(volt0, current0, volt1, current1);
  }
  context.stroke();
}


function plot_exp() {
  //画点
  for (var i = 0; i < allTextLines.length; i++) {
    var line = allTextLines[i].split(',');
    var volt = parseFloat(line[0]);
    var current = parseFloat(line[1]);
    draw_point(volt, current);
  }

  // 拟合指数曲线 f(x)=a*e^(bx)+c
  // 首先拟合g(x)=a*e^(bx)，若存在(0,0)点，将作为强约束条件定出参数c。
  var y_sum = 0;
  var xy_sum = 0;
  var x2y_sum = 0;
  var ylny_sum = 0;
  var xylny_sum = 0;
  var has0 = 0;
  var has_i = 0;
  // 根据最小二乘法，获得各样本点不同形式的求和值
  for (i = 0; i < allTextLines.length; i++) {
    var line = allTextLines[i].split(',');
    var x1 = parseFloat(line[0]);
    var y1 = parseFloat(line[1]);

    //(0,0)点的特殊处理，防止出现参数a=0。
    if (y1 - 0 < 1e-6) {
      y1 = y1 + 0.001;
      has0 = 1;
      has_i = i;
    }

    y_sum = y_sum + y1;
    xy_sum = xy_sum + x1 * y1;
    x2y_sum = x2y_sum + x1 ** 2 * y1;
    ylny_sum = ylny_sum + y1 * Math.log(y1);
    xylny_sum = xylny_sum + x1 * y1 * Math.log(y1);
  }
//得到指数函数的参数a,b。
  var a0 = (x2y_sum * ylny_sum - xy_sum * xylny_sum) / (y_sum * x2y_sum - xy_sum ** 2);
  var a1 = (y_sum * xylny_sum - xy_sum * ylny_sum) / (y_sum * x2y_sum - xy_sum ** 2);
  var a2 = 0;
  //若存在点(0,0)，作为强约束条件，定出参数c。
  if (has0 == 1) {
    var line0 = allTextLines[has_i].split(',');
    var x1 = parseFloat(line0[0]);
    var y1 = parseFloat(line0[1]);
    a2 = y1 - Math.exp(a0) * Math.exp(a1 * x1);
  }

  // 画线
  context.beginPath();
  for (i = 1; i < allTextLines.length; i++) {
    var line0 = allTextLines[i - 1].split(',');
    var line1 = allTextLines[i].split(',');
    var x1 = parseFloat(line0[0]);
    var x2 = parseFloat(line1[0]);

    for (j = 0; j <= n_insert; j++) {
      var x_start = (x2 - x1) * j / (n_insert + 1) + x1;
      var x_end = x1 + (x2 - x1) * (j + 1) / (n_insert + 1);
      var y_start = Math.exp(a0) * Math.exp(a1 * x_start) + a2;
      var y_end = Math.exp(a0) * Math.exp(a1 * x_end) + a2;
      draw_line(x_start, y_start, x_end, y_end);
    }
  }
  context.stroke();
}

function plot_smooth() {
  //画点
  for (var i = 0; i < allTextLines.length; i++) {
    var line = allTextLines[i].split(',');
    var volt = parseFloat(line[0]);
    var current = parseFloat(line[1]);
    draw_point(volt, current);
  }

  // 前三个点P1,P2,P3唯一确定一条二次曲线
  // f(x)=a1*x^2+b1*x+c
  var line0 = allTextLines[0].split(',');
  var line1 = allTextLines[1].split(',');
  var line2 = allTextLines[2].split(',');
  var x1 = parseFloat(line0[0]);
  var y1 = parseFloat(line0[1]);
  var x2 = parseFloat(line1[0]);
  var y2 = parseFloat(line1[1]);
  var x3 = parseFloat(line2[0]);
  var y3 = parseFloat(line2[1]);

  var a1 = ((y1 - y2) * (x1 - x3) - (y1 - y3) * (x1 - x2)) / ((x1 ** 2 - x2 ** 2) * (x1 - x3) - (x1 ** 2 - x3 ** 2) * (x1 - x2));
  var b1 = ((y1 - y2) * (x1 ** 2 - x3 ** 2) - (y1 - y3) * (x1 ** 2 - x2 ** 2)) / ((x1 - x2) * (x1 ** 2 - x3 ** 2) - (x1 - x3) * (x1 ** 2 - x2 ** 2));
  var c1 = y1 - a1 * x1 ** 2 - b1 * x1;

  //画线
  // 沿f(x)绘出P1到P2，和P2到P3之间的路径.      
  context.beginPath();
  for (j = 0; j <= n_insert; j++) {
    // 1
    var x_start = (x2 - x1) * j / (n_insert + 1) + x1;
    var x_end = x1 + (x2 - x1) * (j + 1) / (n_insert + 1);
    //alert(x1);alert(x2);alert(j);alert(n_insert);
    var y_start = a1 * x_start ** 2 + b1 * x_start + c1;
    var y_end = a1 * x_end ** 2 + b1 * x_end + c1;
    draw_line(x_start, y_start, x_end, y_end);
  }

  for (j = 0; j <= n_insert; j++) {
    var x_start = x2 + (x3 - x2) * j / (n_insert + 1);
    var x_end = x2 + (x3 - x2) * (j + 1) / (n_insert + 1);

    var y_start = a1 * x_start ** 2 + b1 * x_start + c1;
    var y_end = a1 * x_end ** 2 + b1 * x_end + c1;

    draw_line(x_start, y_start, x_end, y_end);

  }

  // 过P3,P4，且在P3点处导数与df(P3)/dx相同，可确定一条二次曲线f2(x)
  // 沿曲线f2(x)绘出P3到P4之间的光滑路径。
  // 依此类推，得到通过后续所有点的光滑路径。
  for (i = 3; i < allTextLines.length; i++) {

    var line0 = allTextLines[i - 1].split(',');
    var line1 = allTextLines[i].split(',');
    var x1 = parseFloat(line0[0]);
    var y1 = parseFloat(line0[1]);
    var x2 = parseFloat(line1[0]);
    var y2 = parseFloat(line1[1]);

    var a2 = ((y2 - y1) - (2 * a1 * x1 + b1) * (x2 - x1)) / ((x2 ** 2 - x1 ** 2) - 2 * x1 * (x2 - x1));
    var b2 = 2 * a1 * x1 - 2 * a2 * x1 + b1;
    var c2 = y1 - a2 * x1 ** 2 - b2 * x1;

    for (j = 0; j <= n_insert; j++) {
      var x_start = x1 + (x2 - x1) * j / (n_insert + 1);
      var x_end = x1 + (x2 - x1) * (j + 1) / (n_insert + 1);

      var y_start = a2 * x_start ** 2 + b2 * x_start + c2;
      var y_end = a2 * x_end ** 2 + b2 * x_end + c2;

      draw_line(x_start, y_start, x_end, y_end);
    }
    //定义f2(x)为f(x)，下一轮循环可得到新的f2(x)。
    var a1 = a2;
    var b1 = b2;
    var c1 = c2;
  }
  context.stroke();
}

function clear() {
  var w = width;
  var h = height;
  //通过重置画布大小来清除已有内容
  drawing.width = w; 
  drawing.height = h;
}