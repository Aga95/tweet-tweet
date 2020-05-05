const express = require("express");
const bodyParser = require("body-parser");
const Twitter = require("twit");
const socket = require("socket.io")();
require("dotenv/config");

const app = express();
const port = 8080;
const ioPort = 5000;

console.log("Starting");

var T = new Twitter({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

socket.listen(port, () => console.log(`Socket IO is listening ${port}`));

socket.on("connection", function (socket) {
  var stream;

  socket.on("clientStartStream", function (data) {
    console.log(data);

    stream = T.stream("statuses/filter", {
      track: data.track,
    });

    stream.on("connect", function (request) {});

    stream.on("tweet", function (tweet) {
      var tweetObj = {
        id: tweet.id_str,
        user_tag: tweet.user.screen_name,
        user: tweet.user.name,
        text: tweet.text,
        image: tweet.user.profile_image_url,
        likes: tweet.favorite_count,
        retweets: tweet.retweet_count,
        replies: tweet.reply_count,
        created: tweet.created_at.split("+")[0],
      };
      socket.emit("newTweet", tweetObj);
    });

    stream.on("error", function (error) {
      console.log(error);
    });
  });

  socket.on("clientCancelStream", function (text) {
    console.log(text);
    stream.stop();
  });
});
