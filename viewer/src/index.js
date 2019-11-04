import React, { useState } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import TweetList from './pages/TweetList/index'
import UserDetails from './pages/UserDetails/index'
import HashtagDetails from './pages/HashtagDetails/index'
import RetweetedUserRanking from './pages/RetweetedUserRanking/index'
import RetweetedTweetRanking from './pages/RetweetedTweetRanking/index'
import HashtagRanking from './pages/HashtagRanking'

const App = () => {
  const [dataSetType, setDataSetType] = useState(0)
  return (
    <BrowserRouter>
      <section className='section columns'>
        <div className='column is-2'>
          <div className='box sticky'>
            <aside className='munu'>
              <p className='menu-label'>General</p>
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
                  <div className='field'>
                    <div className='control'>
                      <div className='select'>
                        <select
                          onChange={(event) => {
                            setDataSetType(event.target.value)
                          }}
                        >
                          <option value='0'>PQ</option>
                          <option value='1'>PQX</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </aside>
          </div>
        </div>
        <Route
          exact
          path='/'
          render={() => <TweetList dataSetType={dataSetType} />}
        />
        <Route
          path='/user/:userId'
          render={({ match }) => (
            <UserDetails dataSetType={dataSetType} match={match} />
          )}
        />
        <Route
          path='/hashtag/:hashtag'
          render={({ match }) => (
            <HashtagDetails dataSetType={dataSetType} match={match} />
          )}
        />
        <Route
          path='/retweeted_user_ranking'
          render={() => <RetweetedUserRanking dataSetType={dataSetType} />}
        />
        <Route
          path='/retweeted_tweet_ranking'
          render={() => <RetweetedTweetRanking dataSetType={dataSetType} />}
        />
        <Route
          path='/hashtag_ranking'
          render={() => <HashtagRanking dataSetType={dataSetType} />}
        />
      </section>
    </BrowserRouter>
  )
}

render(<App />, document.getElementById('content'))
