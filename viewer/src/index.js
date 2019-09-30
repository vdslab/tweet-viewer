import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import TweetList from './pages/TweetList/index'
import UserDetails from './pages/UserDetails/index'
import HashtagDetails from './pages/HashtagDetails/index'
import RetweetedRanking from './pages/RetweetedRanking/index'
import HashtagRanking from './pages/HashtagRanking'

const App = () => {
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
                  <Link to={'/retweeted_ranking'}>ランキング</Link>
                </li>
                <li>
                  <Link to={'/hashtag_ranking'}>#ランキング</Link>
                </li>
              </ul>
            </aside>
          </div>
        </div>
        <Route exact path='/' component={TweetList} />
        <Route path='/user/:userId' component={UserDetails} />
        <Route path='/hashtag/:hashtag' component={HashtagDetails} />
        <Route path='/retweeted_ranking' component={RetweetedRanking} />
        <Route path='/hashtag_ranking' component={HashtagRanking} />
      </section>
    </BrowserRouter>
  )
}

render(<App />, document.getElementById('content'))
