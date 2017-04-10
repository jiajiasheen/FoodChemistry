var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var orders = new Schema(
  {
    order_id:{
      type: String
    },
    cust_id:{
      type: String
    },
    customer_name: {
      type: String
    },
    owner_id:{
      type: String
    },
    storename:{
      type: String
    },
    item_name: {
      type: String
    },
    price: {
      type: String
    },
    time: {
      type: String
    },
    quantity: {
      type: String
    },
    status: {
      type: String
    }
  },
  {
    collection: 'ords'
  }
);

mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/ords');
module.exports = mongoose.model('ords', orders);
