var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CustomerSchema = new Schema(
  {
    username:{
      type: String

    },
    email:{
      type: String

    },
    password:{
      type: String

    },
    customertype:{
      type: String
    }
  },
  {
    collection: 'customer'
  }
);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/customers');
module.exports = mongoose.model('Customers', CustomerSchema);
