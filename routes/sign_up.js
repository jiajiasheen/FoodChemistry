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
User sends a POST request to sign up.
Input data:
  req.body
Return data:
  if successful renders to log in
  if unsuccessful renders to log in (User should get a msg)
*/
router.post('/', function(req, res, next){
  //If any of these items is undefined, send an error
  var param = [req.body.username, req.body.password, req.body.user_type, req.body.phone, req.body.email, req.body.account];
  //User did not complete the sign up process
  //But we prevent any of this in the front end.
  if( isUndefined(param) ) {
    //TODO: This is a new user
    return res.render('login_test', { msg: "Bad sign up content" });
  }
  //If any of the items is "", then we send error
  if( isEmpty(param) ){
    //TODO: This user has previously logged out
    return res.render('login_test', { msg: "Bad sign up content" });
  }

  //Store the user information as a JSON
  //Overall information for a user.
  //Sub-JSON objects can be created for more specific data inserts.
  var data = {};
  data.image_id = "default";
  data.username = req.body.username;
  data.password = req.body.password;
  data.user_type = req.body.user_type;
  data.phone = req.body.phone;
  data.email = req.body.email;
  data.account = req.body.account;

  //If the user is an owner, then they should have included storename
  //data.desc is the description of the store
  if( req.body.user_type == "owner") {
      data.storename = req.body.storename;
      data.address = req.body.address;
      data.desc = req.body.desc;
  }

  //Parse a valid id inside USERS database
  users.find( {}, "user_id username", function(err, docs){
    var max_id = 0;
    for(var i = 0; i < docs.length; i++){
      //user_id is a string, so parse to int
      var curr_id = parseInt(docs[i].user_id);
      if( max_id < curr_id ) {
        max_id = curr_id;
      }
      if(data.username == docs[i].username){
        //TODO: Given username already exists
        return res.render('login_test', {msg: "Sorry, that username already exists."});
        //return res.render('login');
      }
    }
    //Increment by 1 so max_id is unique.
    max_id += 1;
    //Set user_id
    data.user_id = max_id;
    var user_data = {
      user_id: data.user_id,
      username: data.username,
      password: data.password,
      user_type: data.user_type,
      account: data.account
    }
    //Add the four attributes required for the users database.
    users.insertMany([user_data], function(err, docs){
      if(err){
        throw err;
      }
      //Add to custs database if user_type == customer
      if(data.user_type == "customer" ) {
        var cust_data = {
          user_id: data.user_id,
          username: data.username,
          email: data.email,
          phone: data.phone,
          image_id: 'default'
        };
        //Insert the data into the cust database
        custs.insertMany([cust_data], function(err, docs){
          if(err){ throw err };
          //Should render a new page after successful signup
          return res.render('login_test', {msg: "successful"});
        //custs.insertMany
        })
      //Add to owners database if user_type == owner
      //Set the image_id to the default photo at login.
      } else if( data.user_type == "owner" ) {
        var owner_data = {
          user_id: data.user_id,
          username: data.username,
          storename: data.storename,
          email: data.email,
          phone: data.phone,
          address: data.address,
          desc: data.desc,
          open: false,
          image_id: 'default'
        };
        //Insert the data into the owners database
        owners.insertMany([owner_data], function(err, docs){
          if(err){ throw err };
          //Should render a new page after successful signup
          return res.render('login_test', {msg: 'successful'});
        //owners.insertMany
        })

      } else if (data.user_type == "admin") {
        return res.render('login_test');
      }
    //users.insertMany
    })
  //users.find
  })
//router.post
});
/*
Not sure if we need to implement this one
*/
router.get('/', function(req, res){

});

module.exports = router;
