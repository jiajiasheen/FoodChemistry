'use strict';

var express = require('express');
var expressValidator = require('express-validator');
var app = express();
var bodyParser = require('body-parser');
// The request body is received on GET or POST.
// This middleware just simplifies things a bit.
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({   // to support URL-encoded bodies
    extended: true
}));

var path = require('path');
var session = require('express-session');

app.use(session( {secret: "nothing", resave: false, saveUninitialized: true, rolling: true }));
app.use(express.static(__dirname));
app.engine('.html', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/public', express.static(process.cwd() + '/public'));


var Customers = require('./model/customer');

//Load database
var users = require('./model/users');
var custs = require('./model/custs');
var owners = require('./model/owners');
var reviews = require('./model/reviews');
var items = require('./model/items');
var ords = require('./model/ords');

//Load main routes
var login_test = require('./routes/login_test');
var change_item_img = require('./routes/change_item_img');
var delete_menu = require('./routes/delete_menu');
var change_img = require('./routes/change_img');
var add_menu = require('./routes/add_menu');
var sign_up = require('./routes/sign_up');
var admin = require('./routes/admin');
var change_menu = require('./routes/change_menu');
var login = require('./routes/login');
var menu = require('./routes/menu');
var menu_item = require('./routes/menu_item');
var message_system = require('./routes/message_system');
var order_history = require('./routes/order_history');
var acc_setting = require('./routes/acc_setting');

//load 'tools' routes (TODO: Maybe we don't have to use this)
var users_tool = require('./routes/users_tool');
var items_tool = require('./routes/items_tool');
var reviews_tool = require('./routes/reviews_tool');
var ords_tool = require('./routes/orders_tool');

//Use 'tools'
app.use('/users_tool', users_tool);
app.use('/items_tool', items_tool);
app.use('/reviews_tool', reviews_tool);
app.use('/orders_tool', ords_tool);

//Pages for everyone
app.use('/sign_up', sign_up);
app.use('/login', login);
app.use('/acc_setting', acc_setting);
app.use('/change_img', change_img);
app.use('/login_test', login_test);
//Customer pages
app.use('/menu', menu);
app.use('/menu_item', menu_item);
app.use('/order_history', order_history);

//Owner pages
app.use('/change_item_img', change_item_img);
app.use('/delete_menu', delete_menu);
app.use('/change_menu', change_menu);
app.use('/message_system', message_system);
app.use('/add_menu', add_menu);

//Admin pages
app.use('/admin', admin);

/* TESTING CODE START TODO: You can delete this code if you don't need it*/
app.get('/remove_all_users', function(req, res){
  users.find({}, "user_id user_type", function(err, docs){
    for(var i = 0; i < docs.length; i++){
      var user_id = docs[i].user_id;
      docs[i].remove();
      if(docs[i].user_type == "customer"){
        custs.find({ user_id: user_id }, "user_id", function(err, docs){
          for(var j = 0; j < docs.length; j++){
            docs[j].remove();
          }
        })
      } else if (docs[i].user_type == "owner") {
        owners.find({ user_id: user_id}, "user_id", function(err, docs){
          for(var j =0; j< docs.length; j++){
            docs[j].remove();
          }
        })
      }
    }
    items.find({}, "item_id", function(err, docs){
      for(var i =0; i < docs.length; i++){
        docs[i].remove()
      }
    })
    res.send('finished');
  })
})
app.get('/show_users', function(req, res){
  var user_list = [];
  users.find({}, "user_id username user_type", function(err, docs){
    for(var i = 0; i < docs.length; i++){
      var x = {
        username: docs[i].username,
        user_id: docs[i].user_id,
        user_type: docs[i].user_type
      };
      user_list.push(x);
    }
  res.send({users: user_list});
  })
})
app.get('/show_custs', function(req, res){
  var user_list = [];
  custs.find({}, "user_id username email phone", function(err, docs){
    for(var i = 0; i < docs.length; i++){
      var x = {
        username: docs[i].username,
        user_id: docs[i].user_id,
        phone: docs[i].phone,
        email: docs[i].email,
      };
      user_list.push(x);
    }
  res.send({users: user_list});
  })
})
app.get('/show_owners', function(req, res){
  var user_list = [];
  owners.find({}, "user_id username storename email phone", function(err, docs){
    for(var i = 0; i < docs.length; i++){
      var x = {
        username: docs[i].username,
        storename: docs[i].storename,
        user_id: docs[i].user_id,
        phone: docs[i].phone,
        email: docs[i].email,
      };
      user_list.push(x);
    }
  res.send({users: user_list});
  })
})
app.get('/show_items', function(req, res){
  items.find({}, "item_id owner_id item_name desc allergens price" , function(err, docs){
    var x = [];
    for(var i =0; i < docs.length; i++){
      x.push(docs[i]);
    }
    res.send({items: x});
  })
})
/* TESTING CODE END */
/*   When the user wants to log out */
app.get('/forget', function(req, res){
  req.session.username = null;
  req.session.user_id = null;
  req.session.user_type = null;
  res.redirect('/');
});

//When user requests for the HOME page.
//TODO: Should be replaced with the actual login page
app.get('/', function(req, res){ res.redirect('login_test'); });
app.get('/menu_item', function(req,res){ res.redirect('menu_item'); })
app.get('/order_history', function(req,res){ res.redirect('order_history.ejs'); })
app.get('/message_system', function(req,res){ res.redirect('message_system'); })
//Rebecca
app.get('/change_decline', function (req, res) {
    var query = req.query;
    var order_id = Object.keys(query)[0];
    ords.findOne({
        order_id: order_id
    }, 'status', function (err, item) {
        if (err) throw err;
        if (item) {
            item.status = "declined";
            item.save(function (err) {
                if (err) throw err;
            });
        }
    });
    res.redirect("/message_system");
});
app.get('/change_accept', function (req, res) {
    var query = req.query;
    var order_id = Object.keys(query)[0];
    ords.findOne({
        order_id: order_id
    }, 'status', function (err, item) {
        if (err) throw err;
        if (item) {
            item.status = "accepted";
            item.save(function (err) {
                if (err) throw err;
            });
        }
    });
    res.redirect("/message_system");
});
app.post('/get_order', function (req, res) {
    var user_id = req.session.user_id;
    var customer_name = req.session.username;
    var owner_id = req.body[0].owner_id;
    var storename  = req.body[0].storename;
    var time = getdate();
    ords.find({}, 'item_name', function (err, items) {
        if (err) throw err;
        else {
            var id = items.length;
        }
        for (var i = 1; i < req.body.length; i++) {
            var order = new ords({
                order_id: id + i
                , cust_id: user_id
                , customer_name :customer_name
                , owner_id: owner_id
                , storename : storename
                , item_name: req.body[i].item_name
                , time: time
                , price: req.body[i].price
                , quantity: req.body[i].quantity
                , status: 'ordered'
            });
            order.save(function (err) { //save to database
                if (err) {
                    throw err;
                }
            });
        }
    });
});
/* Rebecca */
function getdate() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
};

app.get('/acc_setting', function(req,res){ res.redirect('acc_setting'); });
app.post('/sign_up', function(req, res){ res.redirect('sign_up'); });
app.post('/login_test', function(rqe, res){ res.redirect('login_test'); });
/* SET UP TOOLS */
app.post('/change_item_img', function(req, res){ res.redirect('change_item_img'); });
app.post('/delete_menu', function(req, res) { res.redirect('delete_menu'); });
app.post('/change_img', function(req, res) { res.redirect('change_img'); });
app.post('/add_menu', function(req, res){ res.redirect('add_menu') });
/* users_tool */
app.post('/users_tool', function(req, res){ res.redirect('users_tool'); });
app.get('/users_tool', function(req, res){ res.redirect('users_tool'); });
app.delete('/users_tool', function(req, res){ res.redirect('users_tool'); });
app.put('/users_tool', function(req, res){ res.redirect('users_tool'); });
/* items_tool */
app.post('/items_tool', function(req, res){ res.redirect('items_tool'); });
app.get('/items_tool', function(req, res){ res.redirect('items_tool'); });
app.delete('/items_tool', function(req, res){ res.redirect('items_tool'); });
app.put('/items_tool', function(req, res){ res.redirect('items_tool'); });
/* reviews tool */
app.post('/reviews_tool', function(req, res){ res.redirect('reviews_tool'); });
app.get('/reviews_tool', function(req, res){ res.redirect('reviews_tool'); });
app.delete('/reviews_tool', function(req, res){ res.redirect('reviews_tool'); });
app.put('/reviews_tool', function(req, res){ res.redirect('reviews_tool'); });
/* orders tool */
app.post('/ords_tool', function(req, res){ res.redirect('ords_tool'); });
app.get('/ords_tool', function(req, res){ res.redirect('ords_tool'); });
app.delete('/ords_tool', function(req, res){ res.redirect('ords_tool'); });
app.put('/ords_tool', function(req, res){ res.redirect('ords_tool'); });

var server = app.listen(process.env.PORT || 3000, function(){
  //Add an admin if there not exists one.
  users.find({user_type: "admin" }, "user_id user_type", function(err, docs){
    if(docs.length == 0){
      users.insertMany([ {user_id: '0', username: 'admin', password: 'admin', user_type: 'admin', account: '0'} ], function(err, docs){
      });
    }
  })
	console.log('Running in port', server.address().port);
});
