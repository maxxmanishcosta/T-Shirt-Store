// const { overEvery } = require('lodash');
// const order = require('../models/order');
const { Order, ProductCart } = require('../models/order');

exports.getOrderById = (req, res, next, id) => {
	Order.findById(id)
		//products.product will be studied in front end
		.populate('products.product', 'name price')
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: 'No order found!!',
				});
			}
			req.order = order;
			next();
		});
};

exports.createOrder = (req, res) => {
	req.body.order.user = req.profile;
	const Order = new Order(req.body.order);
	order.save((err, order) => {
		if (err) {
			return res.status(400).json({
				error: 'unable to save order in Db',
			});
		}
		res.json(order);
	});
};

exports.getAllOrders = (req, res) => {
	Order.find()
		.populate('user', '_id name')
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: 'No orders found!!',
				});
			}
			res.json(order);
		});
};

exports.orderStatus = (req, res) => {
	res.json(Order.schema.path('status').enumValues);
};

exports.updateStatus = (req, res) => {
	Order.update(
		{ _id: req.body.orderId },
		{ $set: { status: req.body.status } },
		(err, order) => {
			if (err) {
				return res.status(400).json({
					error: "Can't update order status!!",
				});
			}
			res.json(order);
		}
	);
};
