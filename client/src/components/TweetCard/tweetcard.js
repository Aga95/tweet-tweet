import React from "react";
import { Component } from "react";
import "../TweetCard/tweetcard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRetweet,
  faHeart,
  faComment,
} from "@fortawesome/free-solid-svg-icons";

class TweetCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <article className="TweetCard">
        <div className="TweetCardHeader">
          <span className="TweetCardProfileImage">
            <img src={this.props.image} alt="Profile" />
          </span>
          <span className="TweetCardUserMeta">
            <span className="TweetCardProfileName">
              {this.props.user} {this.props.index}
            </span>
            <span className="TweetCardProfileTag">
              @
              <a
                rel="noopener noreferrer"
                href="https://twitter.com/telianorge/status/1257370331611910145"
                target="_blank"
              >
                {this.props.userTag}
              </a>
            </span>
          </span>
        </div>
        <div className="TweetCardBody">
          <p>{this.props.text}</p>
        </div>
        <div className="TweetCardFooter">
          <div className="TweetCardFooterMetaData">{this.props.created}</div>
          <span className="TweetCardFooterObjects">
            <FontAwesomeIcon className="FontIcons" icon={faHeart} />
            {this.props.likes}
          </span>
          <span className="TweetCardFooterObjects">
            <FontAwesomeIcon className="FontIcons" icon={faRetweet} />
            {this.props.retweets}
          </span>
          <span className="TweetCardFooterObjects">
            <FontAwesomeIcon className="FontIcons" icon={faComment} />
            {this.props.replies}
          </span>
        </div>
      </article>
    );
  }
}

export default TweetCard;
