const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");
const url = "mongodb://127.0.0.1:27017/backend-hw"; // change this as needed

mongoose.connect(url, { useNewUrlParser: true });

const db = mongoose.connection;
db.once("open", (_) => {
  console.log("Database connected:", url);
});

db.on("error", (err) => {
  console.error("connection error:", err);
});

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

const Schema = mongoose.Schema;
const image = new Schema({
  date: String,
  image_url : String,
});

const Images = mongoose.model("Images", image);

// The method of the root url. Be friendly and welcome our user :)
router.get("/", function (req, res) {
  res.json({ message: "Welcome to the APOD app." });
});

router.get("/favorite", function (req, res) {
  // TODO:
  Images.find().then((results) => {
    res.json({results});
  });
});

router.post("/add", function (req, res) {
  // TODO:
  const url = req.body.image_url;
  const date = req.body.date;
  const newImage = new Images({
    date: date,
    image_url: url,
  })
  newImage.save((error, doc) => {
    if (error) {
      res.json({ status: "failure"})
    } else {
      res.json({
        date: date,
        image_url: url,
      });
    }
  });
});

router.post("/delete", function (req, res) {
  const date = req.body.date;
  Images.findOneAndDelete({ date: date }).then(()=>{res.json({ message: "delete success" });
  })
});

app.use("/api", router); // API Root url at: http://localhost:8080/api

app.listen(port);
console.log("Server listenning on port " + port);
