$(document).ready(function() {

  var cust_password_check = true;

  $('#cp2').on('keyup', function(){
    if( $('#cp2').val() == $('#cp1').val() ) {
      $('.match').css('display', 'none');
      $('#cust_sign_up').prop('disabled', false);
      password_check = true;
    } else {
      $('.match').css('display', 'inline-block');
      $('#cust_sign_up').prop('disabled', true);
      password_check = false;
    }
  });
  $('#cp1').on('keyup', function(){
    if( $('#cp2').val() == $('#cp1').val() ) {
      $('.match').css('display', 'none');
      $('#cust_sign_up').prop('disabled', false);
      password_check = true;
    } else {
      $('.match').css('display', 'inline-block');
      $('#cust_sign_up').prop('disabled', true);
      password_check = false;
    }
  });

  $('#op2').on('keyup', function(){
    if( $('#op2').val() == $('#op1').val() ) {
      $('.match').css('display', 'none');
      $('#owner_sign_up').prop('disabled', false);
      password_check = true;
    } else {
      $('.match').css('display', 'inline-block');
      $('#owner_sign_up').prop('disabled', true);
      password_check = false;
    }
  });
  $('#op1').on('keyup', function(){
    if( $('#op2').val() == $('#op1').val() ) {
      $('.match').css('display', 'none');
      $('#owner_sign_up').prop('disabled', false);
      password_check = true;
    } else {
      $('.match').css('display', 'inline-block');
      $('#owner_sign_up').prop('disabled', true);
      password_check = false;
    }
  });
});
