import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import { setLoading, formatDate } from '../../services/index'
import DisplayRetweetedTweetRanking from '../Display/DisplayRetweetedTweetRanking'
import InfiniteScroll from 'react-infinite-scroller'
import RetweetedTweetRankingHitsogram from './RetweetedTweetRankingHistogram'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import {
  fetchRetweetedTweetRanking,
  fetchRetweetedTweetRankingHistogram
} from '../../services/api'

const RetweetedTweetRanking = () => {
  const location = useLocation()
  const history = useHistory()
  const [tweets, setTweets] = useState([])
  const [histogramData, setHistogramData] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreTweets, setHasMoreTweets] = useState(true)

  const keywords = useRef('')

  const loadTweets = () => {
    setLoading(true)
    setLoading(true)
    const params = new URLSearchParams(location.search)
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
        setTweets((prevTweets) => prevTweets.concat(data))
        if (tweets.length % 1000 !== 0 || tweets.length === 0) {
          setHasMoreTweets(false)
        }
        setOffset((prevOffset) => prevOffset + 1000)
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

  const buildParams = ({ keywords, startDate, endDate }) => {
    const params = new URLSearchParams(location.search)
    if (`${keywords}` !== 'undefined') {
      params.set('keywords', keywords)
    }
    if (`${startDate}` !== 'undefined') {
      params.set('startDate', startDate)
    }
    if (`${endDate}` !== 'undefined') {
      params.set('endDate', endDate)
    }
    return params
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
    setTweets([])
    setHistogramData([])
    setOffset(0)
    setHasMoreTweets(true)
    handleChangeFormValue({})
  }

  const handleChangeFormValue = ({ startDate, endDate }) => {
    setTweets([])
    setOffset(0)
    const params = buildParams({
      startDate,
      endDate,
      keywords: keywords.current.value
    })
    history.push(`${location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    loadTweets()
  }, [location])

  const onChangeDate = ([startDate, endDate]) => {
    const dates = {
      startDate: formatDate(new Date(startDate), 'yyyy-MM-dd'),
      endDate: formatDate(new Date(endDate), 'yyyy-MM-dd')
    }
    handleChangeFormValue(dates)
  }

  const params = new URLSearchParams(location.search)

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

export default RetweetedTweetRanking
