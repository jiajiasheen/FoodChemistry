$(document).ready(function() {

	$('.change_info').on('click', function(event){
		var button = $(event.target);
		var sibs = button.parent().siblings();
		var form = $('#change_menu');
		$("#change_menu input[name=item_id]").val(sibs[1].textContent.trim());
		$("#change_menu input[name=item_name]").val(sibs[2].textContent.trim());
		$("#change_menu input[name=desc]").val(sibs[3].textContent.trim());
		$("#change_menu input[name=allergens]").val(sibs[4].textContent.trim());
		$("#change_menu input[name=price]").val(sibs[5].textContent.trim());
		//var form = $('$change_menu');
	});

	$('.delete_item').on('click', function(event){
		var button = $(event.target);
		var sibs = button.parent().siblings();
		var form = $('#change_menu');
		$("#delete_menu input[name=item_id]").val(sibs[1].textContent.trim());
		$("#delete_menu input[name=item_name]").val(sibs[2].textContent.trim());
	});

	$('.change_img').on('click', function(event) {
		$('.p_item_id').css('display', 'none');
		var button = $(event.target);
		var sibs = button.parent().siblings();
		var form = $('#change_menu');
		$("#change_menu input[name=item_id]").val(sibs[1].textContent.trim());
	});
});
