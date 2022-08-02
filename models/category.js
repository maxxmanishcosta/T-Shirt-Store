const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: true,
			maxlength: 32,
			unique: true,
		},
	},
	{ timestamps: true }
); //records the time of the creation of entry in this schema

//to export this category
module.exports = mongoose.model('Category', categorySchema);
