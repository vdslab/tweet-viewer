import React from 'react'
import DisplayRetweetedTweetRanking from '../Display/DisplayRetweetedTweetRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedTweetRankingChart from './RetweetedTweetRankingChart'

const barCount = 50
const barSize = 20

class RetweetedTweetRanking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      keywords: '',
      hasMoreTweets: false,
      offset: 0,
      lower: 0,
      upper: barCount,
      disableNextButton: false,
      disableBackButton: true,
      startDate: '',
      endDate: ''
    }
    this.abortController = new window.AbortController()
  }
  fetching() {
    let searchParams = new URLSearchParams()
    searchParams.set('dataSetType', this.props.dataSetType)
    searchParams.set('keywords', this.state.keywords)
    searchParams.set('offset', this.state.offset)
    searchParams.set('startDate', this.state.startDate)
    searchParams.set('endDate', this.state.endDate)
    window
      .fetch(
        `${process.env.API_ENDPOINT}/retweeted_tweet_ranking?${searchParams}`,
        {
          signal: this.abortController.signal
        }
      )
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          tweets: this.state.tweets.concat(data),
          hasMoreTweets: false,
          offset: this.state.offset + 1000,
          disableNextButton: false
        })
        if (
          this.state.tweets.length % 1000 === 0 &&
          this.state.tweets.length !== 0
        ) {
          this.setState({ hasMoreTweets: true })
        }
      })
      .catch(() => {})
  }
  componentDidMount() {
    this.fetching()
  }
  render() {
    const keywordRef = React.createRef()
    const loadFunc = () => {
      this.fetching()
    }
    return (
      <div className='column is-10'>
        <div className='box'>
          <div className='field has-addons'>
            <div className='control'>
              <input
                className='input'
                type='text'
                ref={keywordRef}
                placeholder='keywords'
              />
            </div>
            <div className='control'>
              <button
                className={[
                  'button',
                  'is-info',
                  this.state.loading ? 'is-loading' : ''
                ].join(' ')}
                onClick={() => {
                  this.setState({
                    tweets: [],
                    keyword: keywordRef,
                    hasMoreTweets: true,
                    offset: 0,
                    loading: true
                  })
                  loadFunc()
                }}
              >
                search
              </button>
            </div>
          </div>
          <div className='field'>
            <div className='control'>
              <div className='select'>
                <select
                  onChange={(event) => {
                    this.setState({
                      startDate: encodeURIComponent(event.target.value)
                    })
                  }}
                >
                  <option value=''>ALL</option>
                  <option value='2011-03-01T00:00:00'>2011年3月</option>
                  <option value='2011-04-01T00:00:00'>4月</option>
                  <option value='2011-05-01T00:00:00'>5月</option>
                  <option value='2011-06-01T00:00:00'>6月</option>
                  <option value='2011-07-01T00:00:00'>7月</option>
                  <option value='2011-08-01T00:00:00'>8月</option>
                  <option value='2011-09-01T00:00:00'>9月</option>
                  <option value='2011-10-01T00:00:00'>10月</option>
                  <option value='2011-11-01T00:00:00'>11月</option>
                  <option value='2011-12-01T00:00:00'>12月</option>
                  <option value='2012-01-01T00:00:00'>2012年1月</option>
                  <option value='2012-02-01T00:00:00'>2月</option>
                  <option value='2012-03-01T00:00:00'>3月</option>
                  <option value='2012-04-01T00:00:00'>4月</option>
                  <option value='2012-05-01T00:00:00'>5月</option>
                  <option value='2012-06-01T00:00:00'>6月</option>
                  <option value='2012-07-01T00:00:00'>7月</option>
                  <option value='2012-08-01T00:00:00'>8月</option>
                  <option value='2012-09-01T00:00:00'>9月</option>
                  <option value='2012-10-01T00:00:00'>10月</option>
                  <option value='2012-11-01T00:00:00'>11月</option>
                  <option value='2012-12-01T00:00:00'>12月</option>
                  <option value='2013-01-01T00:00:00'>2013年1月</option>
                  <option value='2013-02-01T00:00:00'>2月</option>
                  <option value='2013-03-01T00:00:00'>3月</option>
                </select>
              </div>
              <div className='select'>
                <select
                  onChange={(event) => {
                    this.setState({
                      endDate: encodeURIComponent(event.target.value)
                    })
                  }}
                >
                  <option value=''>ALL</option>
                  <option value='2011-03-01T00:00:00'>2011年3月</option>
                  <option value='2011-04-01T00:00:00'>4月</option>
                  <option value='2011-05-01T00:00:00'>5月</option>
                  <option value='2011-06-01T00:00:00'>6月</option>
                  <option value='2011-07-01T00:00:00'>7月</option>
                  <option value='2011-08-01T00:00:00'>8月</option>
                  <option value='2011-09-01T00:00:00'>9月</option>
                  <option value='2011-10-01T00:00:00'>10月</option>
                  <option value='2011-11-01T00:00:00'>11月</option>
                  <option value='2011-12-01T00:00:00'>12月</option>
                  <option value='2012-01-01T00:00:00'>2012年1月</option>
                  <option value='2012-02-01T00:00:00'>2月</option>
                  <option value='2012-03-01T00:00:00'>3月</option>
                  <option value='2012-04-01T00:00:00'>4月</option>
                  <option value='2012-05-01T00:00:00'>5月</option>
                  <option value='2012-06-01T00:00:00'>6月</option>
                  <option value='2012-07-01T00:00:00'>7月</option>
                  <option value='2012-08-01T00:00:00'>8月</option>
                  <option value='2012-09-01T00:00:00'>9月</option>
                  <option value='2012-10-01T00:00:00'>10月</option>
                  <option value='2012-11-01T00:00:00'>11月</option>
                  <option value='2012-12-01T00:00:00'>12月</option>
                  <option value='2013-01-01T00:00:00'>2013年1月</option>
                  <option value='2013-02-01T00:00:00'>2月</option>
                  <option value='2013-03-01T00:00:00'>3月</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className='box'>
          <div style={{ height: [`${barSize * barCount}`, 'px'].join('') }}>
            <RetweetedTweetRankingChart
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
              return <DisplayRetweetedTweetRanking key={i} tweet={tweet} />
            })}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default RetweetedTweetRanking
