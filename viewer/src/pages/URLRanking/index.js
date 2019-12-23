import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router'
import { fetchURLRanking } from '../../services/api'
import { setLoading } from '../../services/index'
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
    new Date('2011-03-01T00:00:00'),
    new Date()
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
    if (!options.keywords) {
      options['keywords'] = ''
    }
    if (!options.dataSetType) {
      options['dataSetType'] = process.env.DEFAULT_DATASET
    }
    if (!options.offset) {
      options['offset'] = `${offset}`
    }
    if (!options.startDate) {
      options['startDate'] = `${date[0]}`
    }
    if (!options.endDate) {
      options['endDate'] = `${date[1]}`
    }
    fetchURLRanking(options)
      .then((data) => {
        setURLs(URLs.concat(data))
        if (URLs.length % 1000 !== 0 || URLs.length === 0) {
          setHasMoreURLs(false)
        }
        setLoading(false)
      })
      .catch((erorr) => {
        console.error(erorr)
      })
  }

  const onFormSubmit = (e) => {
    e.preventDefault()
    setURLs([])
    setHasMoreURLs(true)
    setOffset(0)
    handleChangeFormValue()
  }

  const buildParams = () => {
    const params = new URLSearchParams()
    params.set('keywords', keywords.current.value)
    params.set('dataSetType', props.dataSetType)
    params.set('offset', offset)
    params.set('startDate', date[0])
    params.set('endDate', date[1])
    return params
  }

  const handleChangeFormValue = () => {
    const params = buildParams()
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  const onChageDate = (date) => {
    setDate(date)
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
                    placeholder='keywords'
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
              <DateRangePicker onChange={onChageDate} value={date} />
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
            前の100件
          </button>
          <button
            className='button is-info'
            onClick={() => {
              setLower(lower + barCount)
            }}
            disabled={URLs.length <= lower + barCount}
          >
            次の100件
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
