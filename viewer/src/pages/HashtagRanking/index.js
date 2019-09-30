import React from 'react'
import DisplayHashtagsRanking from '../Display/DisplayHashtagRanking'
import InfiniteScroll from 'react-infinite-scroller'
import HashtagsRankingChart from './HashtagRankingChart'

const barCount = 50
const barSize = 20

class UserDetails extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      hasMoreTweets: false,
      offset: 0,
      lower: 0,
      upper: barCount,
      disableNextButton: false,
      disableBackButton: true
    }
  }
  fetching() {
    let searchParams = new URLSearchParams()
    searchParams.set('offset', this.state.offset)
    window
      .fetch(`${process.env.API_ENDPOINT}/hashtags_ranking?${searchParams}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          tweets: this.state.tweets.concat(data),
          hasMoreTweets: false,
          offset: this.state.offset + 1000,
          disableNextButton: false
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
          <div style={{ height: [`${barSize * barCount}`, 'px'].join('') }}>
            <HashtagsRankingChart
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
                  lower: this.state.lower - barCount,
                  upper: this.state.upper - barCount,
                  disableBackButton: this.state.lower - barCount <= 0,
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
                  lower: this.state.lower + barCount,
                  upper: this.state.upper + barCount,
                  disableBackButton: false,
                  disableNextButton:
                    this.state.upper + barCount >= this.state.tweets.length
                })
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
              return <DisplayHashtagsRanking key={i} tweet={tweet} />
            })}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default UserDetails
