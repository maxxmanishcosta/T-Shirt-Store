const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const expressJwt = require('express-jwt');

//signup
exports.signup = (req, res) => {
	console.log(req);
	var errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}
	var user = new User(req.body);
	user.save((err, user) => {
		if (err) {
			res.status(400).json({
				err: 'the user is not saved:(',
			});
			console.log(err);
		} else {
			res.json({
				name: user.name,
				lastname: user.lastname,
				email: user.email,
				id: user._id,
				message: 'The user is successfully saved!',
			});
		}
	});
};

//signin
exports.signin = (req, res) => {
	const { email, password } = req.body;
	var errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({ errors: errors.array() });
	}

	User.findOne({ email: email }, (err, user) => {
		if (!user) {
			return res.status(400).json({
				errors: [{ msg: 'Email ID does not found.', param: 'email' }],
			});
		}
		// console.log(user);

		if (!user.authenticate(password)) {
			return res
				.status(401)
				.json({ errors: [{ msg: 'Incorrect PASSWORD.', param: 'password' }] });
		}
		if (err) {
			return res.status(400).json({ error: 'Wrong input.' });
		}

		// create token
		const token = jwt.sign({ _id: user._id }, process.env.SECRET);

		//put token in cookie
		res.cookie('token', token, { expire: new Date() + 99 });

		//sending response
		const { _id, name, email, role } = user;
		res.json({ token, user: { _id, name, email, role } });
	});
};

//signout
exports.signout = (req, res) => {
	res.clearCookie('token');
	res.json({ message: 'User signout successfully!' });
};

// //protected routes

//since this is a middleware but we are not writing next because expressJwt method
//this method aldready get next covered up for us

exports.isSignedIn = expressJwt({
	//used to protect the routes using express jwt
	secret: process.env.SECRET, //works on 2 parameters secret and userProperty
	userProperty: 'auth', //this middleware puts the get request in auth
});

exports.isAuthenticated = (req, res, next) => {
	let checker = false;
	checker = req.profile && req.auth && req.profile._id == req.auth._id;
	console.log(checker);
	if (!checker) {
		return res.status(403).json({
			error: 'ACCESS DENIED!',
		});
	}
	next();
};

exports.isAdmin = (req, res, next) => {
	if (req.profile.role === 0) {
		res.status(403).json({
			error: 'YOU ARE NOT ADMIN, ACCESS DENIED!',
		});
	}
	next();
};

//custom middlewares
