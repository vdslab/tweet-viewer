import React from 'react'
import { Link } from 'react-router-dom'

class DisplayRetweetedTweetRanking extends React.Component {
  render() {
    return (
      <div className='media'>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>
                <Link to={'/user/' + `${this.props.tweet.id_str}`}>
                  {this.props.tweet.screen_name}
                </Link>
              </strong>
              <br />
              {this.props.tweet.text}
              <small>総リツイート数{this.props.tweet.count}</small>
              <br />
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default DisplayRetweetedTweetRanking
