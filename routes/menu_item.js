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
A user sends a GET request to view all the items for a particular store.

If the user is customer:
	The user is rendered 'menu_item' page with a JSON containing a list of items
	by that store in the items database.
Otherwise:
 The user is rendered a 'no access' page.

Relevant input values:
  req.session, req.query
Return values:
	JSON format: { items: [] } | { err_msg : "" }
*/

router.get('/', function(req, res, next){

	if(req.session.user_type == undefined){
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page. "});
	} else if (req.session.user_type != "customer") {
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page. "});
	}
	var storename = req.query.storename;
	var owner_id = req.query.owner_id;
	var username = req.session.username;
	var image_id_item;
	var image_id_cust;
	console.log('owner id : ' + owner_id);


	items.find({owner_id: owner_id}, "item_id item_name desc allergens price image_id", function(err, docs){

		var item_list = [];
		var review_list = [];

		for(var i = 0; i < docs.length; i++){
			var item = {
				item_id: docs[i].item_id,
				name: docs[i].item_name,
				desc: docs[i].desc,
				allergens: docs[i].allergens,
				price: docs[i].price,
				image_id_item: docs[i].image_id
			};

			item_list.push(item);
		}
		reviews.find( { owner_id: owner_id }, "review_id cust_name owner_id rating comment image_id", function(err, doc){

		  for(var i = 0; i < doc.length; i++){
		  var data = {
		  	review_id: doc[i].review_id,
		  	owner_id: doc[i].owner_id,
		  	cust_name: doc[i].cust_name,
		  	rating: doc[i].rating,
		  	comment: doc[i].comment,
		  	image_id_cust: doc[i].image_id
		  }
		  review_list.push(data);
		  console.log(doc[i].image_id+"+++++++++++++++++");
		}

		var master_list ={
		items: item_list,
		reviews: review_list,
		username: username,
		owner_id: owner_id,
		storename: storename
		}

		return res.render('menu_item', {master: master_list});
	}) //reviews.find
}) //router.get
});//router.get

module.exports = router;
