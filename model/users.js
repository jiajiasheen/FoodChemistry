var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var users = new Schema(
  {
    user_id: {
      type: String
    },
    username:{
      type: String
    },
    password:{
      type: String
    },
    user_type:{
      type: String
    },
    account:{
      type: String
    }
  },
  {
    collection: 'users'
  }
);

mongoose.Promise = global.Promise;
mongoose.createConnection('mongodb://localhost/users');
module.exports = mongoose.model('users', users);
