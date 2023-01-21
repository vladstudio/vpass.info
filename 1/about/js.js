
$('#menu a, .inline_nav a, a.nav').on('click', function(){
	$('#menu a').removeClass('selected');
	$('#menu a[href='+$(this).attr('href')+']').addClass('selected');
	$('div.section').hide();
	$( $(this).attr('href') ).show();
	window.location.hash = $(this).attr('href');
	$('html, body').animate({ scrollTop: 0 }, 0);
	return false;
});

if (window.location.hash)
{
	$('#menu a[href='+window.location.hash+']').trigger('click');
}
