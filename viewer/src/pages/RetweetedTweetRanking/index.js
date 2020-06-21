import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { setLoading, formatDate } from '../../services/index'
import DisplayRetweetedTweetRanking from '../Display/DisplayRetweetedTweetRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedTweetRankingHitsogram from './RetweetedTweetRankingHistogram'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import {
  fetchRetweetedTweetRanking,
  fetchRetweetedTweetRankingHistogram
} from '../../services/api'

const RetweetedTweetRanking = (props) => {
  const [tweets, setTweets] = useState([])
  const [histogramData, setHistogramData] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreTweets, setHasMoreTweets] = useState(false)

  const keywords = useRef('')

  const loadTweets = () => {
    setLoading(true)
    setLoading(true)
    const params = new URLSearchParams(props.location.search)
    const options = {}
    for (const [key, value] of params) {
      options[key] = value
    }
    options['offset'] = `${offset}`
    if (!options.keywords) {
      options['keywords'] = ''
    }
    if (!options.dataSetType) {
      options['dataSetType'] = process.env.DEFAULT_DATASET
    }
    if (!options.startDate) {
      options['startDate'] = '2011-03-01'
    }
    if (!options.endDate) {
      options['endDate'] = formatDate(new Date(), 'yyyy-MM-dd')
    }
    fetchRetweetedTweetRanking(options)
      .then((data) => {
        setTweets(tweets.concat(data))
        if (tweets.length % 1000 !== 0 || tweets.length === 0) {
          setHasMoreTweets(false)
        }
        setOffset(offset + 1000)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })

    fetchRetweetedTweetRankingHistogram(options)
      .then((data) => {
        setHistogramData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const buildParams = (dates) => {
    const params = new URLSearchParams()
    params.set('keywords', keywords.current.value)
    params.set('dataSetType', props.dataSetType)
    params.set(
      'startDate',
      params.get('startDate') === null ? '2011-03-01' : params.get('startDate')
    )
    params.set(
      'endDate',
      params.get('endDate') === null
        ? formatDate(new Date(), 'yyyy-MM-dd')
        : params.get('endDate')
    )
    return params
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
    setTweets([])
    setHistogramData([])
    setOffset(0)
    setHasMoreTweets(true)
    const dates = [params.get('startDate'), params.get('endDate')]
    handleChangeFormValue(dates)
  }

  const handleChangeFormValue = (dates) => {
    const params = buildParams(dates)
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    loadTweets()
  }, [props.location])

  const onChangeDate = (date) => {
    const dates = [
      formatDate(new Date(date[0]), 'yyyy-MM-dd'),
      formatDate(new Date(date[1]), 'yyyy-MM-dd')
    ]
    handleChangeFormValue(dates)
  }

  const params = new URLSearchParams(props.location.search)

  return (
    <div>
      <div className='box'>
        <form onSubmit={onFormSubmit}>
          <div className='field has-addons'>
            <div className='control'>
              <input
                className='input'
                type='text'
                ref={keywords}
                placeholder='福島第一原発'
                defaultValue={params.get('keywords')}
              />
            </div>
            <div className='control'>
              <button className='button is-info'>search</button>
            </div>
          </div>
          <div className='field-body'>
            <DateRangePicker
              onChange={onChangeDate}
              value={[
                new Date(
                  params.get('startDate') === null
                    ? '2011-03-01'
                    : params.get('startDate')
                ),
                new Date(
                  params.get('endDate') === null
                    ? formatDate(new Date(), 'yyyy-MM-dd')
                    : params.get('endDate')
                )
              ]}
            />
          </div>
        </form>
      </div>
      <div className='box'>
        <RetweetedTweetRankingHitsogram data={histogramData} />
      </div>
      <div className='box'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadTweets}
          hasMore={hasMoreTweets}
        >
          {tweets.map((tweet, i) => {
            return <DisplayRetweetedTweetRanking key={i} tweet={tweet} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default withRouter(RetweetedTweetRanking)
