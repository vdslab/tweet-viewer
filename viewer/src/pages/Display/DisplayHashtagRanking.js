import React from 'react'
import { Link } from 'react-router-dom'

class DisplayHashtagRanking extends React.Component {
  render() {
    return (
      <div className='media'>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>
                <Link to={'/hashtag/' + `${this.props.tweet.hashtag}`}>
                  {`#${this.props.tweet.hashtag}`}
                </Link>
              </strong>
              <br />
              <small>tagされた数{this.props.tweet.count}</small>
              <br />
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default DisplayHashtagRanking
