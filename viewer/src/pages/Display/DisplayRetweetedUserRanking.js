import React from 'react'
import { Link } from 'react-router-dom'

const DisplayRetweetedUserRanking = (props) => {
  return (
    <div className='media'>
      <div className='media-content'>
        <div className='content'>
          <p>
            <strong>
              <Link to={'/user/' + `${props.user.id_str}`}>
                {props.user.screen_name}
              </Link>
            </strong>
            <br />
            <small>総リツイート数{props.user.count}</small>
            <br />
          </p>
        </div>
      </div>
    </div>
  )
}

export default DisplayRetweetedUserRanking
