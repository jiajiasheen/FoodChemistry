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
User sends a GET request to the server to view all the available stores.

If the user is customer:
	The user is rendered 'menu' page with a JSON containing a list of stores
 		that are currently available in the owners database.
Otherwise:
 The user is rendered a 'no access' page.

Relevant input values:
  req.session, req.query
Return values:
	JSON format: { stores: [] }

*/
router.get('/', function(req, res, next){

	if(req.session.user_type == undefined){
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page."});
	} else if (req.session.user_type != "customer") {
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page."});
	}
	//Finds all the owners
	owners.find({}, "user_id storename email phone address open image_id", function(err, docs){
		var owner_list = [];
		for(var i = 0; i < docs.length; i++){
			var owner = {
				user_id: docs[i].user_id,
				storename: docs[i].storename,
				email: docs[i].phone,
				address: docs[i].address,
				open: docs[i].open,
				image_id: docs[i].image_id
			};
			owner_list.push(owner)
		} //for loop
		return res.render('menu', {owners: owner_list});
		//return res.send({owners: owner_list});
	}) //owners.find
}) //reouter.get

module.exports = router;
