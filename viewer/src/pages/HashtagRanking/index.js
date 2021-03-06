import React, { useState, useEffect } from 'react'
import { useLocation, useHistory } from 'react-router-dom'
import DisplayHashtagsRanking from '../Display/DisplayHashtagRanking'
import InfiniteScroll from 'react-infinite-scroller'
import HashtagsRankingChart from './HashtagRankingChart'
import { setLoading, formatDate } from '../../services/index'
import { fetchHashtagRanking } from '../../services/api'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

const barCount = 50

const HashtagRanking = () => {
  const location = useLocation()
  const history = useHistory()
  const [hashtags, setHashtags] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreHashtags, setHasMoreHashtags] = useState(true)
  const [lower, setLower] = useState(0)

  const graphData = hashtags.slice(lower, lower + barCount).reverse()

  const loadHashtags = () => {
    const params = new URLSearchParams(location.search)
    setLoading(true)
    const options = {}
    for (const [key, value] of params) {
      options[key] = value
    }
    options['offset'] = `${offset}`
    if (!options.dataSetType) {
      options['dataSetType'] = process.env.DEFAULT_DATASET
    }
    if (!options.startDate) {
      options['startDate'] = '2011-03-01'
    }
    if (!options.endDate) {
      options['endDate'] = formatDate(new Date(), 'yyyy-MM-dd')
    }
    fetchHashtagRanking(options)
      .then((data) => {
        setHashtags((prevHashtags) => prevHashtags.concat(data))
        if (data.length % 1000 !== 0 || data.length === 0) {
          setHasMoreHashtags(false)
        }
        setOffset((prevOffset) => prevOffset + 1000)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const buildParams = ({ startDate, endDate }) => {
    const params = new URLSearchParams(location.search)
    if (`${startDate}` !== 'undefined') {
      params.set('startDate', startDate)
    }
    if (`${endDate}` !== 'undefined') {
      params.set('endDate', endDate)
    }
    return params
  }

  const onChangeDate = ([startDate, endDate]) => {
    setHashtags([])
    setOffset(0)
    const params = buildParams({
      startDate: formatDate(new Date(startDate), 'yyyy-MM-dd'),
      endDate: formatDate(new Date(endDate), 'yyyy-MM-dd')
    })
    history.push(`${location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    loadHashtags()
  }, [location])

  const params = new URLSearchParams(location.search)

  return (
    <div>
      <div className='box'>
        <form>
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
        </form>
      </div>
      <div className='box'>
        <HashtagsRankingChart data={graphData} />
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
            disabled={hashtags.length <= lower + barCount}
          >
            {`次の${barCount}件`}
          </button>
        </div>
      </div>
      <div className='box'>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadHashtags}
          hasMore={hasMoreHashtags}
        >
          {hashtags.map((hashtag, i) => {
            return <DisplayHashtagsRanking key={i} hashtag={hashtag} />
          })}
        </InfiniteScroll>
      </div>
    </div>
  )
}

export default HashtagRanking
