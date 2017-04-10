var express = require('express');
var router = express.Router();

//Import databases
var users = require('../model/users'); // {user_id, username, password, user_type }
var custs = require('../model/custs'); // {user_id, username, email, phone }
var owners = require('../model/owners'); // {user_id, username, storename, email, phone, address }
var items = require('../model/items'); // { item_id, owner_id, item_name, desc, allergens, price }
var reviews = require('../model/reviews');  // {owner_id, cust_id, rating, comment }
var ords = require('../model/ords'); // {owner_id, cust_id, item_id, time }
var bodyParser = require('body-parser');
/*
Key functions:

//Insert
database.insertMany( JSON object in a list, function(err, docs) { });

//Get
database.find({ query based on JSON}, "attributes in string", function(err, docs){ });

//Edit
database.update( doc[i] found find function , updateTo { } , function(err, docs){ });

//Delete
docs[i].remove();
*/
/*
Reminder:
Users:  {user_id, username, password, user_type }
cust: {user_id, username, email, phone }
owners: {user_id, username, storename, email, phone, address }
items: { item_id, store_id, name, desc, allergens, price }
reviews: {store_id, cust_id, rating, comment }
ords: {store_id, cust_id, item_id, time }
*/
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
User sends a POST request to 'users_tool', creating a new user.

If user gave valid information:
  Insert the user into the users database and:
    if the user is a customer, then inserts into custs database as well
    if the user_type == "owner", then inserts into the owner database as well
    if the user_type == "admin" then only inserts into the users database
  Upon success, JSON is returned with a key, value pair (status, true)
Otherwise:
  JSON is return with a key, value pair (status, false)

Relevant input values:
  req.session, req.query
Return values:
  JSON format: { success: true|false }
*/
router.post('/', function(req, res, next){
  //If any of these items is undefined, send an error
  var param = [req.body.username, req.body.password, req.body.user_type, req.body.phone, req.body.email];
  //User did not complete the sign up process
  if( isUndefined(param) ) {
    //TODO: This is a new user
    return res.send('Undefined');
  }
  //If any of the items is "", then we send error
  if( isEmpty(param) ){
    //TODO: This user has previously logged out
    return res.send("Null");
  }

  //Store the user information as a JSON
  var data = {};
  data.image_id = "default";
  data.username = req.body.username;
  data.password = req.body.password;
  data.user_type = req.body.user_type;
  data.phone = req.body.phone;
  data.email = req.body.email;

  //If the user is an owner, then they should have included storename
  if( req.body.user_type == "owner") {
      data.storename = req.body.storename;
      data.address = req.body.address;
  }
  //Parse a valid id inside USERS database
  users.find({}, "user_id username", function(err, docs){
    var max_id = 0;
    for(var i = 0; i < docs.length; i++){
      //user_id is a string, so parse to int
      var curr_id = parseInt(docs[i].user_id);
      if( max_id < curr_id ) {
        max_id = curr_id;
      }
      if(data.username == docs[i].username){
        console.log('someone already exists');
        //TODO: Given username already exists
        return res.render('login_test');
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
      user_type: data.user_type
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
          return res.render('login_test');
        //custs.insertMany
        })
      //Add to owners database if user_type == owner
      } else if( data.user_type == "owner" ) {
        var owner_data = {
          user_id: data.user_id,
          username: data.username,
          storename: data.storename,
          email: data.email,
          phone: data.phone,
          address: data.address,
          open: false,
          image_id: 'default'
        };
        console.log(owner_data.address);
        //Insert the data into the owners database
        owners.insertMany([owner_data], function(err, docs){
          if(err){ throw err };
          //Should render a new page after successful signup
          return res.render('login_test');
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
User makes a GET request to login.

Information is sent by req.query, namely, user will enter only username and password.

If successful login (username and password combination exists in the database):
  If user is a customer:
    user_id, username, user_type is set to req.session.
    then redirected to 'menu' page.
  If user is an owner:
    user_id, username, user_type is set to req.session.
    then redirected to 'message_system' page.
  If user is an admin:
    user_id, username, user_type is set to req.session.
    Then user will be redirected to admin page.
If login fails:
  User will be sent a JSON with { status: false }
*/
router.get('/', function(req, res, next){

  var username = req.query.username;
  var password = req.query.password;

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
/*
User sends a PUT request to to update information about a user.
Information is sent through the req.body.

If User enters a valid username and password,
  user information inside the users database is updated.
  If user_type == customer, then custs.database is also updated
  If user_type == owner, then owners.database is also updated
  user is sent JSON { status: true }
If user DOES NOT enter a valid username and password combination,
  user is sent JSON { status: false }
*/
router.put('/', function(req, res, next){

  //Front end will parse this or set default values in the form (""), just make sure these are not undefined
  var param = [req.body.username, req.body.curr_password, req.body.new_password, req.body.phone, req.body.email];
  if( isUndefined(param) ){
    return res.sendStatus(404);
  }
  //Check to find this username and password combination
  users.find( { username: req.body.username, password: req.body.curr_password }, "user_id username password user_type phone email", function(err, docs){
    if(err){ throw err; }
    //Could not find this combination
    if(docs.length != 1) {
      return res.send( {status: false} );
    //Found this username password combination
    } else {
      //If an input is "" then we ignore that field.
      //if user wants to change their password
      if(req.body.new_password != ""){
         var updatePass = {};
         updatePass.password = req.body.new_password;
         //Updating password
         users.update(docs[0], updatePass, function(err, docs){
           if(err) { throw err; }
           //If user wants to update other information
           var updateTo;
           if(req.body.phone != ""){
             updateTo.phone = req.body.phone;
           }
           if(req.body.email != ""){
             updateTo.email = req.body.email;
           }
           if(docs[0].user_type == "customer"){
             custs.update(docs[0], updateTo, function(err, docs){
               if(err) { throw err; }
             //custs.update()
             });
           } else if (docs[0].user_type = "owner") {
             owners.update(docs[0], updateTo, function(err, docs){
               if(err) { throw err; }
             //owners.update()
             })
           }
         //users.update()
         });
      //User did not say they want to change password
      } else {
        //Other information updating
        var updateTo;
        if(req.body.phone != ""){
          updateTo.phone = req.body.phone;
        }
        if(req.body.email != ""){
          updateTo.email = req.body.email;
        }
        if(docs[0].user_type == "customer"){
          custs.update(docs[0], updateTo, function(err, docs){
            if(err) { throw err; }
            return res.send({ status: true });
          //custs.update
          });
        } else if (docs[0].user_type = "owner") {
          owners.update(docs[0], updateTo, function(err, docs){
            if(err) { throw err; }
            return res.send({ status: true });
          //owners.update
          })
        }
      //else
      }
    //else
    }
  //users.find
  })
//router.put
});
/*
User sends a DELETE request.
Information is sent by req.query.

Users that are not admin will not have access to deleting users.

If the user_type == admin
  The target user in the query is deleted from users database
    If the target user is user_type == customer, then they are deleted in customers database.
    If the target user is user_type == owner, then they are deleted in the owners database.
    Their reviews and orders are not deleted in the database.
*/
router.delete('/', function(req, res, next){

    //username is passed by query
    var target_username = req.query.username;
    //Find the user in the users database
    users.find( { username: taget_username }, "user_id user_type", function(err, docs){
      if(err){ throw err; }
      //If we get a weird output, just send error
      if(docs.length != 1){
        return res.send("Could not find this user in users database");
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
              return res.send("Could not find this user in customers database");
            }
            //delete inside customer database
            docs[0].remove();
          }) //custs.find()
        } else if (user_type == "owner") {
          //Find inside owners database
          owners.find( { user_id: user_id }, "user_id", function(err, docs){
            if (err) { throw err; }
            if(docs.length != 1){
              return res.send("Could not find this user in owners database");
            }
            //delete inside owners database
            docs[0].remove();
          }) //owners.find()
        } // if user is customer or owner
      } // else
    }) // users.find()
});

module.exports = router;
