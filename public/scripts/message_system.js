setTimeout(function(){
   window.location.reload(1);
}, 30000);

    function hideshow(order_id) {
        document.getElementById('accept_'+order_id).style.display = 'none';
        document.getElementById('decline_'+order_id).style.display = 'none';
          $.ajax({
            url: '/change_accept'
            , method: 'GET'
            , contentType: 'application/json'
            , data: JSON.stringify(order_id) //provide requied information
            , success: function (response) {
            }
        });
    }
function hideshow2(order_id) {
        document.getElementById('accept_'+order_id).style.display = 'none';
        document.getElementById('decline_'+order_id).style.display = 'none';
          $.ajax({
            url: '/change_decline'
            , method: 'GET'
            , contentType: 'application/json'
            , data: JSON.stringify(order_id) //provide requied information
            , success: function (response) {
            }
        });
    }  
