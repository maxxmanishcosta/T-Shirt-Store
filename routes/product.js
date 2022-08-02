const express = require('express');
const router = express.Router();

const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
} = require('../controllers/authentication');
const { getCategoryById } = require('../controllers/category');
const { getUserById } = require('../controllers/user');
const {
	getProductById,
	createProduct,
	getProduct,
	photo,
	updateProduct,
	deleteProduct,
	getAllProducts,
	getAllUniqueCategories,
} = require('../controllers/product');

//all of the params
router.param('userId', getUserById);
router.param('productId', getProductById);
router.param('categoryId', getCategoryById);

//all of the actual routes

//create routes
router.post(
	'/product/create/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	createProduct
);

//read routes
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);
router.get('/products/categories', getAllUniqueCategories);

//update routes
router.put(
	'/product/:productId/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateProduct
);

//delete routes
router.delete(
	'/product/:productId/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	deleteProduct
);

//listing routes
router.get('/products', getAllProducts); //done testing

module.exports = router;
