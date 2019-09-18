import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import TweetList from './pages/TweetList/index'
import UserDetails from './pages/UserDetails/index'
import RetweetedRanking from './pages/RetweetedRanking/index'

const App = () => {
  return (
    <BrowserRouter>
      <div>
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
                </ul>
              </aside>
            </div>
          </div>
        </section>
        <Route exact path='/' component={TweetList} />
        <Route path='/user/:userId' component={UserDetails} />
        <Route path='/retweeted_ranking' component={RetweetedRanking} />
      </div>
    </BrowserRouter>
  )
}

render(<App />, document.getElementById('content'))
