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
Returns true if at least one item is null.
Return false otherwise.
*/
function isNull(info_list){
  for(var i = 0; i < info_list.length; i++){
    if(info_list[i] == null){
      return true;
    }
  }
  return false;
}

/*
Render the LOG IN page with 
 */
router.get('/', function(req, res, next){

	//Check if already a user
	var params = [req.session.user_type, req.session.user_id, req.session.username];

	if( isUndefined(params) ){
		console.log('user was undefined');
		return res.render('login');
	} else if ( isNull(params) ) {
		console.log('user was null');
		return res.render('login');
	}
	if( req.session.user_type == "admin" ) {
		return res.redirect('admin');
	} else if (req.session.user_type == "customer" ) {
		return res.redirect('menu');
	} else if (req.session.user_type == "owner") {
		return res.redirect('message_system');
	} else {
		return res.render('login');
	}
})
/*
TODO: ? Reimplement or replace with your code

User sends a POST request to 'login', this should be when they want to log in

If login is successful then they should be redirected to the 'home' page for each
of the user_types.

*/
router.post('/', function(req, res, next){

  var username = req.body.username;
  var password = req.body.password;

  users.find( { username: username, password: password }, "user_id username user_type", function(err, docs){
    if(err){ throw err; }

    //We could not find this username and password combination inside the database
    if(docs.length == 0){
      //TODO: Should change this to a failed log in page.
      return res.send( { status: false } );
    //We found this combination
    } else {
      var user_id = docs[0].user_id;
      var user_type = docs[0].user_type;
      //Set the user data into the session.
      req.session.user_id = user_id;
      req.session.user_type = user_type;
      req.session.username = username;
      if(user_type == "customer"){
        console.log('redirecting to menu');
        return res.redirect('menu');
      } else if (user_type == "owner") {
        return res.redirect('message_system');
      } else if (user_type == "admin"){
        return res.redirect('admin');
      }
    }
  //users.find
  })
//router.get
});
module.exports = router;
