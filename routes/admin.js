var express = require('express');
var router = express.Router();

//Import databases
var users = require('../model/users'); // {user_id, username, password, user_type }
var custs = require('../model/custs'); // {user_id, username, email, phone }
var owners = require('../model/owners'); // {user_id, username, storename, email, phone, address }
var items = require('../model/items'); // { item_id, owner_id, item_name, desc, allergens, price }
var reviews = require('../model/reviews');  // {owner_id, cust_id, rating, comment }
var ords = require('../model/ords'); // {owner_id, cust_id, item_id, time }


function send_admin(req, res, msg){

	if(req.session.user_type == undefined){
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page "});
	} else if (req.session.user_type != "admin") {
		return res.render('error_page', {err_msg: "Sorry, you don't have access to this page "});
	}
	users.find({}, "user_id username user_type", function(err, docs){
		if ( err ) { throw err ;}

		var cust_list = [];
		var owner_list = [];
		for(var i = 0; i < docs.length; i++){
			var user = {
				user_id: docs[i].user_id,
				username: docs[i].username,
				user_type: docs[i].user_type
			};
			//Add the JSON to corresponding list only if they are customer or owner.
			if ( user.user_type == "customer" ) {
				cust_list.push(user);
			} else if ( user.user_type == "owner" ) {
				owner_list.push(user);
			}
		} //for loop
		return res.render('admin', {customers: cust_list, owners: owner_list, msg: msg });
	}) //users.find
}
/*
A  user sends a GET request to view a list of customers and owners.

If the user is an admin:
	The user is rendered 'admin' page with a JSON containing the list of customers
	and owners found inside the users database.
Otherwise:
 The user is rendered a 'no access' page.

Relevant input values:
  req.session
Return values:
	JSON format: {customers: [], owners: []} | {err_msg: "" }
*/
router.get('/', function(req, res, next){

	return send_admin(req, res, "");

}) //router.get

/*
Sends a request to delete a particular user.
*/
router.post('/', function(req, res){
    //username is passed by query
    var target_user_id = req.body.user_id;
    //Find the user in the users database
    users.find( { user_id: target_user_id }, "user_id user_type", function(err, docs){
      if(err){ throw err; }
      //If we get a weird output, just send error
      if(docs.length != 1){
				//Could not delete
				return send_admin(req, res, "invalid");

			} else {
        //Hold onto the info to delete in other databse
        var user_id = docs[0].user_id;
        var user_type = docs[0].user_type;
        //Remove inside users database.
        docs[0].remove();
        if(user_type == "customer"){
          //Find inside customer database
          custs.find( { user_id: user_id }, "user_id", function(err, docs){
            if( err ) { throw err; }
            if(docs.length != 1){
								return send_admin(req, res, "invalid");
            } else {
							//delete inside customer database
							docs[0].remove();
							return send_admin(req, res, "success");
						}
          }) //custs.find()
        } else if (user_type == "owner") {
          //Find inside owners database
          owners.find( { user_id: user_id }, "user_id", function(err, docs){
            if (err) { throw err; }
            if(docs.length != 1){
              return send_admin(req, res, "invalid");
            } else{
							//delete inside customer database
							docs[0].remove();
							return send_admin(req, res, "success");
						}
          }) //owners.find()
        } // if user is customer or owner
      } // else
    }) // users.find()
});

module.exports = router;
