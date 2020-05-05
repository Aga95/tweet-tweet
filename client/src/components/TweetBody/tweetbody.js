import React, { Component } from "react";
import TweetCard from "../TweetCard/tweetcard";
import openSocket from "socket.io-client";
import "../TweetBody/tweetbody.css";
const socket = openSocket("http://localhost:8080");

var allTweets = [];
var streamStarted = false;

function createTweets(page_start, page_end) {
  allTweets.reverse();
  var tweetsArray;
  if (allTweets.length >= 10) {
    tweetsArray = allTweets.slice(page_start, page_end);
  } else {
    tweetsArray = allTweets;
  }
  var tweetCards = tweetsArray.map((tweet, index) => (
    <TweetCard
      className="TweetCard"
      key={tweet.id}
      id={tweet.id}
      user={tweet.user}
      userTag={tweet.user_tag}
      text={tweet.text}
      image={tweet.image}
      likes={tweet.likes}
      retweets={tweet.retweets}
      replies={tweet.replies}
      created={tweet.created}
      position={index}
    />
  ));

  return tweetCards;
}

class TweetBody extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tweets: 0,
      currentPage: 1,
      page_start: 0,
      page_end: 10,
      pageSize: 10,
    };
  }
  nextPage = () => {
    if (this.state.page_end < allTweets.length)
      this.setState({
        page_start: this.state.page_start + this.state.pageSize,
        page_end: this.state.page_end + this.state.pageSize,
        currentPage: this.state.currentPage + 1,
      });
  };

  previousPage = () => {
    if (this.state.page_start !== 0) {
      this.setState({
        page_start: this.state.page_start - this.state.pageSize,
        page_end: this.state.page_end - this.state.pageSize,
        currentPage: this.state.currentPage - 1,
      });
    }
  };

  cancelStream = () => {
    if (streamStarted === true) {
      streamStarted = false;
      socket.emit("clientCancelStream", "Cancelling Stream");
    }
  };

  startStream = () => {
    var dataObj = {
      notion: "Starting Stream",
      track: document.getElementById("track").value,
    };

    if (streamStarted === false) {
      if (dataObj.track !== "") {
        streamStarted = true;
        socket.emit("clientStartStream", dataObj);
      } else {
        alert("Please fill out the keyword/phrase you want to search with");
      }
    } else {
      alert("Please close the current stream before you start a new one.");
    }
  };

  componentDidMount() {
    var self = this;

    socket.on("newTweet", function (data) {
      if (allTweets.length <= 100) {
        allTweets.push(data);
      } else {
        allTweets.splice(0, 1);
        // allTweets.pop();
      }

      self.setState({
        tweets: self.state.tweets + 1,
      });
    });
  }

  render() {
    return (
      <div className="tweetBody">
        <div>
          Tweets: {this.state.tweets} Page: {this.state.currentPage} -{" "}
          {this.state.page_start}/100
        </div>

        <button onClick={this.previousPage}>Previous Page</button>
        <button onClick={this.nextPage}>Next Page</button>
        <form>
          <label htmlFor="track">Track keywords/phrase</label>
          <input type="text" id="track" name="track"></input>
        </form>
        <button onClick={this.cancelStream}> Stop Stream </button>
        <button onClick={this.startStream}> Start Stream </button>
        <div>{createTweets(this.state.page_start, this.state.page_end)}</div>
      </div>
    );
  }
}

export default TweetBody;
