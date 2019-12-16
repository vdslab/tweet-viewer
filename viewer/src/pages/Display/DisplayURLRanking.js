import React from 'react'
import { Link } from 'react-router-dom'

export default (props) => {
  return (
    <div className='media'>
      <div className='media-content'>
        <div className='content'>
          <p>
            <strong>
              <Link to={'/url/' + `${encodeURIComponent(props.url.URL)}`}>
                {props.url.URL}
              </Link>
            </strong>
            <br />
            <small>このURLが貼られた回数{props.url.count}</small>
            <br />
          </p>
        </div>
      </div>
    </div>
  )
}
