const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const { parse } = require('path');
const { query } = require('express');

exports.getProductById = (req, res, next, id) => {
	Product.findById(id).exec((err, product) => {
		if (err) {
			return res.status(400).json({
				error: 'product is not found',
			});
		}
		req.product = product;
		next();
	});
};

exports.createProduct = (req, res) => {
	console.log(req);
	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, feilds, file) => {
		if (err) {
			return res.status(400).json({
				error: "product can't be created...please check the file again",
			});
		}

		//destructuring the feilds
		const { name, description, price, category, stock, sold } = feilds;

		//adding restrictions to the feild parameters

		if (!name || !description || !price || !category || !stock) {
			return res.status(400).json({
				error: 'All of these feilds are required!!',
			});
		}

		let product = new Product(feilds);

		//file handling
		if (file.photo) {
			if (file.photo.size > 3145728) {
				return res.status(400).json({
					error: 'file size is bigger than expected...',
				});
			}
			//for adding file this is the syntaxx
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}

		//save to database
		product.save((err, prod) => {
			if (err) {
				res.status(400).json({
					error: 'Saving in database failed..',
				});
			}
			res.json(prod);
		});
	});
};

exports.getProduct = (req, res) => {
	req.product.photo = undefined;
	return res.json(req.product);
};

exports.photo = (req, res, next) => {
	if (req.product.photo.data) {
		res.set('content-type', req.product.photo.contentType);
		return res.send(req.product.photo.data);
	}
	next();
};

exports.updateProduct = (req, res) => {
	//TODO study about lodash module in detail

	let form = new formidable.IncomingForm();
	form.keepExtensions = true;

	form.parse(req, (err, feilds, file) => {
		if (err) {
			return res.status(400).json({
				error: "product can't be created...please check the file again",
			});
		}

		//updation code
		let product = req.product;
		product = _.extend(product, feilds);

		//file handling
		if (file.photo) {
			if (file.photo.size > 3145728) {
				return res.status(400).json({
					error: 'file size is bigger than expected...',
				});
			}
			//for adding file this is the syntaxx
			product.photo.data = fs.readFileSync(file.photo.path);
			product.photo.contentType = file.photo.type;
		}

		//save to database
		product.save((err, prod) => {
			if (err) {
				res.status(400).json({
					error: 'Product Updation failed..',
				});
			}
			res.json(prod);
		});
	});
};

exports.deleteProduct = (req, res) => {
	let product = req.product;
	product.remove((err, removedProduct) => {
		if (err) {
			res.status(400).json({
				error: "the product can't be deleted having the product id: ",
			});
		}
		return res.json({
			message: 'Deletion was a success',
			removedProduct,
		});
		// return res.json({
		// 	message: 'Sucessfully deleted!!',
		// 	removedProduct,
		// });
	});
};

//listing routes
exports.getAllProducts = (req, res) => {
	let limit = req.query.limit ? parseInt(req.query.limit) : 8;
	let sortBy = req.query.sortBy ? req.query.sortBy : '_id';

	Product.find()
		.select('-photo')
		.populate('category')
		.sort([[sortBy, 'asc']])
		.limit(limit)
		.exec((err, products) => {
			if (err) {
				return res.status(400).json({
					error: 'Unable to get the products!!',
				});
			}
			res.json(products);
		});
};

exports.updateStockAndSold = (req, res, next) => {
	//loop through the products
	let myOperations = req.body.order.product.map((prod) => {
		return {
			updateOne: {
				filter: { _id: prod._id },
				update: { $inc: { stock: -prod.count, sold: +prod.count } },
			},
		};
	});

	Product.bulkWrite(myOperations, {}, (err, products) => {
		if (err) {
			return res.status(400).json({
				error: 'Bulk Operation failed!!',
			});
		}
		res.json(products);
	});

	next();
};

exports.getAllUniqueCategories = (req, res) => {
	Product.distinct('category', {}, (err, category) => {
		if (err) {
			return res.status(400).json({
				error: 'NO category found!!',
			});
		}
		res.json(category);
	});
};
