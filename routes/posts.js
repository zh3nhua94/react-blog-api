const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//CREATE POST
router.post("/", async (req, res) => {
	const newPost = new Post(req.body);
	try {
		const savePost = await newPost.save();
		res.status(200).json(savePost);
	} catch (err) {
		res.status(500).json(err);
	}
});
//UPDATE POST
router.put("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				const updatedPost = await Post.findByIdAndUpdate(
					req.params.id,
					{
						$set: req.body,
					},
					{ new: true } //so that json prints the newly updated post
				);
				res.status(200).json(updatedPost);
			} catch (err) {
				res.status(500).json(err);
			}
		} else {
			res.status(401).json("You can update only your posts");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE POST
router.delete("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (post.username === req.body.username) {
			try {
				await post.deleteOne();
				res.status(200).json("Post has been deleted...");
			} catch (err) {
				res.status(500).json("Unable to delete post");
			}
		} else {
			res.status(401).json("You can delete only your posts");
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET POST
router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL POSTS
//using query, ?username=john or ?cat=music
router.get("/", async (req, res) => {
	const username = req.query.user;
	const catName = req.query.cat;
	try {
		let posts;
		if (username) {
			posts = await Post.find({
				username: username,
				deleted: false,
			});
		} else if (catName) {
			posts = await Post.find({
				categories: {
					$in: [catName], //$in where the value of a field in DB equals any value in the specified array.
				},
				deleted: false,
			});
		} else {
			posts = await Post.find({
				deleted: false,
			});
		}
		res.status(200).json(posts);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
