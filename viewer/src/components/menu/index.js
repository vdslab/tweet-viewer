import React from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom'
const Menu = () => {
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  return (
    <div className='column is-one-fifth'>
      <div className='box sticky'>
        <aside className='munu'>
          <ul className='menu-list'>
            <li>
              <Link to={'/'}>ツイート検索</Link>
            </li>
            <li>
              <Link to={'/retweeted_user_ranking'}>userランキング</Link>
            </li>
            <li>
              <Link to={'/retweeted_tweet_ranking'}>tweetランキング</Link>
            </li>
            <li>
              <Link to={'/hashtag_ranking'}>#ランキング</Link>
            </li>
            <li>
              <Link to={'/url_ranking'}>URLランキング</Link>
            </li>
            <li>
              <div className='field'>
                <div className='control'>
                  <div className='select'>
                    <select
                      value={
                        params.get('dataSetType') === null
                          ? process.env.DEFAULT_DATASET
                          : params.get('dataSetType')
                      }
                      onChange={(event) => {
                        const params = new URLSearchParams(location.search)
                        params.set('dataSetType', event.target.value)
                        history.push(
                          `${location.pathname}?${params.toString()}`
                        )
                      }}
                    >
                      <option value='0'>P</option>
                      <option value='1'>PQ</option>
                      <option value='2'>PQX</option>
                      <option value='3'>R</option>
                      <option value='4'>S</option>
                      <option value='5'>T</option>
                      <option value='6'>Y</option>
                      <option value='7'>Z</option>
                    </select>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  )
}

export default Menu
