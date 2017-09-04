# Mongo-News-Scraper
----------
## Table of Contents 
1. [Overview](#overview)
2. [Technologies](#technologies)
3. [Local Installation](#installation)
4. [App Display](#display)

<a name="overview"></a>
## Overview 
Mongo-News-Scraper is a web app that allows users to scrape articles from Hypebeast.com (street fashion blog). The app also allows users to view, comment, save, and delete articles of their choice. The front-end display of the app uses handlebars and bootstrap.  

<a name="technologies"></a>
## Technologies
 - Express.js 
 - Moment.js
 - Express Handlebars
 - Bootstrap
 - Cheerio
 	- for scraping Hypebeast.com 
 - Mongoose 
 - MongoDB
 	- Local database
 - mLab 
 	- Deployed Heroku database 

<a name="installation"></a>
## Local Installation
### Step 1: Git Clone
Clone Mongo-News-Scraper to your local git repo like the following:
> git clone https://github.com/lawrencel13110123/Mongo-News-Scraper
The Mongo-News-Scraper project and its files should now be in your project folder.

### Step 2: Install Dependencies
Install the following dependencies listed in the `package.json` file: 
> npm install
Once completed, you will see a `node_modules` folder in your local repo.
The dependencies should now be in the local `node_modules` folder.

### Step 3: Launch app 
Via terminal type in these bash command once you are in the Mongo-News-Scraper root directory 
> node server.js 

This step will automatically create the necessary MongoDB. 

Go to your browser and type in `localhost:3000` in your URL bar. Now you should see the application open locally.
Click on "Get News" to scrape from Hypebeast.com 
The application will store all scraped articles from past to present. 
Click on the trash can icon to delete comments or saved articles. 
To visit deployed application, go to https://fierce-mesa-57401.herokuapp.com/

<a name="display"></a>
## App Display
### Demo
![Demo](/public/assets/images/demo.gif)