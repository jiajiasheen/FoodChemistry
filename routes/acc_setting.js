var express = require('express');
var router = express.Router();

//Import databases
var users = require('../model/users'); // {user_id, username, password, user_type }
var custs = require('../model/custs'); // {user_id, username, email, phone }
var owners = require('../model/owners'); // {user_id, username, storename, email, phone, address }
var items = require('../model/items'); // { item_id, owner_id, item_name, desc, allergens, price }
var reviews = require('../model/reviews');  // {owner_id, cust_id, rating, comment }
var ords = require('../model/ords'); // {owner_id, cust_id, item_id, time }

/*
Helper function:
Checks every item in info_list.
Returns true if at least one item is undefined.
Returns false if every item in info_list is defined.
*/
function isUndefined(info_list){
  for(var i = 0; i < info_list.length; i++){
    if(info_list[i] == undefined){
      return true;
    }
  }
  return false;
}
/*
Helper function:
Checks every item in info_list.
Returns true if at least one item is "".
Return false otherwise.
*/
function isEmpty(info_list){
  for(var i = 0; i < info_list.length; i++){
    if(info_list[i] == ""){
      return true;
    }
  }
  return false;
}

function renderOwnerAcc(req, res, msg){
  users.find( {user_id: req.session.user_id}, "user_id account", function(err, docs){
    if (err) { throw err; }
    var user_acc = docs[0].account;

    owners.find( { user_id: req.session.user_id }, "user_id username storename email phone address open image_id desc", function(err, docs){
			if( err ) { throw err ;}
			if( docs.length != 1){
				//Could not find, then render an error page
				return res.render('error_page', { err_msg: "Could not find you in our database "});
			} else {
				var ret_val = {
					user_id: docs[0].user_id,
					username: docs[0].username,
					storename: docs[0].storename,
					email: docs[0].email,
					phone: docs[0].phone,
					address: docs[0].address,
					user_type: req.session.user_type,
					link: ["menu items", "/change_menu"],
          image_id: docs[0].image_id,
					open: docs[0].open,
          account: user_acc,
          desc: docs[0].desc
				};
				ret_val.msg = msg;
				return res.render('acc_setting', ret_val);
			}
    });
  });
}

function renderCustAcc(req, res, msg){
  users.find( {user_id: req.session.user_id}, "user_id account", function(err, docs){
    if (err) { throw err; }
    var user_acc = docs[0].account;

    custs.find({ user_id: req.session.user_id }, "user_id username email phone image_id", function(err, docs){
      if( err ) { throw err ;}
      if( docs.length != 1){
        //Could not find, then render an error page
        return res.render('error_page', { err_msg: "Could not find you in our database "});
      } else {
        var ret_val = {
          user_id: docs[0].user_id,
          username: docs[0].username,
          email: docs[0].email,
          phone: docs[0].phone,
          user_type: req.session.user_type,
          link: ["order history", "/order_history"],
          image_id: docs[0].image_id,
          account: user_acc
        };
        ret_val.msg = msg;
        return res.render('acc_setting', ret_val);
      }
    });
  });
}

/*
Function that sends the user to the acc_setting page with required data
*/
function send_acc_page(req, res, msg){
	//User is of type customer
	if(req.session.user_type == "customer"){
		//Look for current user in customer database
    return renderCustAcc(req, res, msg);
	//This user is an owner
	} else if (req.session.user_type == "owner" ){
		//Look for current user inside the owners database
    return renderOwnerAcc(req, res, msg);
	} else {
		return res.render('error_page', { err_msg: "There was an error loading this page" });
	}
}
/*
Function to close the store, then reload the user to the acc setting page
*/
function close_store(req, res){
	owners.update( {user_id: req.session.user_id}, {open: false}, function(err, docs){
		return send_acc_page(req, res, "closed");
	});
}
/*
Function to open the store, and then open the store.
*/
function open_store(req, res){
	owners.update( {user_id: req.session.user_id}, {open: true}, function(err, docs){
		return send_acc_page(req, res, "open");
	});
}
/*
A user sends a GET request to view their account settings.

If user is a customer:
  The user is rendered 'acc_setting' page with a JSON containing their information
  and a link to view their order history.
If user is an owner:
  The user is rendered 'acc_setting' page with a JSON containing their information
  and a link to view their menu items.
else:
	The user is rendered 'error_page' page with a JSON containing an error message.
Relevant input values:
  req.session, req.query
Return values:
  JSON format: { user_id, username, email, phone, link } | { err_msg }
*/
router.get('/', function(req, res, next){
  return send_acc_page(req, res, "");
});
/*
	User made a POST request to change their information

	When user wants to OPEN or CLOSE
*/
router.post('/', function(req, res){

	if(req.body.status_change != undefined){
		if(req.body.status_change == "open"){
			return open_store(req, res);
		} else {
			return close_store(req, res);
		}
	}
	if(req.session.user_type == "customer"){
		var param = [req.body.password, req.body.new_password1, req.body.new_password2, req.body.phone, req.body.email, req.body.account];
		if( isUndefined(param) ){
		//Change to adding error page
			return send_acc_page(req, res, "no changes");
		}
	} else if (req.session.user_type == "owner"){
		var param = [req.body.password, req.body.new_password1, req.body.new_password2, req.body.phone, req.body.email, req.body.address, req.body.account, req.body.desc];
		if( isUndefined(param) ){
		//Chagen to adding error page
			return send_acc_page(req, res, "no changes");
		 }
	}

	//Check to find this username and password combination
	users.find( { username: req.session.username, password: req.body.password }, "user_id username password", function(err, docs){
		// if(err){ throw err; }
	  //Could not find this combination
	  if(docs.length != 1) {
			//Could not find this username and password combination
			return send_acc_page(req, res, "wrong password");
	    //Found this username password combination
	  } else {
	      //if user wants to change their password
    	var updatePass = {};
	  	if(req.body.new_password1 != ""){
	  		updatePass.password = req.body.new_password1;
			}
		}
    updatePass.account = req.body.account;
	  //Updating password
	  users.update(docs[0], updatePass, function(err, docu){
	  	if(err) { throw err; }
			var updateRest = {};
			updateRest.phone = req.body.phone;
			updateRest.email = req.body.email;

			if(req.session.user_type == "customer"){
				custs.update({user_id: req.session.user_id}, updateRest, function(err, docs){
					if(err) { throw err; }
						 return send_acc_page(req, res, "saved");
				 });
			} else if (req.session.user_type = "owner") {
				updateRest.address = req.body.address;
        updateRest.desc = req.body.desc;
				owners.update({user_id: req.session.user_id}, updateRest, function(err, docs){
					if(err) { throw err; }
					return send_acc_page(req, res, "saved");
				});
			}
			//If user wants to update other information
   	//users.update()
	  });
	  //users.find
	});

}); //Router

module.exports = router;
