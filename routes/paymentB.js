var express = require('express');
var router = express.Router(); //using express router
const {
	isSignedIn,
	isAuthenticated,
} = require('../controllers/authentication');
const { getToken, processPayment } = require('../controllers/paymentB');
const { getUserById } = require('../controllers/user');

//middleware
router.param('userId', getUserById);

//routes
router.get('/payment/gettoken/:userId', isSignedIn, isAuthenticated, getToken);

router.post(
	'/payment/braintree/:userId',
	isSignedIn,
	isAuthenticated,
	processPayment
);

module.exports = router;
