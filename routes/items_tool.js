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
items: { item_id, owner_id, name, desc, allergens, price }
reviews: {owner_id, cust_id, rating, comment }
ords: {owner_id, cust_id, item_id, time }
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
Request to create a menu item (menu_item).
Information is passed by req.body.
*/
router.post('/', function(req, res, next){
  console.log("create an item");
  //If any of these items is undefined, send an error
  var required_param = [req.body.owner_id, req.body.name, req.body.desc, req.body.allergens, req.body.price];
  if( isUndefined(required_param) ) {
    return res.send( { status : false } );
  }
  //If any of the items is "", then we send error
  if( isEmpty(required_param)){
    return res.send( { status : false } );
  }
  //Put into JSON format
  var data = {};
  data.name = req.body.name;
  data.owner_id = req.body.owner_id;
  data.desc = req.body.desc;
  data.allergens = req.body.allergens;
  data.price = req.body.price;
  data.image_id = "../public/img/meals/default_meal_1.jpg";

  //Parse a valid id
  items.find({}, "item_id", function(err, docs){
    var max_id = 0;
    for(var i = 0; i < docs.length; i++){
      //item_id is a string, so parse to int
      var curr_id = parseInt(docs[i].item_id);
      if( max_id < curr_id ) {
        max_id = curr_id;
      }
    }
    //Increment by 1 so max_id is unique.
    max_id += 1;
    data.item_id = max_id;
    items.insertMany([data], function(err, docs){
      if(err){ throw err; }
      //Succeeded in adding the new item
      return res.send( { status: true });
    }) //items.insertMany
  }) //items.find
//router.post
});

/*
Request to retrieve an item from database (menu_item)
Infomation is passed by query
*/
router.get('/', function(req, res, next){
  //var owner_id = req.query.owner_id;
  var item_id = req.query.item_id;

  items.find( { item_id: item_id }, "item_id owner_id name desc allergens price", function(err, docs){
    if(err){ throw err; }
    if(docs.length == 0){
      //Could not find this item_id
      return res.send({status: false});
    } else {
      var data = {};

      data.item_id = docs[0].item_id;
      data.owner_id = docs[0].owner_id;
      data.name = docs[0].name;
      data.desc = docs[0].desc;
      data.allergens = docs[0].allgerns;
      data.price = docs[0].price;
      //Found
      return res.send( data );
    }
  }) //items.find()
}); //router.get()

/*
Request to delete a menu item from database (menu_item)
Information passed by query
*/
router.delete('/', function(req, res, next){
    console.log("del an item");
    //menu item is passed by query
    var item_id = req.query.item_id;
    //Find the item in the database
    items.find( { item_id: item_id }, "item_id", function(err, docs){
      if(err){ throw err; }
      //If we get a weird output, just send error
      if(docs.length != 1){
        return res.send("No item with that id exists");
      } else {
        //Remove what we found
        docs[0].remove();
        return res.send({ status: true});
      }
    }) //items.find
}); //router.delete
/*
Request to edit a menu item from database (menu item)
Information passed by body
*/
router.put('/', function(req, res, next){
  console.log("put an item");
  //Front end will parse this or set default values in the form ("")
  var param = [req.body.item_id, req.body.owner_id, req.body.name, req.body.allergens, req.body.desc, req.body.price];
  if( isUndefined(param) ){
    //Undefined parameters
    return res.send( { status: false } );
  }
  items.find( { items_id: req.body.items_id } , "items_id", function(err, docs){
    if( err ) { throw err; }

    if(docs.length != 1) {
      return res.send( { status: false });
    }

    var updateTo = {};
    updateTo.name = req.body.name;
    updateTo.desc = req.body.desc;
    updateTo.allergens = req.body.allergens;
    updateTo.price = req.body.price;

    items.update( docs[0], updateTo , function(err, docs){
      if(err){ throw err; }
      return res.send( { status: true} );
    });
  })
});

module.exports = router;
