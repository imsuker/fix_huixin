/****
 *
 *  全局的一些配置
 * ***/

//各个产品的进度条状态，根据时间进度和产品要求做调整
//now:10 代表进度为10%
var oProgress = {
  'year' : {   //huixin_year.html
    now : 10 //进度10%
  },
  'quarter' : { //huixin_quarter.html
    now : 20 //进度20%
  },
  'week' : {  //huixin_week.html
    now : 30
  }
};
//各个产品页面，点击委托协议书后，显示的甲方名字
  var aJiafang = {
    'huixin_week.html' : 'week',
    'huixin_quarter.html' : 'quarter',
    'huixin_year.html' : 'year',
    'zhangwei_year.html' : 'zhangwei'
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
     var name = $('#order_info_name').val();
     var tel = $("#order_info_tel").val();
     var product = $.trim($("#fix_title").text());
     if(!name || !tel){
        alert('请输入姓名或电话号');
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
        jiafang : sJiafang
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
    dJia.html(sJiafang);
    dYi.html(sYifang);
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
});
