var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reviews = new Schema(
  {
    review_id:{
      type: String
    },
    cust_name:{
      type: String
    },
    owner_id:{
      type: String
    },
    rating:{
      type: Number
    },
    comment:{
      type: String
    },
    image_id:{
      type: String
    }
  },
  {
    collection: 'reviews'
  }
);
mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/reviews');
module.exports = mongoose.model('reviews', reviews);
