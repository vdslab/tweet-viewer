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
      top: 0,
      bottom: 100,
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
        <div className='box' style={{ height: '2000px' }}>
          <RetweetedRankingChart
            data={this.state.tweets
              .slice(this.state.top, this.state.bottom)
              .reverse()}
          />
          <button
            className='button is-info'
            onClick={() => {
              this.setState({
                top: this.state.top - 100,
                bottom: this.state.bottom - 100,
                disableBackButton: this.state.top - 100 <= 0,
                disableNextButton:
                  this.state.bottom + 100 >= this.state.tweets.length
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
                top: this.state.top + 100,
                bottom: this.state.bottom + 100,
                disableBackButton: this.state.top - 100 <= 0,
                disableNextButton:
                  this.state.bottom + 100 >= this.state.tweets.length
              })
            }}
            disabled={this.state.disableNextButton}
          >
            next
          </button>
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
