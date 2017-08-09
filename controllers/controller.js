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
					console.log(doc)
				}
			})
		}

		// for (j = 0 ; j < obj.length ; j++) {
		// 	var entry = new Article(obj[j])
		// 	Article.count({title: entry.title}).exec(function (err, test) {
		// 		if (err) {
		// 			console.log(err)
		// 		} else if (test === 0) {
		// 			entry.save(function(err, doc) {
		// 				if (err) {
		// 					console.log(err)
		// 				}
		// 				else {
		// 					console.log(doc)
		// 				}
		// 			})
		// 		}
		// 	})
		// }
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
      	console.log(doc)
        var hbsObject = {articles: doc}
        res.render('index', hbsObject);
      }
    });
  })

  	app.post('/add/comment/:id', function (req, res){
  		console.log(req)
  		console.log(req.body)

		// Collect article id
		var articleId = req.params.id;

		// Collect Author Name
		var commentAuthor = req.body.author;

		// Collect Comment Content
		var commentContent = req.body.comment;

		// "result" object has the exact same key-value pairs of the "Comment" model
		var result = {
			author: commentAuthor,
			content: commentContent
		};

		// Using the Comment model, create a new comment entry
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
		          res.send("success");
		        }
		      });
		    }
	  	});

	});


}
