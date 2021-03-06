/****
 *
 *  全局的一些配置
 * ***/

//各个产品的进度条状态，根据时间进度和产品要求做调整
//now:10 代表进度为10%
var oProgress = {
  'year' : {   //huixin_year.html
    now : 0 //进度10%
  },
  'quarter' : { //huixin_quarter.html
    now : 0 //进度20%
  },
  'week' : {  //huixin_week.html
    now : 100 
  },
  'week-201604-2' : {  //huixin_week_201604_2.html
    now :100 
  },
  'week-201604-3' : {  //huixin_week_201604_3.html
    now :66 
  }
};
//各个产品页面，点击委托协议书后，显示的甲方名字
  var aJiafang = {
    'huixin_week_201604_2.html' : '赵海峰(主操盘手)',
    'huixin_week.html' : '赵海峰(主操盘手)',
    'huixin_quarter.html' : '赵海峰(主操盘手)',
    'huixin_year.html' : '赵海峰(主操盘手)',
    'zhangwei_month.html' : '张伟(主操盘手)'
  };





/***
 *
 *  流程开始
 * **/
var tab_lis = $('#charts_tabs li');
var tab_imgs = $('#charts_box img');
tab_lis.click(function(){
	var id = $(this).attr('to');
	if(!$(this).hasClass('on')){
		var len = tab_lis.size();
		for (var i = 0; i < len; i++) {
			tab_lis.eq(i).removeClass('on');
			tab_imgs.removeClass('on');
		};
		$(this).addClass('on');
		$('#' + id).addClass('on');
	}
});


//画进度条
$(function(){
  $.each(oProgress, function(key, oData){
    var dParent = $(".id-"+key);
    if(dParent.size() == 0){
      return;
    }
    dParent.find('.progress_now').html('已完成'+oData.now+'%').show();;
    dParent.find('.progress_finish').css('width', oData.now/100*200 + 'px');
    dParent.find('.progress_box').show();
  });
});



//立即预约
$(function(){
  var doing = false;
  $("#go_order").click(function(){
    if($(this).hasClass('trading')){
      alert('该产品目前无法预约');
      return;
    }
    var agree = $(".check_agreement input").prop('checked');
    if(!agree){
      alert('需要同意并遵守"协议书"才可以预约该产品!');
      return;
    }
     var name = $('#order_info_name').val();
     var tel = $("#order_info_tel").val();
     var product = $.trim($("#fix_title").text());
     if(!name || !tel){
        alert('请输入姓名或电话号');
        return;
     }
     if($("#go_order").val() == "预约成功"){
        return;
     }
     if(doing){
       alert('正在预约...');
       return;
     }
     $("#go_order").val('正在预约...');
    doing = true;
    var url = '/action/public/v3/closed_fund_leads';
    $.post(url, {
      username : name,
      phone : tel,
      title : product
    }, function(rs){
      if(rs && rs.error_code == 0){
        alert('预约成功！稍后会有工作人员联系您！');
        $("#go_order").val('预约成功');
      }else{
        doing = false;
        $("#go_order").val('立即预约');
        alert((rs && rs.error_msg) || "失败，请联系客服。");
      }
    });
  });
});
//委托书携带用户名

$(function(){
  $(".agreement_book").click(function(){
    var sJiafang = "";
    $.each(aJiafang, function(key, oValue){
        if(location.href.indexOf(key) != -1){
          sJiafang = oValue;
        }
    });
    var href = $(this).attr('href').replace(/\?.*/g,'') +'?'+ $.param({
        yifang : $('#order_info_name').val() || "",
        jiafang : sJiafang,
        product : $.trim($("#fix_title").text()) || ""
    });
    $(this).attr('href',href);
  });
});


//agreement.html中根据url回写甲方乙方
$(function(){
    var dJia = $("#agreement_jia");
    var dYi = $("#agreement_yi");
    if(dJia.size() == 0){
        return;
    }
    var sJiafang = getQueryString('jiafang') || "";
    var sYifang = getQueryString('yifang') || "";
    var sProduct = getQueryString('product') ||"" ;
    dJia.html(sJiafang);
    dYi.html(sYifang);
    if(sProduct == "老虎&汇赢周盈+201604-1"){
        $("#agreement_money").html('乙方无需向甲方支付委托费，');
    }else if(sProduct == "老虎&Elephant(Forex+Management)"){
        $("#agreement_money").html('乙方应将盈余部分按30%作为委托费支付给甲方，');
    }

    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return null;
    }
});

//方法获取cookie
function getCookie(name)
{
  var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
  if(arr=document.cookie.match(reg)){
    return unescape(arr[2]);
  }
  else{
    return null;
  }
}

//****登录状态回写用户名到顶部
~function(){
  var user_code = getCookie('user_code');
  if(!user_code){
    $('.navbar-right').show();
    return;
  }
  $.getJSON('/api/v1/get_info?type=Profile', function(rs){
    $('.navbar-right').show();
    var name = (rs && rs.realname) || "";
    var phone = (rs && rs.phone) || "";
    var username = (rs && rs.username) || "";
    if(name){
      $("#order_info_name").val(name);
    }
    if(phone){
      $("#order_info_tel").val(phone);
    }
    var sHtml = [
      '<li class="psl_nav_info">',
      '  <div class="psl_nav_info__wrapper">',
      '    <h4 class="psl_nav_info__name">'+username+'</h4>',
      '    <div>',
      '      <a class="psl_nav_info__enter" href="https://www.tigerwit.com/personal/#/personal/invest/position" target="_blank">个人中心</a>',
      '    </div>',
      '  </div>',
      '  <span>',
      '    <a class="psl_nav_info__avatar" href="https://www.tigerwit.com/personal/#/personal/invest/position" target="_blank">',
      '    <img src="/avatar/'+user_code+'_80.jpg" alt="头像" />',
      '    </a>',
      '  </span>',
      '</li>'
    ];
    $(".navbar-right").html(sHtml.join(''));
  });
}();


