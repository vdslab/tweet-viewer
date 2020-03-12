import React from 'react'
import { Link } from 'react-router-dom'

const DisplayRetweetedTweetRanking = (props) => {
  return (
    <div className='media'>
      <div className='media-content'>
        <div className='content'>
          <p>
            <strong>
              <Link to={'/user/' + `${props.tweet.id_str}`}>
                {props.tweet.screen_name}
              </Link>
            </strong>
            <br />
            {props.tweet.text}
            <small>総リツイート数{props.tweet.count}</small>
            <br />
          </p>
        </div>
      </div>
    </div>
  )
}

export default DisplayRetweetedTweetRanking
