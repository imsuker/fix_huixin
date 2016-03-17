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