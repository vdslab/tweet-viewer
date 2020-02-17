import React, { useState } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import TweetList from './pages/TweetList/index'
import UserDetails from './pages/Details/UserDetails'
import HashtagDetails from './pages/Details/HashtagDetails'
import URLDetails from './pages/Details/URLDetails.js'
import RetweetedUserRanking from './pages/RetweetedUserRanking/index'
import RetweetedTweetRanking from './pages/RetweetedTweetRanking/index'
import HashtagRanking from './pages/HashtagRanking'
import URLRanking from './pages/URLRanking'
import { setLoading } from './services/index'

const App = () => {
  const [dataSetType, setDataSetType] = useState(process.env.DEFAULT_DATASET)
  return (
    <BrowserRouter>
      <section className='section'>
        <div className='container'>
          <div className='columns'>
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
                      <Link to={'/retweeted_tweet_ranking'}>
                        tweetランキング
                      </Link>
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
                              value={dataSetType}
                              onChange={(event) => {
                                setDataSetType(event.target.value)
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
            <div className='column'>
              <Route
                exact
                path='/'
                render={() => <TweetList dataSetType={dataSetType} />}
              />
              <Route
                path='/user/:userId'
                render={({ match, history }) => (
                  <UserDetails
                    dataSetType={dataSetType}
                    match={match}
                    history={history}
                  />
                )}
              />
              <Route
                path='/hashtag/:hashtag'
                render={({ match, history }) => (
                  <HashtagDetails
                    dataSetType={dataSetType}
                    match={match}
                    history={history}
                  />
                )}
              />
              <Route
                path='/url/:url'
                render={({ match, history }) => (
                  <URLDetails
                    dataSetType={dataSetType}
                    match={match}
                    history={history}
                  />
                )}
              />
              <Route
                path='/retweeted_user_ranking'
                render={({ history }) => (
                  <RetweetedUserRanking
                    dataSetType={dataSetType}
                    history={history}
                  />
                )}
              />
              <Route
                path='/retweeted_tweet_ranking'
                render={() => (
                  <RetweetedTweetRanking dataSetType={dataSetType} />
                )}
              />
              <Route
                path='/hashtag_ranking'
                render={() => <HashtagRanking dataSetType={dataSetType} />}
              />
              <Route
                path='/url_ranking'
                render={({ history, location }) => (
                  <URLRanking
                    dataSetType={dataSetType}
                    history={history}
                    location={location}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </section>
    </BrowserRouter>
  )
}

render(<App />, document.getElementById('content'), () => {
  setTimeout(() => {
    setLoading(false)
  }, 500)
})
