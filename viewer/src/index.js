import React from 'react'
import {render} from 'react-dom'
import TweetList from './pages/TweetList/index'

const App = () => {
    return (
        <div>
            <TweetList />
        </div>
    )
}

render(<App />, document.getElementById('content'))