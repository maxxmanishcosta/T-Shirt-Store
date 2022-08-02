//it is the command to require the user schema so that operation can be performed
const User = require('../models/user');
const Order = require('../models/order');

//methods

//it is a param to give details of the user by giving the id of the user
exports.getUserById = (req, res, next, id) => {
	User.findById(id).exec((err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: 'No user was found in DB',
			});
		}
		req.profile = user;
		// console.log(req.profile);
		next();
	});
};

//it is a middleware to find the details of the user when user/id route is called
exports.getUser = (req, res) => {
	//these are the methods to make these properties not to be shown when we want the information of the users
	req.profile.salt = undefined;
	req.profile.encry_password = undefined;
	req.profile.createdAt = undefined;
	req.profile.updatedAt = undefined;

	return res.json(req.profile);
};

exports.updateUser = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.profile._id }, //to get the id from the user object
		{ $set: req.body }, //to update all the things in the body $set is used here
		{ new: true, useFindAndModify: false }, //from docs :(
		(err, user) => {
			if (err || !user) {
				return res.status(400).json({
					error: 'Update not sucessfull!',
				});
			} else {
				user.salt = undefined;
				user.encry_password = undefined;
				res.json(user);
			}
		}
	);
};

exports.userPurchaseList = (req, res) => {
	Order.find({ user: req.profile._id }) //anytime we are referencing something of different collection we will use populate method
		.populate('user', '_id name')
		.exec((err, order) => {
			if (err) {
				return res.status(400).json({
					error: 'NO order in this account',
				});
			}
			return res.json(order);
		});
};

exports.pushOrderInPurchaseList = (req, res, next) => {
	let purchases = [];
	req.body.order.products.forEach((product) => {
		purchases.push({
			_id: product._id,
			name: product.name,
			description: product.description,
			category: product.category,
			quantity: product.quantity,
			amount: req.body.order.amount,
			transaction_id: req.body.order.transaction_id,
		});
	});

	//store this local created purchases array into databases
	User.findOneAndUpdate(
		{ _id: req.profile._id }, //id is get from the profile of the id
		{ $push: { purchases: purchases } }, //push aur local purchases into purchases of db
		{ new: true }, //send the object as updated one not the old one
		(err, purchases) => {
			if (err) {
				return res.staus(400).json({
					error: 'Unable to save purchase list',
				});
			}
			next();
		}
	);
};
