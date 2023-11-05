const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

dotenv.config(); //.env ready to use

mongoose
	.connect(process.env.MONGO_URL)
	.then(console.log("Connected to MongoDB"))
	.catch((err) => console.log(err));

//middleware
app.use(
	cors({
		origin: process.env.SITE_URL,
	})
);
app.use(express.json());
app.use(
	helmet({
		crossOriginResourcePolicy: false, //solve the static images file serving problem
	})
);
app.use(morgan("common"));
app.use("/images", express.static(path.join(__dirname, "/images")));

//Multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
		// cb(null, "hello.jpg");
		//To test in postman, need to use form-data, key -> file & file, because of form-data we cant send raw json so instead of req.body.name, here need to manually set 'hello.jpg' here for testing
	},
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
	//.single() means only upload 1 file
	try {
		return res.status(200).json("File uploaded successfully");
	} catch (err) {
		console.log(err);
	}
});

//Route
app.use("/api/auth", authRoute); //(URL, fileToConnect)
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.listen("8800", () => {
	console.log("Backend server is running!!");
});
