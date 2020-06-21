import React, { useState, useEffect } from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Menu from './components/menu/index'

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
            <Menu />
            <div className='column'>
              <Route exact path='/' component={TweetList} />
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
                  // <RetweetedTweetRanking />
                )}
              />
              <Route
                path='/hashtag_ranking'
                render={() => <HashtagRanking dataSetType={dataSetType} />}
                // render={() => <HashtagRanking />}
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
