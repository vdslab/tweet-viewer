import React from 'react'
import DisplayRetweetedRanking from '../Display/DisplayRetweetedRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedRankingChart from './RetweetedRankingChart'

class UserDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = { tweets: [], hasMoreTweets: false, offset: 0 }
  }
  fetching() {
    let searchParams = new URLSearchParams()
    searchParams.set('offset', this.state.offset)
    window
      .fetch(
        `https://us-central1-moe-twitter-analysis2019.cloudfunctions.net/main/retweeted_ranking?${searchParams}`
      )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          tweets: this.state.tweets.concat(data),
          hasMoreTweets: false,
          offset: this.state.offset + 1000
        })
        if (this.state.tweets.length % 1000 === 0) {
          this.setState({ hasMoreTweets: true })
        }
      })
  }
  componentDidMount() {
    this.fetching()
  }
  render() {
    const loadFunc = () => {
      this.fetching()
    }
    return (
      <div className='column is-10'>
        <div style={{ height: '10000px' }}>
          <RetweetedRankingChart data={this.state.tweets.slice(0, 100)} />
        </div>
        <div className='box'>
          <InfiniteScroll
            pageStart={0}
            loadMore={loadFunc}
            hasMore={this.state.hasMoreTweets}
          >
            {this.state.tweets.map((tweet, i) => {
              return <DisplayRetweetedRanking key={i} tweet={tweet} />
            })}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default UserDetails
