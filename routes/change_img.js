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
/*
Function that sends the user to the acc_setting page with required data
*/
function send_acc_page(req, res, msg){
	//User is of type customer
	if(req.session.user_type == "customer"){
		//Look for current user in customer database
		custs.find({ user_id: req.session.user_id }, "user_id username email phone image_id account", function(err, docs){
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
          account: docs[0].account
				};
				ret_val.msg = msg;
				return res.render('acc_setting', ret_val);
			}
		})
	//This user is an owner
	} else if (req.session.user_type == "owner" ){
		//Look for current user inside the owners database
		owners.find({ user_id: req.session.user_id }, "user_id username storename email phone address open image_id account desc", function(err, docs){
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
          account: docs[0].account,
          desc: docs[0].desc
				};
				ret_val.msg = msg;
				return res.render('acc_setting', ret_val);
			}
		})
	} else {
		return res.render('error_page', { err_msg: "There was an error loading this page" });
	}
}
/*
User sends a request to make changes to the profile picture

*/
router.post('/', function(req, res){

  var user_id = req.session.user_id;
  var user_type = req.session.user_type;

  if(user_type == 'owner'){
    owners.find({user_id: user_id}, "user_id image_id", function(err, docs){
      owners.update(docs[0], {image_id: req.body.new_img}, function(err, docs){
        return send_acc_page(req, res, "image success");
      })
    })
  } else {
    custs.find({user_id: user_id}, "user_id image_id", function(err, docs){
      custs.update(docs[0], {image_id: req.body.new_img}, function(err, docs){
        return send_acc_page(req, res, "image success");
      })
    })
  }
})

module.exports = router;
