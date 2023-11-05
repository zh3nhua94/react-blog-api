const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

//UPDATE user
router.put("/:id", async (req, res) => {
	//find user id first
	if (req.body.userId === req.params.id) {
		//if user wants update password
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		//update other body data
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true } //so that json prints the newly updated user
			);
			res.status(200).json(updatedUser);
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		return res.status(403).json("You can update only your account!");
	}
});

//DELETE user
router.delete("/:id", async (req, res) => {
	//find user id first
	if (req.body.userId === req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			try {
				//Delete All posts of user
				await Post.deleteMany({ username: user.username });
				//Delete user by Id
				await User.findByIdAndDelete(req.params.id);
				res.status(200).json("User has been deleted.");
			} catch (err) {
				res.status(500).json(err);
			}
		} catch (err) {
			res.status(404).json("User not found");
		}
	} else {
		return res.status(403).json("You can delete only your account!");
	}
});

//GET user
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET a user through query
router.get("/", async (req, res) => {
	//using query, localhost:8800/api/users?userId=12345678
	//using query, localhost:8800/api/users?username=12345678
	const userId = req.query.userId;
	const username = req.query.username;
	try {
		const user = userId ? await User.findById(userId) : await User.findOne({ username: username });
		//separate sensitive data like password and updatedAt, from the other data
		const { password, ...other } = user._doc;
		//then we only retrieve 'other' data
		res.status(200).json(other);
	} catch (err) {
		return res.status(500).json(err);
	}
});

module.exports = router;
