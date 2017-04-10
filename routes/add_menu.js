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
Request to create a menu item (menu_item).
Information is passed by req.body.
*/
router.post('/', function(req, res){

  //If any of these items is undefined, send an error
  var required_param = [req.session.user_id, req.body.item_name, req.body.desc, req.body.allergens, req.body.price];

	if( isUndefined(required_param) ) {
		//Send them back to the page
		return send_to_page(req, res, "not created");
  }
  //If any of the items is "", then we send error
  if( isEmpty(required_param) ) {
		//Send them back to the page
		return send_to_page(req, res, "not created");
  }
  //Put into JSON format
  var data = {};
  data.item_name = req.body.item_name;
  data.owner_id = req.session.user_id;
  data.desc = req.body.desc;
  data.allergens = req.body.allergens;
  data.price = req.body.price;
  data.image_id = 'default';

  //Parse a valid id
  items.find({}, "item_id item_name", function(err, docs){
    var max_id = 0;
    for(var i = 0; i < docs.length; i++){
      //item_id is a string, so parse to int
      var curr_id = parseInt(docs[i].item_id);
      if( max_id < curr_id ) {
        max_id = curr_id;
      }
    }
    max_id += 1;
    items.find({owner_id: data.owner_id},  "item_id item_name", function(err, docs){
      for(var i = 0; i < docs.length; i++){
        if(docs[i].item_name == data.item_name){
          return send_to_page(req, res, "duplicate item");
        }
      }
      //Increment by 1 so max_id is unique.
      data.item_id = max_id;
      items.insertMany([data], function(err, docs){
        if(err){ throw err; }
        //Succeeded in adding the new item
        //Send them back to the page with msg saying it got inserted
        return send_to_page(req, res, "created");
      }) //items.insertMany
    })
  }) //items.find
//router.post
});
module.exports = router;
