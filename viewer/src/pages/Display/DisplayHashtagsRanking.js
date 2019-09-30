import React from 'react'
// import { Link } from 'react-router-dom'

class DisplayHashtagsRanking extends React.Component {
  render() {
    return (
      <div className='media'>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>
                {/* <Link to={'/user/' + `${this.props.tweet.id_str}`}> */}
                {`#${this.props.tweet.hashtag}`}
                {/* </Link> */}
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

export default DisplayHashtagsRanking
