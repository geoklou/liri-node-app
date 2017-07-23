
// include npm twitter package
var Twitter = require("twitter");
// include npm request package
var request = require("request");
// include npm inquirer package
var inquirer = require("inquirer");
// include npm spotify package
var Spotify = require("node-spotify-api");
// create file system variable
var fs = require("fs");

//get input as command
var command = process.argv[2];

//varaible to define url
var queryUrl = "";

//switch by command input
switch (command) {
  case "my-tweets":
    //get keys from key.js
    var key = require("./keys.js");
    var keys = key.twitterKeys;

    //crate client object with authentication keys
    var client = new Twitter({
      consumer_key: keys.consumer_key,
      consumer_secret: keys.consumer_secret,
      access_token_key: keys.access_token_key,
      access_token_secret: keys.access_token_secret
    });
    //just created twitter account - many profile info missing, maybe that's why my username does not return any text. 
    //so used an established user to test search by query
    client.get('search/tweets', {q:'@wbez', count:10}, function(error, tweets, response) {
      if(error) {
          return console.log(error);
        }
          //loop to get list of tweets
          for (var i = 0; i < tweets.statuses.length ; i++ ){
          console.log(tweets.statuses[i].text);
          }
        console.log("----------------------------------------------------------------------");
    });
    break;

  case "spotify-this-song":
    //get keys from key.js
    var spkey = require("./keys.js");
    var spkeys = spkey.spotifyKeys;
    //get user input
    var input = process.argv;
    // console.log(input);
    //get input from index 3 onwards
    var songName = input.slice(3,input.length).join(' ');
    // console.log(command + "/ " + songName);
    //create object
    var spotify = new Spotify({
      id: spkeys.clientId,
      secret: spkeys.clientSecret
    });
    
    spotify.search({ type: 'track', query: songName }, function(err, data) {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
    // console.log(data);
    // console.log(JSON.stringify(data));   
    console.log("Artist/s: " + data.tracks.items[0].album.artists[0].name);
    console.log("Song Title: " + songName);
    //not able to figure out the object structure - deep, many branches. many repeat patterns & names
    console.log("Preview: " + data.tracks.items[0].album.artists[0].preview_url);
    console.log("Album: " + data.tracks.items[0].album.name);
    console.log("----------------------------------------------------------------------");
    });
    break;

  case "movie-this":
  var input = process.argv;
  //get input from index 3 onwards
  var movieName = input.slice(3,input.length).join(' ');

    //if no input from index 3 onwards
    if (movieName === "")
    {
    //retrieve Mr. Nobody's data from OMDB by movie ID
    queryUrl = "http://www.omdbapi.com/?i=tt0485947&y=&plot=short&apikey=40e9cece";
    console.log("If you haven't watched Mr. Nobody, then you should. It's on Netflix!");
    } 
    else {
    //request OMDB API with movie title
    queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=40e9cece";
    }
    request(queryUrl, function(error, response, body) {

    // If request is successful
    if (!error && response.statusCode === 200) {
    // Parse body
    console.log("Title: " + JSON.parse(body).Title);
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("Rating: " + JSON.parse(body).Rated);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Country of Production: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Actors: " + JSON.parse(body).Actors);
    console.log("----------------------------------------------------------------------");
      }
    });
    break;

  case "do-what-it-says":
    //read file random.txt
    fs.readFile("random.txt", "utf8", function(error, data) {

      // If code experiences any errors log error to console
      if (error) {
        return console.log(error);
      }

      //print data
      console.log(data);

    //write to log.txt
    fs.writeFile("log.txt", data, function(err) {

      // If code experiences any errors log error to console
      if (err) {
        return console.log(err);
      }
      //Otherwise, print whatever is in random.txt
      console.log("log.txt was updated!");
      });

    });
    break;

  default:
    //Statements executed when none of the values match the value of the expression
    console.log("invalid input");
    break;
}