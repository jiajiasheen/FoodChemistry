var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var custs = new Schema(
  {
    user_id: {
      type: String
    },
    username:{
      type: String
    },
    email:{
      type: String
    },
    phone: {
      type: String
    },
    image_id: {
      type: String
    }
  },
  {
    collection: 'custs'
  }
);

mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/custs');
module.exports = mongoose.model('custs', custs);
