import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import DisplayHashtagsRanking from '../Display/DisplayHashtagRanking'
import InfiniteScroll from 'react-infinite-scroller'
import HashtagsRankingChart from './HashtagRankingChart'
import { setLoading, formatDate } from '../../services/index'
import { fetchHashtagRanking } from '../../services/api'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

const barCount = 50

const HashtagRanking = (props) => {
  const params = new URLSearchParams(props.location.search)
  const [hashtags, setHashtags] = useState([])
  const [offset, setOffset] = useState(0)
  const [hasMoreHashtags, setHasMoreHashtags] = useState(false)
  const [lower, setLower] = useState(0)

  const graphData = hashtags.slice(lower, lower + barCount).reverse()

  const loadHashtags = () => {
    setLoading(true)
    const params = new URLSearchParams(props.location.search)
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
        setHashtags(hashtags.concat(data))
        if (hashtags.length % 1000 !== 0 || hashtags.length === 0) {
          setHasMoreHashtags(false)
        }
        setOffset(offset + 1000)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }

  const buildParams = (dates) => {
    const params = new URLSearchParams()
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

  const onChangeDate = (dates) => {
    const params = buildParams(dates)
    props.history.push(`${props.location.pathname}?${params.toString()}`)
  }

  useEffect(() => {
    loadHashtags()
  }, [props.location])

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

export default withRouter(HashtagRanking)
