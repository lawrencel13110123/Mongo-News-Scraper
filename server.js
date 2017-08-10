var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request'); // for web-scraping
var cheerio = require('cheerio'); // for web-scraping
var logger = require("morgan");
var mongoose = require("mongoose");
var Comment = require("./models/comment.js");
var Article = require("./models/article.js");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

// Launch App
var port = process.env.PORT || 3000;

// Initialize Express for debugging & body parsing
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}))

// Serve Static Content
app.use(express.static(process.cwd() + '/public'));

// Express-Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Database configuration with mongoose
var databaseUri = "mongodb://localhost/fashion-scraper";

if (process.env.MONGODB_URI) {
	// console.log("using myLab")
	mongoose.connect(process.env.MONGODB_URI)
} else {
	// console.log("using local")
	mongoose.connect(databaseUri)
}
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// put require at the end because it has to go through bodyParser first
// bodyParser is what provides you with req.body
require("./controllers/controller")(app);

app.listen(port, function(){
  console.log('Running on port: ' + port);
});

