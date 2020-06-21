import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'
import { fetchTweets, fetchTweetsCount } from '../../services/api'
import DisplayTweet from '../Display/DisplayTweet'
import TweetTimesHistogram from './TweetTimesHistogram'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'
import { setLoading, formatDate } from '../../services/index'

const TweetList = (props) => {
  console.log(props.dataSetType)
  const [tweets, setTweets] = useState([])
  const [graphData, setGraphData] = useState([])
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
    if (!options.includeRT) {
      options['includeRT'] = 'true'
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
    const dates = [params.get('startDate'), params.get('endDate')]
    const includeRT =
      params.get('includeRT') === null ? 'true' : params.get('includeRT')
    handleChangeFormValue(dates, includeRT)
  }

  const buildParams = (dates, includeRT) => {
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
    params.set('includeRT', includeRT)
    return params
  }

  const handleChangeFormValue = (dates, includeRT) => {
    const params = buildParams(dates, includeRT === void 0 ? 'true' : includeRT)
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  const onChangeDate = (date) => {
    const dates = [
      formatDate(new Date(date[0]), 'yyyy-MM-dd'),
      formatDate(new Date(date[1]), 'yyyy-MM-dd')
    ]
    handleChangeFormValue(dates)
  }

  useEffect(() => {
    loadTweets()
  }, [props.location])

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
                      defaultChecked={
                        params.get('includeRT') === null
                          ? true
                          : params.get('includeRT') === 'true'
                      }
                      onChange={() => {
                        handleChangeFormValue(
                          [params.get('startDate'), params.get('endDate')],
                          params.get('includeRT') !== 'true'
                        )
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
