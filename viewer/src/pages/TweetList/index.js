import React from 'react'
import DisplayTweet from '../Display/DisplayTweet'
import TweetTimesHistogram from './TweetTimesHistogram'
import InfiniteScroll from 'react-infinite-scroller'

const height = 800

class TweetList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      filtered: [],
      hasMoreTweets: false,
      excludeRt: false,
      date: '',
      offset: 0,
      loading: false,
      tweetTimesData: []
    }
    this.abortController = new window.AbortController()
  }
  fetchForHistogram(key) {
    let searchParamsForHistogram = new URLSearchParams()
    searchParamsForHistogram.set('keywords', key)
    searchParamsForHistogram.set('dataSetType', this.props.dataSetType)
    window
      .fetch(
        `${process.env.API_ENDPOINT}/tweet_times_histogram?${searchParamsForHistogram}`,
        {
          signal: this.abortController.signal
        }
      )
      .then((res) => res.json())
      .then((data) => {
        this.setState({ tweetTimesData: data })
      })
      .catch(() => {})
  }
  componentDidMount() {
    this.fetchForHistogram('')
  }
  componentWillUnmount() {
    this.abortController.abort()
  }
  render() {
    const keywordRef = React.createRef()
    const loadFunc = () => {
      let searchParams = new URLSearchParams()
      searchParams.set('keywords', keywordRef.current.value)
      searchParams.set('dataSetType', this.props.dataSetType)
      searchParams.set(
        'excludeRetweets',
        this.state.excludeRetweets ? 'yes' : 'no'
      )
      searchParams.set('date', this.state.date)
      searchParams.set('offset', this.state.offset)
      window
        .fetch(`${process.env.API_ENDPOINT}/tweets?${searchParams}`, {
          signal: this.abortController.signal
        })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            tweets: this.state.tweets.concat(data),
            hasMoreTweets: false,
            offset: this.state.offset + 1000,
            loading: false
          })
          if (
            this.state.tweets.length % 1000 === 0 &&
            this.tweets.length !== 0
          ) {
            this.setState({ hasMoreTweets: true })
          }
        })
        .catch(() => {})
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
                    hasMoreTweets: true,
                    offset: 0,
                    loading: true
                  })
                  loadFunc()
                  this.fetchForHistogram(keywordRef.current.value)
                }}
              >
                search
              </button>
            </div>
          </div>
          <div className='field'>
            <label className='checkbox'>
              <input
                type='checkbox'
                defaultChecked={this.state.excludeRt}
                onClick={() => {
                  this.setState({
                    excludeRt: !this.state.excludeRt
                  })
                }}
              />
              リツイートを除外
            </label>
          </div>
          <div className='field'>
            <div className='control'>
              <div className='select'>
                <select
                  onChange={(event) => {
                    this.setState({
                      date: encodeURIComponent(event.target.value)
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
          <div style={{ height: [`${height}`, 'px'].join('') }}>
            <TweetTimesHistogram data={this.state.tweetTimesData} />
          </div>
        </div>
        <div className={this.state.tweets.length === 0 ? '' : 'box'}>
          <InfiniteScroll
            loadMore={loadFunc}
            hasMore={this.state.hasMoreTweets}
          >
            {this.state.tweets.map((tweet, i) => {
              return <DisplayTweet key={i} tweet={tweet} />
            })}
          </InfiniteScroll>
        </div>
      </div>
    )
  }
}

export default TweetList
