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
User sends a GET request to the server to view all the pending orders for their store.

If the user is owner:
	The user is rendered 'message_system' page with a JSON containing a list of orders
		with status 'pending' inside the ords database.
Otherwise:
 The user is rendered a 'no access' page.

Relevant input values:
  req.session, req.query
Return values:
	JSON format: { orders: [] }

*/
router.get('/', function(req, res, next){

	if(req.session.user_type == undefined){
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page."});
	} else if (req.session.user_type != "owner") {
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page."});
	}
	var store_id = req.session.user_id;
	ords.find({owner_id: store_id}, null, {sort: {time: -1}}, function(err, docs){
		if (docs){
        var order_list = [];
		for(var i = 0; i < docs.length; i++){
			order_list.push({
				order_id: docs[i].order_id,
				customer_name: docs[i].customer_name,
				item_name: docs[i].item_name,
                quantity: docs[i].quantity,
				time: docs[i].time,
                price:docs[i].price,
                status:docs[i].status
			});
		} //for loop
		return res.render('message_system', {orders: order_list});
        }
	})
})

module.exports = router;
