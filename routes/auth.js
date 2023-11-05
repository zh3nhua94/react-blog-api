const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/signup", async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		const newUser = new User({
			username: req.body.username,
			displayName: req.body.displayName,
			email: req.body.email,
			password: hashedPassword,
		});
		const saveUser = await newUser.save();
		res.status(200).json(saveUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		//if no user found
		if (!user) {
			res.status(404).json("Wrong Credentials");
			return;
		}
		//compare password to login
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			res.status(404).json("wrong password");
			return;
		}
		const { password, ...others } = user._doc;
		//if all correct
		res.status(200).json(others); //notice spread operator is not inside here
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
