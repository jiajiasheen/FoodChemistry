var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ordersSchema = new Schema(
	{
		//itemName: {
		//	type: String
		//}
		//totalPrice:Number
		totalPrice:{
			type: String
		}
		
	},
	{
		collection: 'orders'
	}
);

mongoose.connect('mongodb://localhost/orders');

module.exports = mongoose.model('orders', ordersSchema);