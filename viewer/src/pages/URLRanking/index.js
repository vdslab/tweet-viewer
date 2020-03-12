import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'
import { fetchURLRanking } from '../../services/api'
import { setLoading, formatDate } from '../../services/index'
import DisplayURLRanking from '../Display/DisplayURLRanking'
import URLRankingChart from './URLRankingChart'
import InfiniteScroll from 'react-infinite-scroller'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

const barCount = 50

const URLRanking = (props) => {
  const [URLs, setURLs] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreURLs, setHasMoreURLs] = useState(false)
  const [date, setDate] = useState([
    '2011-03-01T00:00:00',
    formatDate(new Date(), 'yyyy-MM-ddTHH:mm:ss')
  ])
  const [lower, setLower] = useState(0)

  const keywords = useRef('')

  const graphData = URLs.slice(lower, lower + barCount).reverse()

  const loadURLs = () => {
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
    handleChangeFormValue()
  }

  const buildParams = () => {
    const params = new URLSearchParams()
    params.set('keywords', keywords.current.value)
    params.set('dataSetType', props.dataSetType)
    params.set('startDate', date[0])
    params.set('endDate', date[1])
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
    loadURLs()
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

export default withRouter(URLRanking)
