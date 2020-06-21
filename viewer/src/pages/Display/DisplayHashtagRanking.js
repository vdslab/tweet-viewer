import React from 'react'
import { Link } from 'react-router-dom'

const DisplayHashtagRanking = (props) => {
  return (
    <div className='media'>
      <div className='media-content'>
        <div className='content'>
          <p>
            <strong>
              <Link to={'/hashtag/' + `${props.hashtag.hashtag}`}>
                {`#${props.hashtag.hashtag}`}
              </Link>
            </strong>
            <br />
            <small>tagされた数{props.hashtag.count}</small>
            <br />
          </p>
        </div>
      </div>
    </div>
  )
}

export default DisplayHashtagRanking
