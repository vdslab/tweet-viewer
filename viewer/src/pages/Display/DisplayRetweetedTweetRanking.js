import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../services/index'

const DisplayRetweetedTweetRanking = (props) => {
  const jst = new Date(props.tweet.JSTtime.value)
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
            <small>{`${formatDate(jst, 'yyyy-MM-dd HH:mm:ss')}`}</small>
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
