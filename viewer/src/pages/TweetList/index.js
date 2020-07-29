import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router'
import { fetchTweets, fetchTweetsCount } from '../../services/api'
import DisplayTweet from '../Display/DisplayTweet'
import TweetTimesHistogram from './TweetTimesHistogram'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { setLoading, formatDate } from '../../services/index'

const TweetList = () => {
  const location = useLocation()
  const history = useHistory()
  const [tweets, setTweets] = useState([])
  const [graphData, setGraphData] = useState([])
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
    if (!options.includeRT) {
      options['includeRT'] = 'true'
    }
    fetchTweets(options)
      .then((data) => {
        setTweets((prevState) => prevState.concat(data))
        if (data.length % 1000 !== 0 || data.length === 0) {
          setHasMoreTweets(false)
        }
        setOffset(offset + 1000)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })

    fetchTweetsCount(options)
      .then((data) => {
        setGraphData(data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
    setTweets([])
    setGraphData([])
    setOffset(0)
    setHasMoreTweets(true)
    handleChangeFormValue({})
  }

  const buildParams = ({ keywords, startDate, endDate, offset, includeRT }) => {
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
    if (`${offset}` !== 'undefined') {
      params.set('offset', offset)
    }
    if (`${includeRT}` !== 'undefined') {
      params.set('includeRT', includeRT)
    }
    return params
  }

  const handleChangeFormValue = ({ startDate, endDate, includeRT }) => {
    const params = buildParams({
      startDate,
      endDate,
      includeRT,
      keywords: keywords.current.value
    })
    history.push(`${location.pathname}?${params.toString()}`)
  }

  const onChangeDate = ([startDate, endDate]) => {
    const dates = {
      startDate: formatDate(new Date(startDate), 'yyyy-MM-dd'),
      endDate: formatDate(new Date(endDate), 'yyyy-MM-dd')
    }
    handleChangeFormValue(dates)
  }

  useEffect(() => {
    setTweets([])
    setOffset(0)
    loadTweets()
  }, [location])

  const params = new URLSearchParams(location.search)

  return (
    <div>
      <div className='box'>
        <form onSubmit={onFormSubmit}>
          <div className='field is-horizontal'>
            <div className='field-label'>
              <label className='label'>検索キーワード</label>
            </div>
            <div className='field-body'>
              <div className='field'>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    ref={keywords}
                    placeholder='福島'
                    defaultValue={params.get('keywords')}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='field is-horizontal'>
            <div className='field-label'>
              <label className='label'>検索範囲</label>
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
          </div>
          <div className='field is-horizontal'>
            <div className='field-label' />
            <div className='field-body'>
              <div className='field'>
                <div className='control'>
                  <label className='label'>
                    <input
                      type='checkbox'
                      defaultChecked={!(params.get('includeRT') === 'false')}
                      onChange={() => {
                        handleChangeFormValue({
                          includeRT: params.get('includeRT') === 'false'
                        })
                      }}
                    />
                    リツイートを含む
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className='field is-horizontal'>
            <div className='field-label' />
            <div className='field-body'>
              <div className='field'>
                <div className='control'>
                  <button className='button is-info'>検索</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className='box'>
        <TweetTimesHistogram data={graphData} />
      </div>
      <div className='box'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadTweets}
          hasMore={hasMoreTweets}
          children={tweets.map((tweet, i) => {
            return <DisplayTweet key={i} tweet={tweet} />
          })}
        />
      </div>
    </div>
  )
}

export default TweetList
