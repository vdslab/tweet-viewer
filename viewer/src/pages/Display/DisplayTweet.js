import React from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../services/index'

const DisplayTweet = (props) => {
  const jst = new Date(props.tweet.JSTtime.value)
  return (
    <div className='media'>
      <div className='media-content'>
        <div className='content'>
          <p>
            <strong>
              <Link to={'/user/' + `${props.tweet.user.id_str}`}>
                {props.tweet.user.name}
              </Link>
            </strong>
            <small>{`${formatDate(jst, 'yyyy-MM-dd HH:mm:ss')}`}</small>
            <br />
            {props.tweet.text}
            <br />
          </p>
        </div>
      </div>
    </div>
  )
}

export default DisplayTweet
