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
Request to make an order
Information is passed by req.body.
*/
router.post('/', function(req, res, next){

  //If any of these items is undefined, send an error
  var param = [req.body.item_id, req.body.cust_id, req.body.owner_id, req.body.item_id, req.body.time];
  if( isUndefined(param) ) {
    return res.send({ status: false });
  }
  //If any of the items is "", then we send error
  if( isEmpty(param)){
    return res.sendStatus( { status: false });
  }

  //Put into JSON format
  var data = {};
  data.item_id = req.body.item_id;
  data.owner_id = req.body.owner_id;
  data.cust_id = req.body.cust_id;
  data.item_id = req.body.item_id;
  data.time = req.body.time;
  data.status = "pending";
  //Parse a valid id
  ords.find( {} , "order_id", function(err, docs){
    var max_id = 0;
    for(var i = 0; i < docs.length; i++){
      //_id is a string, so parse to int
      var curr_id = parseInt(docs[i].order_id);
      if( max_id < curr_id ) {
        max_id = curr_id;
      }
    }  //forloop
    max_id += 1;    //Increment by 1 so max_id is unique.
    data.order_id = max_id;
    ords.insertMany([data], function(err, docs){
      if(err){ throw err; }
      //Succeeded in adding the new item
    }) //ords.insertMany
  }) //menu_items.find()
}); //router.post
/*
Request to retrieve a menu item from database (menu_item)
Infomation is passed by query
*/
router.get('/', function(req, res, next){

  var order_id = req.query.order_id;

  ords.find( { order_id: order_id }, "order_id owner_id cust_id time", function(err, docs){
    if(err){ throw err; }
    if(docs.length == 0){
      return res.send( { status: false });
    } else {
      var data = {};
      data.order_id = docs[0].order_id;
      data.owner_id = docs[0].owner_id;
      data.cust_id = docs[0].cust_id;
      data.item_id = docs[0].item_id;
      data.time = docs[0].item;
      data.status = docs[0].status;
      send( data );
    }
  })

});
/*
Don't delete orders, just set their status to 'declined' or 'accepted'
*/
router.delete('/', function(req, res, next){

});

/*
Information passed by body
*/
router.put('/', function(req, res, next){
  //Front end will parse this or set default values in the form ("")
  var param = [req.body.order_id, req.body.status ];
  if( isUndefined(param) ){
    return res.send( {status : false });
  }
  if (isEmpty (param) ) {
    return res.send( {status: false });
  }

  ords.find({ order_id: req.body.order_id }, "order_id status", function(err, docs){
    if(err){ throw err; }
    if(docs.length != 1) { return res.send( { status : false } ); }

    ords.update( docs[0], {status: req.body.status } , function(err, docs){
      if(err){ throw err; }
    });
  })
});

module.exports = router;
