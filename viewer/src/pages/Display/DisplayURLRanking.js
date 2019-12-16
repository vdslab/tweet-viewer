import React from 'react'
import { Link } from 'react-router-dom'

class DisplayURLRanking extends React.Component {
  render() {
    return (
      <div className='media'>
        <div className='media-content'>
          <div className='content'>
            <p>
              <strong>
                <Link
                  to={'/url/' + `${encodeURIComponent(this.props.url.URL)}`}
                >
                  {this.props.url.URL}
                </Link>
              </strong>
              <br />
              <small>このURLが貼られた回数{this.props.url.count}</small>
              <br />
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default DisplayURLRanking
