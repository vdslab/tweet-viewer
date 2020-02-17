import React from 'react'
import { Link } from 'react-router-dom'

const DisplayTweet = (props) => {
  console.log(props)
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
            <br />
            {props.tweet.text}
            <br />
            <small>{`${jst}`}</small>
          </p>
        </div>
      </div>
    </div>
  )
}

export default DisplayTweet
