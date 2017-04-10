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
function send_to_page(req, res, msg){

	if(req.session.user_type == undefined){
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page "});
	} else if (req.session.user_type != "owner") {
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page "});
	}

	var items_list = [];
	var owner_id = req.session.user_id;
	//Look for all items inside the items database
	items.find( {owner_id: owner_id}, "item_id owner_id item_name desc allergens price image_id", function(err, docs){
		if( err ) { throw err; }
		for(var i = 0; i < docs.length; i++){
			var item = {
				item_id: docs[i].item_id,
				owner_id: docs[i].owner_id,
				item_name: docs[i].item_name,
				desc: docs[i].desc,
				allergens: docs[i].allergens,
				price: docs[i].price,
        image_id: docs[i].image_id
			};
			items_list.push(item)
		}
		return res.render('change_menu', { items: items_list, msg: msg });
	});
}

/*
User sends a request to make changes to the profile picture

*/
router.post('/', function(req, res){

  var item_id = req.body.item_id;

  items.find({item_id: item_id}, "item_id image_id", function(err, docs){
      items.update(docs[0], {image_id: req.body.new_img}, function(err, docs){
        return send_to_page(req, res, "image success");
      })
  })
});

module.exports = router;
