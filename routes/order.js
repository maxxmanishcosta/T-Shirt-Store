var express = require('express');
var router = express.Router(); //using express router

const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
} = require('../controllers/authentication');

const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
const { updateStockAndSold } = require('../controllers/product');
const {
	getOrderById,
	createOrder,
	getAllOrders,
	orderStatus,
	updateStatus,
} = require('../controllers/order');

//params
router.param('userId', getUserById);
router.param('orderId', getOrderById);

//actual routes

//create
router.post(
	'/order/create/:userId',
	isSignedIn,
	isAuthenticated,
	pushOrderInPurchaseList,
	updateStockAndSold,
	createOrder
);
//read
router.get(
	'/order/all/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	getAllOrders
);

//status of an order
router.get(
	'/order/status/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	orderStatus
);
//update
router.put(
	'/order/:orderId/status/:userId',
	isSignedIn,
	isAuthenticated,
	isAdmin,
	updateStatus
);

module.exports = router;
