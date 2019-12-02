import React from 'react'
import DisplayRetweetedTweetRanking from '../Display/DisplayRetweetedTweetRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedTweetRankingHitsogram from './RetweetedTweetRankingHistogram'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import setLoading from '../../services/index'

const barCount = 50
const barSize = 20

class RetweetedTweetRanking extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      data4histogram: [],
      hasMoreTweets: false,
      offset: 0,
      lower: 0,
      upper: barCount,
      disableNextButton: false,
      disableBackButton: true,
      date: [new Date('2011-03-01T00:00:00'), new Date()],
      loading: false
    }
    this.abortController = new window.AbortController()
  }
  fetching(key) {
    setLoading(true)
    let searchParams = new URLSearchParams()
    searchParams.set('dataSetType', this.props.dataSetType)
    searchParams.set('keywords', key)
    searchParams.set('offset', this.state.offset)
    if (this.state.date) {
      searchParams.set('startDate', this.state.date[0])
      searchParams.set('endDate', this.state.date[1])
    }
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
          disableNextButton: false,
          loading: false
        })
        if (
          this.state.tweets.length % 1000 === 0 &&
          this.state.tweets.length !== 0
        ) {
          this.setState({ hasMoreTweets: true })
        }
        setLoading(false)
      })
      .catch(() => {})
  }

  fetchForHistogram(key) {
    setLoading(true)
    let searchParams = new URLSearchParams()
    searchParams.set('dataSetType', this.props.dataSetType)
    searchParams.set('keywords', key)
    if (this.state.date) {
      searchParams.set('startDate', this.state.date[0])
      searchParams.set('endDate', this.state.date[1])
    }
    window
      .fetch(
        `${process.env.API_ENDPOINT}/retweeted_tweet_ranking_histogram?${searchParams}`,
        {
          signal: this.abortController.signal
        }
      )
      .then((res) => res.json())
      .then((data) => {
        if (data.length !== 0) {
          let rank = data[0].level
          let rankArray = []
          let i = 0
          while (rank >= 0) {
            if (data[i].level !== rank) {
              rankArray.push({ cnt: 0, level: rank })
            } else {
              rankArray.push(data[i])
              i++
            }
            rank -= 50
          }
          this.setState({
            data4histogram: rankArray.slice(0, rankArray.length - 1).reverse()
          })
        }
        setLoading(false)
      })
      .catch(() => {})
  }

  componentDidMount() {
    this.fetching('')
    this.fetchForHistogram('')
  }
  render() {
    const keywordRef = React.createRef()
    const loadFunc = (key) => {
      this.fetching(key)
    }
    const setDate = (date) => {
      this.setState({ date })
    }
    const onFormSubmit = (e) => {
      e.preventDefault()
      this.setState({
        tweets: [],
        hasMoreTweets: true,
        offset: 0,
        loading: true
      })
      loadFunc(keywordRef.current.value)
      this.fetchForHistogram(keywordRef.current.value)
    }
    return (
      <div className='column is-10'>
        <div className='box'>
          <form onSubmit={onFormSubmit}>
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
                >
                  search
                </button>
              </div>
            </div>
            <div>
              <DateRangePicker onChange={setDate} value={this.state.date} />
            </div>
          </form>
        </div>
        <div className='box'>
          <div style={{ height: [`${barSize * barCount}`, 'px'].join('') }}>
            <RetweetedTweetRankingHitsogram data={this.state.data4histogram} />
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
