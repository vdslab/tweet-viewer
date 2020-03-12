import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'
import { fetchTweets, fetchTweetsCount } from '../../services/api'
import DisplayTweet from '../Display/DisplayTweet'
import TweetTimesHistogram from './TweetTimesHistogram'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { setLoading, formatDate } from '../../services/index'

const TweetList = (props) => {
  const [tweets, setTweets] = useState([])
  const [graphData, setGraphData] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreTweets, setHasMoreTweets] = useState(false)
  const [date, setDate] = useState([
    '2011-03-01T00:00:00',
    formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss')
  ])
  const [includeRT, setInculdeRT] = useState(true)

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
      options['startDate'] = date[0]
    }
    if (!options.endDate) {
      options['endDate'] = date[1]
    }
    if (!options.includeRT) {
      options['includeRT'] = includeRT
    }
    fetchTweets(options)
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
    handleChangeFormValue()
  }

  const buildParams = () => {
    const params = new URLSearchParams()
    params.set('keywords', keywords.current.value)
    params.set('dataSetType', props.dataSetType)
    params.set('startDate', date[0])
    params.set('endDate', date[1])
    params.set('includeRT', includeRT)
    return params
  }

  const handleChangeFormValue = () => {
    const params = buildParams()
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  const onChangeDate = (date) => {
    setDate([
      formatDate(new Date(date[0]), 'yyyy-MM-ddTHH:mm:ss'),
      formatDate(new Date(date[1]), 'yyyy-MM-ddTHH:mm:ss')
    ])
  }

  useEffect(() => {
    loadTweets()
  }, [props.location])
  console.log(includeRT)

  const params = new URLSearchParams(props.location.search)

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
                      ? date[0]
                      : params.get('startDate')
                  ),
                  new Date(
                    params.get('endDate') === null
                      ? date[1]
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
                      defaultChecked={
                        params.get('includeRT') === null
                          ? includeRT
                          : params.get('includeRT') === 'true'
                      }
                      onChange={() => {
                        setInculdeRT(!includeRT)
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
        >
          {tweets.map((tweet, i) => {
            return <DisplayTweet key={i} tweet={tweet} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default withRouter(TweetList)
