var express = require('express');
var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var Comment = require("../models/comment.js");
var Article = require("../models/article.js");




module.exports = function(app) {
	app.get("/", function(req, res) {
		res.redirect("/scrape");
	});

	function scrape () {
		request("https://hypebeast.com/fashion", function(err, response, html) {
			var $ = cheerio.load(html); 
			var resultsOne = []; 
			$("div.title-wrapper").each(function(i, element) {
				var title = $(element).text(); 
				var link = $(element).children().attr("href"); 

					resultsOne.push({
						title: title, 
						link: link
					})
			})

			console.log(resultsOne)

			var resultsTwo = []; 
			$("div.teaser").each(function(i, element) {
				var a = $(element).children(); 
				var image = a.children().attr("src")

				resultsTwo.push({
					image: image
				})
			})

			console.log(resultsTwo)



			var obj = []
			for (i = 0 ; i < resultsOne.length ; i++) {
				obj.push({"title": resultsOne[i].title, "link": resultsOne[i].link, "image": resultsTwo[i].image})			
			}
			console.log("=====================================================")
			console.log(obj)
			console.log("=====================================================")

			for (j = 0 ; j < obj.length ; j++) {
				var entry = new Article(obj[j])
				entry.save(function(err, doc) {
					if (err) {
						console.log(err)
					} else {
						// console.log(doc)
						console.log("article saved to Mongo")
					}
				})
			}
		})
	}

	app.get("/scrape", function(req, res) {
		scrape()
		res.redirect("/articles")
	});

	app.get("/articles", function (req, res) {
		Article.find().sort({_id: -1})
		.populate('comments')
		.exec(function(err, doc){
		  if (err){
		    console.log(err);
		  } 
		  else {
		  	// console.log(doc)
		    var hbsObject = {articles: doc}
		    res.render('index', hbsObject);
		  }
		});
	});

	app.post('/add/comment/:id', function (req, res){
		console.log(req.body)

		//Collect article id
		var articleId = req.params.id;
		console.log(articleId)

		// Collect Author Name
		var commentAuthor = req.body.author;
		console.log(commentAuthor)

		// Collect Comment Content
		var commentContent = req.body.comment;
		console.log(commentContent)

		// "result" object has the exact same key-value pairs of the "Comment" model
		var result = {
			author: commentAuthor,
			content: commentContent
		};

		//Using the Comment model, create a new comment entry
		var entry = new Comment(result);

		// Save the entry to the database
		entry.save(function(err, doc) {
		    // log any errors
		    if (err) {
		      console.log(err);
		    } 
		    // Or, relate the comment to the article
		    else {
		      // Push the new Comment to the list of comments in the article
		      Article.findOneAndUpdate({'_id': articleId}, {$push: {'comments':doc._id}}, {new: true})
		      // execute the above query
		      .exec(function(err, doc){
		        // log any errors
		        if (err){
		        	console.log(err);
		        } else {
		        	console.log("comment successfully added")
		        	// res.status(200)
		        	res.redirect("/articles")
		          // res.send("success");
		        }
		      });
		    }
		});

	});

	app.get('/save/:id', function (req, res) {
		Article.findOneAndUpdate({"_id": req.params.id}, {"saved": true}, {new: true}).exec(function (err, newdoc) {
        if(err) {
          res.send(err)
        }
        else {
          console.log("article saved successfully")
          res.status(200)
          // res.redirect("/articles")
        }
      })

	})

	app.get('/save', function (req, res) {
		Article.find({"saved": true}).exec(function (err, doc) {
        if(err) {
          res.send(err)
        }
        else {
        	var hbsObject = {savedDoc: doc}
		    res.render('saved', hbsObject);
		    // res.send(doc)
        }
      })

	})

	app.get('/remove/:id', function (req, res) {
		Article.findOneAndUpdate({"_id": req.params.id}, {"saved": false}, {new: true}).exec(function (err, newdoc) {
        if(err) {
          res.send(err)
        }
        else {
          res.redirect("/save")
        }
      })

	})

	app.get('/comment/:id', function (req, res) {
		Article.findOne({"_id":req.params.id}).exec(function (err, result) {
			if (err) {
				console.log(err)
			} else {
				Comment.find({"_id": result.comments}).sort({"createdOn": 1}).exec(function (err, found) {
					if (err) {
						console.log(err)
					} else {
						res.json(found)
					}
				})
			}
		})
	})

	app.get('/remove/comment/:id', function(req, res) {
		Comment.findOne({"_id": req.params.id}).remove().exec(function (err, remove) {
			if (err) {
				console.log(err)
			} else {
				res.redirect("/articles")
			}
		})
	})
}


