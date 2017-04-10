var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var items = new Schema(
  {
    item_id:{
      type: String
    },
    owner_id:{
      type: String
    },
    item_name:{
      type: String
    },
    desc:{
      type: String
    },
    allergens:{
      type: String
    },
    price:{
      type: String
    },
    image_id:{
    	type: String
    }
  },
  {
    collection: 'items'
  }
);
mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/items');
module.exports = mongoose.model('items', items);
