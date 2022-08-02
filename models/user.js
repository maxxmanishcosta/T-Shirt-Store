const mongoose = require('mongoose');
const crypto = require('crypto'); //required for generation of encrypted password
const uuidv1 = require('uuid/v1'); //required for salt generation

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			maxlength: 32,
			trim: true,
		},
		lastname: {
			type: String,
			maxlength: 32,
			trim: true,
		},
		email: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		userinfo: {
			type: String,
			trim: true,
		},
		encry_password: {
			type: String,
			required: true,
		},
		salt: String,
		role: {
			type: Number,
			default: 0,
		},
		purchases: {
			type: Array,
			default: [],
		},
	},
	{ timestamps: true }
);
//records the time of the creation of entry in this schema

userSchema
	.virtual('password') //to generate virtual method in userSchema
	.set(function (password) {
		this._password = password; //copying *password* given by user in local variable
		this.salt = uuidv1(); //generates a unique salt on every call(so if password of 2 user is same then salt is different)
		this.encry_password = this.securePassword(password); //generates encry_password by using the securePassword method(generate encrypted password)
	})
	.get(function () {
		return this._password;
	}); //defining of get and set function

// userSchema
// 	.virtual('password')
// 	.set(function (password) {
// 		this._password = password;
// 		this.salt = uuidv1();
// 		this.encry_password = this.securePassword(password);
// 	})
// 	.get(function () {
// 		return this._password;
// 	});

userSchema.methods = {
	authenticate: function (plainpassword) {
		return this.securePassword(plainpassword) === this.encry_password;
	},

	securePassword: function (plainpassword) {
		if (!plainpassword) return '';
		try {
			return crypto
				.createHmac('sha256', this.salt)
				.update(plainpassword)
				.digest('hex');
		} catch (err) {
			return '';
		}
	},
};

//to export the userSchema by making model
module.exports = mongoose.model('User', userSchema);
