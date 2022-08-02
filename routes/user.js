const express = require('express');
const router = express.Router();

const {
	getUserById,
	getUser,
	updateUser,
	userPurchaseList,
} = require('../controllers/user');
const {
	isSignedIn,
	isAuthenticated,
	isAdmin,
} = require('../controllers/authentication');

//param is used for handling dynamic requests using experss
//like showing details according to id of profile
router.param('userId', getUserById);

//route to get user
router.get('/user/:userId', isSignedIn, isAuthenticated, getUser);
router.put('/user/:userId', isSignedIn, isAuthenticated, updateUser);
router.get(
	'/orders/user/:userId',
	isSignedIn,
	isAuthenticated,
	userPurchaseList
);

module.exports = router;
