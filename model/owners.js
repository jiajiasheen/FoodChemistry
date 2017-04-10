var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var owners = new Schema(
  {
    user_id: {
      type: String
    },
    username:{
      type: String
    },
    storename:{
      type: String
    },
    email:{
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    }, open: {
      type: Boolean
    },
    image_id:{
      type: String
    },
    desc: {
      type: String
    }
  },
  {
    collection: 'owners'
  }
);

mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/owners');
module.exports = mongoose.model('owners', owners);
