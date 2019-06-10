import React from 'react'

class TweetList extends React.Component {
    constructor(props) {
        super(props)
        this.state = { tweets: [] }
    }
    render() {
        const keywordRef = React.createRef()
        return <div>
            <input type="text" ref={keywordRef}/>
            <button
            onClick={() => {
                fetch(`https://us-central1-moe-twitter-analysis2019.cloudfunctions.net/main/tweets?keyword=${keywordRef.current.value}`)
                    .then((res) => res.json())
                    .then((data) => this.setState({ tweets: data }))
            }}>search</button>
            {this.state.tweets.map((tweet) => {
                return <p>
                    {tweet.text}
                </p>
            })}
        </div>
    }
}

export default TweetList