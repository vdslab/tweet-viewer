import React, { useState, useEffect, useRef } from 'react'
import { useLocation, useHistory } from 'react-router'
import { fetchURLRanking } from '../../services/api'
import { setLoading, formatDate } from '../../services/index'
import DisplayURLRanking from '../Display/DisplayURLRanking'
import URLRankingChart from './URLRankingChart'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

const barCount = 50

const URLRanking = () => {
  const location = useLocation()
  const history = useHistory()
  const [URLs, setURLs] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreURLs, setHasMoreURLs] = useState(true)
  const [date, setDate] = useState([
    '2011-03-01T00:00:00',
    formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss')
  ])
  const [lower, setLower] = useState(0)

  const keywords = useRef('')

  const graphData = URLs.slice(lower, lower + barCount).reverse()

  const loadURLs = () => {
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
      options['startDate'] = date[0]
    }
    if (!options.endDate) {
      options['endDate'] = date[1]
    }
    fetchURLRanking(options)
      .then((data) => {
        setURLs(URLs.concat(data))
        if (URLs.length % 1000 !== 0 || URLs.length === 0) {
          setHasMoreURLs(false)
        }
        setOffset(offset + 1000)
        setLoading(false)
      })
      .catch((erorr) => {
        console.error(erorr)
      })
  }

  const onFormSubmit = (event) => {
    event.preventDefault()
    setURLs([])
    setOffset(0)
    setHasMoreURLs(true)
    setLower(0)
    handleChangeFormValue({})
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

  const handleChangeFormValue = ({ startDate, endDate }) => {
    setURLs([])
    setOffset(0)
    const params = buildParams({
      startDate,
      endDate,
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
    loadURLs()
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
                    placeholder='nikkei'
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
                  <button className='button is-info'>検索</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div className='box'>
        <URLRankingChart data={graphData} />
        <div>
          <button
            className='button is-info'
            onClick={() => {
              setLower(lower - barCount)
            }}
            disabled={lower === 0}
          >
            {`前の${barCount}件`}
          </button>
          <button
            className='button is-info'
            onClick={() => {
              setLower(lower + barCount)
            }}
            disabled={URLs.length <= lower + barCount}
          >
            {`次の${barCount}件`}
          </button>
        </div>
      </div>
      <div className='box'>
        <InfiniteScroll pageStart={0} loadMore={loadURLs} hasMore={hasMoreURLs}>
          {URLs.map((url, i) => {
            return <DisplayURLRanking key={i} url={url} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default URLRanking
