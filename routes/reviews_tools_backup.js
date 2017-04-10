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
Request to create a menu item (menu_item).
Information is passed by req.body.
*/
router.post('/', function(req, res, next){

  //If any of these items is undefined, send an error
  var param = [req.body.name, req.body.owner_id, req.body.desc, req.body.allergens];
  if( isUndefined(param) ) {
    return res.sendStatus(404);
  }
  //If any of the items is "", then we send error
  if( isEmpty(param)){
    return res.sendStatus(404);
  }

  //Put into JSON format
  var data = {};
  data.name = req.body.name;
  data.owner_id = req.body.owner_id;
  data.desc = req.body.desc;
  data.allergens = req.body.allergens;

  //Parse a valid id
  menu_items.find({}, "_id", function(err, docs){
    var max_id = 0;
    for(var i = 0; i < docs.length; i++){
      //_id is a string, so parse to int
      var curr_id = parseInt(docs[i]._id);
      if( max_id < curr_id ) {
        max_id = curr_id;
      }
    //forloop
    }
    //Increment by 1 so max_id is unique.
    max_id += 1;
    data._id = max_id;
    menu_items.insertMany([data], function(err, docs){
      if(err){
        throw err;
      }
      //Succeeded in adding the new item
    })
  //menu_items.find()
  })
//router.post
});
/*
Request to retrieve a menu item from database (menu_item)
Infomation is passed by query
*/
router.get('/', function(req, res, next){

  var owner_id = req.query.owner_id;

  menu_items.find( { owner_id: owner_id }, "_id owner_id name desc allergens", function(err, docs){
    if(err){
      throw err;
    }
    if(docs.length == 0){
      return res.sendStatus(404);
    } else {
      var items_list = [];
      for(var i = 0; i < docs.length; i++){
        var data = {};
        data._id = docs[i]._id;
        data.owner_id = docs[i].owner_id;
        data.name = docs[i].name;
        data.desc = docs[i].desc;
        data.allergens = docs[i].allgerns;
        items_list.push(data);
      }
      return res.send( { items: items_list} );
    }
  })

});
/*
Request to delete a menu item from database (menu_item)
Information passed by query
*/
router.delete('/', function(req, res, next){
    //menu item is passed by query
    var item_id = req.query._id;
    //Find the item in the database
    menu_items.find( { _id: item_id }, "_id", function(err, docs){
      if(err){
        throw err;
      }
      //If we get a weird output, just send error
      if(docs.length != 1){
        return res.sendStatus(404);
      } else {
        //Remove what we found
        docs[0].remove();
      }
    })
});
/*
Request to edit a menu item from database (menu item)
Information passed by body
*/
router.put('/', function(req, res, next){
  //Front end will parse this or set default values in the form ("")
  var param = [req.body._id, req.body.owner_id, req.body.name, req.body.allergens, req.body.desc];
  if( isUndefined(param) ){
    return res.sendStatus(404);
  }
  menu_items.find({ _id: req.body._id }, "_id", function(err, docs){

    if(err){
      throw err;
    }

    if(docs.length != 1) {
      return res.sendStatus(404);
    }
    var updateTo = {};
    updateTo.name = req.body.name;
    updateTo.desc = req.body.desc;
    updateTo.allergens = req.body.allergens;
    menu_items.update( docs[0], updateTo , function(err, docs){
      if(err){
        throw err;
      }
    });
  })
});

module.exports = router;
