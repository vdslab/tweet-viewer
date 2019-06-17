import React from 'react'
import DisplayTweet from './DisplayTweet'

class TweetList extends React.Component {
    constructor(props) {
        super(props)
        this.state = { tweets: [] }
    }
    render() {
        const keywordRef = React.createRef()
        return <section className="section">
            <div className="container">
                <div className="field has-addons">
                    <div className="control">
                        <input className="input" type="text" ref={keywordRef}/>
                    </div>
                    <div className="control">
                        <button className="button is-info"
                        onClick={() => {
                            fetch(`https://us-central1-moe-twitter-analysis2019.cloudfunctions.net/main/tweets?keyword=${keywordRef.current.value}`)
                                .then((res) => res.json())
                                .then((data) => this.setState({ tweets: data }))
                        }}>search</button>
                    </div>
                </div>
                {this.state.tweets.map((tweet) => {
                    return <DisplayTweet
                    text={tweet.text}
                    />
                })}
            </div>
        </section>
    }
}

export default TweetList