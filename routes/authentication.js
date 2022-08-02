var express = require('express');
var router = express.Router(); //using express router
const { check, validationResult } = require('express-validator');

//signout route decalred in controlleres
const {
	signout,
	signup,
	signin,
	isSignedIn,
} = require('../controllers/authentication.js');

router.post(
	'/signup',
	[
		check('name')
			.isLength({ min: 3 })
			.withMessage('name must be at least 3 character long'),
		check('email').isEmail().withMessage('email is required'),
		check('password')
			.isLength({ min: 8 })
			.withMessage('Password must be minimum 8 characters long'),
	],
	signup
); //signup router

// router.post(
// 	'/signin',
// 	[
// 		check('email').isEmail().withMessage('email is required'),
// 		check('password')
// 			.isLength({ min: 8 })
// 			.withMessage('Password feild is required and minimum of 8 characters!'),
// 	],
// 	signin
// );

router.post(
	'/signin',
	[
		check('email', 'Email is empty or invalid').isEmail().normalizeEmail(),
		check('password', 'password is wrong or empty').isLength({ min: 8 }),
	],
	signin
);

router.get('/signout', signout); //signout router

router.get('/testroute', isSignedIn, (req, res) => {
	res.json(req.auth);
});

//exports the router created in express
module.exports = router;
