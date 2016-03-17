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

$('#order_info input[type=text]').click(function(){
	$(this).val('');
});


var oProgress = {
  'year' : {
    now : 10 //进度10%
  },
  'quarter' : {
    now : 20 //进度20%
  },
  'week' : {
    now : 30
  }
};
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
