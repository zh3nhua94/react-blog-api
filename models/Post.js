const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			require: true,
			unique: true,
		},
		username: {
			type: String,
			require: true,
		},
		desc: {
			type: String,
			require: true,
		},
		photo: {
			type: String,
		},
		categories: {
			type: Array,
		},
		deleted: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
