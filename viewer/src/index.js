import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import TweetList from './pages/TweetList/index'
import UserDetails from './pages/UserDetails/index'
import RetweetedRanking from './pages/RetweetedRanking/index'

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Route exact path='/' component={TweetList} />
        <Route path='/user/:userId' component={UserDetails} />
        <Route path='/retweeted_ranking' component={RetweetedRanking} />
      </div>
    </BrowserRouter>
  )
}

render(<App />, document.getElementById('content'))
