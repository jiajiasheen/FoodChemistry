$(document).ready(function() {

  var cust_password_check = true;

  $('#new_p2').on('keyup', function(){
    if( $('#new_p2').val() == $('#new_p1').val() ) {
      $('.match').css('display', 'none');
      $('#change_info_button').prop('disabled', false);
      password_check = true;
    } else {
      $('.match').css('display', 'inline-block');
      $('#change_info_button').prop('disabled', true);
      password_check = false;
    }
  });
  $('#new_p1').on('keyup', function(){
    if( $('#new_p2').val() == $('#new_p1').val() ) {
      $('.match').css('display', 'none');
      $('#change_info_button').prop('disabled', false);
      password_check = true;
    } else {
      $('.match').css('display', 'inline-block');
      $('#change_info_button').prop('disabled', true);
      password_check = false;
    }
  });
});
