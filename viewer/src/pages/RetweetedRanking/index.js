import React from 'react'
import DisplayRetweetedRanking from '../Display/DisplayRetweetedRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedRankingChart from './RetweetedRankingChart'

class UserDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      hasMoreTweets: false,
      offset: 0,
      lower: 0,
      upper: 100,
      disableNextButton: false,
      disableBackButton: true
    }
  }
  fetching() {
    let searchParams = new URLSearchParams()
    searchParams.set('offset', this.state.offset)
    window
      .fetch(`${process.env.API_ENDPOINT}/retweeted_ranking?${searchParams}`)
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
        <div className='box'>
          <div style={{ height: '2000px' }}>
            <RetweetedRankingChart
              data={this.state.tweets
                .slice(this.state.lower, this.state.upper)
                .reverse()}
            />
          </div>
          <div>
            <button
              className='button is-info'
              onClick={() => {
                this.setState({
                  lower: this.state.lower - 100,
                  upper: this.state.upper - 100,
                  disableBackButton: this.state.lower - 100 <= 0,
                  disableNextButton: false
                })
              }}
              disabled={this.state.disableBackButton}
            >
              back
            </button>
            <button
              className='button is-info'
              onClick={() => {
                this.setState({
                  lower: this.state.lower + 100,
                  upper: this.state.upper + 100,
                  disableBackButton: false,
                  disableNextButton:
                    this.state.upper + 100 >= this.state.tweets.length
                })
                console.log(this.state.lower)
                console.log(this.state.upper)
              }}
              disabled={this.state.disableNextButton}
            >
              next
            </button>
          </div>
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
