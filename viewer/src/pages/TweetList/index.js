import React from 'react'
import DisplayTweet from '../Display/DisplayTweet'
import TweetTimesHistogram from './TweetTimesHistogram'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { setLoading } from '../../services/index'

const height = 800

class TweetList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tweets: [],
      filtered: [],
      hasMoreTweets: false,
      excludeRt: false,
      date: [new Date('2011-03-01T00:00:00'), new Date()],
      offset: 0,
      loading: false,
      tweetTimesData: []
    }
    this.abortController = new window.AbortController()
  }
  fetchForHistogram(key) {
    setLoading(true)
    let searchParamsForHistogram = new URLSearchParams()
    searchParamsForHistogram.set('keywords', key)
    searchParamsForHistogram.set('dataSetType', this.props.dataSetType)
    if (this.state.date) {
      searchParamsForHistogram.set('startDate', this.state.date[0])
      searchParamsForHistogram.set('endDate', this.state.date[1])
    }
    window
      .fetch(
        `${process.env.API_ENDPOINT}tweet_times_histogram?${searchParamsForHistogram}`,
        {
          signal: this.abortController.signal
        }
      )
      .then((res) => res.json())
      .then((data) => {
        this.setState({ tweetTimesData: data })
        setLoading(false)
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
      setLoading(true)
      let searchParams = new URLSearchParams()
      searchParams.set('keywords', keywordRef.current.value)
      searchParams.set('dataSetType', this.props.dataSetType)
      searchParams.set(
        'excludeRetweets',
        this.state.excludeRetweets ? 'yes' : 'no'
      )
      if (this.state.date) {
        searchParams.set('startDate', this.state.date[0])
        searchParams.set('endDate', this.state.date[1])
      }
      searchParams.set('offset', this.state.offset)
      window
        .fetch(`${process.env.API_ENDPOINT}tweets?${searchParams}`, {
          signal: this.abortController.signal
        })
        .then((res) => res.json())
        .then((data) => {
          this.setState({
            tweets: this.state.tweets.concat(data),
            hasMoreTweets: false,
            loading: false
          })
          if (data.length % 1000 === 0 && data.length !== 0) {
            this.setState((state) => {
              return { hasMoreTweets: true, offset: state.offset + 1000 }
            })
          }
          setLoading(false)
        })
        .catch(() => {})
    }
    const onFormSubmit = (e) => {
      e.preventDefault()
      this.setState({
        tweets: [],
        hasMoreTweets: true,
        offset: 0,
        loading: true
      })
      loadFunc()
      this.fetchForHistogram(keywordRef.current.value)
    }
    const setDate = (date) => {
      this.setState({ date })
    }
    const onFromChanged = () => {
      this.setState({
        tweets: [],
        hasMoreTweets: true,
        offset: 0
      })
    }
    return (
      <div>
        <div className='box'>
          <form onSubmit={onFormSubmit} onChange={onFromChanged}>
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
                    'submit',
                    this.state.loading ? 'is-loading' : ''
                  ].join(' ')}
                  type='submit'
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
                    this.setState((state) => {
                      return {
                        excludeRt: !state.excludeRt
                      }
                    })
                  }}
                />
                リツイートを除外
              </label>
            </div>
            <div>
              <DateRangePicker onChange={setDate} value={this.state.date} />
            </div>
          </form>
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
