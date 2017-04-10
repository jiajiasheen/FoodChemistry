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
User sends a GET request to the server to view all their previous orders.

If the user is customer:
	The user is rendered 'order_history' page with a JSON containing a list of previous
		orders with status 'completed'
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
	} else if (req.session.user_type != "customer") {
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page."});
	}
	var cust_id = req.session.user_id;
	ords.find({cust_id: cust_id}, null, {sort: {time: -1}}, function(err, docs){
		var order_list = [];
		//get item_id
		//Get storename
		for(var i = 0; i < docs.length; i++){
			var order = {
				order_id: docs[i].order_id,
				storename: docs[i].storename ,
				cust_id: docs[i].cust_id,
                item_name: docs[i].item_name,
                price: docs[i].price,
                quantity:docs[i].quantity,
				time: docs[i].time,
                status:docs[i].status
			};
			order_list.push(order);
		} //for loop
		return res.render('order_history', { orders: order_list })
	})
})

module.exports = router;
