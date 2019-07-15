import React from 'react'
import { render } from 'react-dom'
import TweetList from './pages/TweetList/index'
import UserDetails from './pages/UserDetails/index'
import { BrowserRouter, Route } from 'react-router-dom'

const App = () => {
	return (
		<BrowserRouter>
			<div>
				<Route exact path="/" component={TweetList} />
                <Route path="/user/:userId" component={UserDetails} />
			</div>
		</BrowserRouter>
	)
}

render(<App />, document.getElementById('content'))
